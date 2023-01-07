# Create your views here.

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.urls import reverse

from .models import User, Word, Game
from django.db.models import Count, Max, Avg

import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

# from django import forms

# GET Routes

def index(request):
    return render(request, 'index.html')

def profile(request, profile_id=None):

    # store message for this render, then delete session variable
    if 'message' not in request.session:
        request.session['message'] = None
    message = request.session['message']
    del request.session['message']

    if request.method != 'GET':
        return HttpResponseRedirect(reverse('index')) 

    try:
        profile_user = User.objects.get(id=profile_id)
    except User.DoesNotExist:
        return HttpResponseRedirect(reverse('index'))

    # queryset of all profile user's games
    profile_games = Game.objects.filter(player=profile_user)

    # profile user's last 10 games
    profile_game_history = profile_games.order_by('-id')[:10]

    # profile user's longest chain
    longest_chain = profile_games.aggregate(Max('max_combo'))

    # profile user's average multiplier
    average_multiplier = profile_games.aggregate(Avg('ave_multiplier'))

    # profile user's top 20 used words across all their games, and their tallies, descending
    profile_words = (Word.objects.filter(games__in=profile_games)
        .values('word').annotate(count=Count('word'))
        .order_by('-count', 'word')[:20])

    # top 15 games ever, by dust, with dust per game, descending
    dust_leaderboard = Game.objects.all().exclude(player__is_superuser=True).order_by('-points')[:15]
    # top 15 games ever, by helped, with helped per game, descending
    helped_leaderboard = Game.objects.all().exclude(player__is_superuser=True).order_by('-helped')[:15]
    
    profile_data = profile_user.serialize()

    return render(request, "shiristory/profile.html", {
        'profile_user': profile_user,
        'is_owner': profile_user == request.user,
        'profile': profile_data,
        'dust_leaderboard': dust_leaderboard,
        'helped_leaderboard': helped_leaderboard,
        'profile_game_history': profile_game_history,
        'profile_words': profile_words,
        'longest_chain': longest_chain,
        'average_multiplier': average_multiplier,
        'prices': {
            'attune': 25,
            'reattune': 25,
            'levelup': 10 * profile_data['level']
        },
        
        'message': message
    })

def leaderboard(request):

    if request.method != 'GET':
        return HttpResponseRedirect(reverse('index')) 

    # top 15 games ever, by dust, with dust per game, descending
    dust_leaderboard = Game.objects.all().exclude(player__is_superuser=True).order_by('-points')[:15]
    # top 15 games ever, by helped, with helped per game, descending
    helped_leaderboard = Game.objects.all().exclude(player__is_superuser=True).order_by('-helped')[:15]
    

    return render(request, "shiristory/leaderboard.html", {
        'dust_leaderboard': dust_leaderboard,
        'helped_leaderboard': helped_leaderboard
    })



# API Routes

def wordlist(request):
    with open('shiristory/static/shiristory/wordlist.json', 'r') as file:
        wordlist = json.load(file)
        return JsonResponse(wordlist)

def wordstats(request):
    pass
# word usage statistics?
# user data?
# dig out the old API ideas...




# game PUT routes

# todo figure out how to use csrf from a react template
@csrf_exempt
@login_required
# save settings into logged in user
def settings(request):
    if request.method != 'PUT':
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)
    
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Not logged in."
        }, status=400)

    # print(f'sfx volume before: {request.user.sfx_volume}')
    data = json.loads(request.body)
    request.user.sfx_volume = data.get("sfxVolume")
    request.user.music_volume = data.get("musicVolume")
    # request.user.is_compact = data.get("isCompact")
    request.user.save()
    # print(f'sfx volume after: {request.user.sfx_volume}')

    return HttpResponse(status=204)



# game POST routes

@csrf_exempt
@login_required
def gamesave(request):
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)

    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "Not logged in."
        }, status=400)

    data = json.loads(request.body)
    points = data.get("points")
    helped = data.get("helped")
    used_words = data.get("words")
    max_combo = data.get("max_combo")
    ave_multiplier = data.get("ave_multiplier")

    # add completed Game to DB
    game = Game(player=request.user, points=points, helped=helped, max_combo=max_combo, ave_multiplier=ave_multiplier)
    game.save()

    # update profile's dust, helped, and total dust
    request.user.points = request.user.points + points
    request.user.total_points = request.user.total_points + points
    request.user.helped = request.user.helped + helped
    request.user.save()

    # add new Word to DB if it doesn't exist, then relate each Word used to 'game' (game_words many-to-many table)
    for used_word in used_words:
        try:
            word = Word.objects.get(word=used_word)
        except Word.DoesNotExist:
            word = Word(word=used_word)
            word.save()
        game.words.add(word)
        
    return HttpResponse(status=204)

@login_required
def level(request, data):
    # 'data' should be an integer for level ups
    # 'data' should be a string for spellword changes
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required."
        }, status=400)
    # if request.POST.get('_method', False) != 'PUT':
    #     return JsonResponse({
    #         "error": "PUT request required."
    #     }, status=400)

    # todo centralize price data into database
    prices = {
            'attune': 25,
            'reattune': 25,
            'levelup': 10 * int(request.user.level)
        }

    # Update spellword using dust
    prev_spell = getattr(request.user, data, None)
    # is not None includes empty string, ""
    if prev_spell is not None:
        spell_type = data
        new_spell = request.POST['spellword'].lower()

        # if blank, allow it and make it cost nothing
        if new_spell == "":
            request.session['message'] = 'Nothing happened.'
            if getattr(request.user, spell_type) != "":
                setattr(request.user, spell_type, new_spell)
                request.user.save()
                request.session['message'] = 'Released attunement.'
            return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))

        # else, check if among existing spellwords
        current_spellwords = [request.user.wildcard1, request.user.wildcard2, request.user.wildcard3, request.user.extender]
        if new_spell in current_spellwords:
            request.session['message'] = 'This word is already attuned.'
            return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))

        # else, check if valid word...
        with open('shiristory/static/shiristory/wordlist.json', 'r') as file:
            wordlist = json.load(file)
            word_array = wordlist[str(len(new_spell))]    
            if new_spell not in word_array:
                request.session['message'] = 'Invalid word.'
                return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))

        # then, check if there are enough points...
        if prev_spell == "":
            spell_price = prices['attune']
        else:
            spell_price = prices['reattune']
        if request.user.points < spell_price:
            request.session['message'] = 'Not enough dust.'
            return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))

        # then, deduct points and set new spellword
        request.user.points = request.user.points - spell_price
        setattr(request.user, spell_type, new_spell)
        request.user.save()
        request.session['message'] = 'Spellword created!'
        return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))
        


    # Level up using dust
    try:
        if int(data) == request.user.level:
            
            # todo, jury-rigged: if at level cap, just in case
            if request.user.level >= 4:
                return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))

            # not enough points to level?
            if request.user.points < prices['levelup']:
                request.session['message'] = 'Not enough dust.'
                return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))
            
            # deduct points, then level up
            request.user.points = request.user.points - prices['levelup']
            request.user.level = request.user.level + 1
            request.user.save()
            request.session['message'] = 'Level Up!'
            return HttpResponseRedirect(reverse('profile', kwargs={'profile_id':request.user.id}))
    except ValueError:
        pass

    return JsonResponse({
        "error": "Invalid request."
    }, status=400)




# Authentication Routes

def login_view(request):
    if request.method != "POST":
        return render(request, "shiristory/login.html")

    # Attempt to sign user in
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)

    if user is None:
        return render(request, "shiristory/login.html", {
            "message": "Invalid username and/or password."
        })

    login(request, user)
    return HttpResponseRedirect(reverse("index"))

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method != "POST":
        return render(request, "shiristory/register.html")

    username = request.POST["username"]
    if len(username) > 16:
        return render(request, "shiristory/register.html", {
            "message": "Username cannot exceed 16 characters."
        })

    password = request.POST["password"]
    confirmation = request.POST["confirmation"]
    # password = ""
    # confirmation = ""
    if password != confirmation:
        return render(request, "shiristory/register.html", {
            "message": "Passwords must match."
        })

    # Ensure username is available, then create user
    try:
        user = User.objects.create_user(username, None, password)
        user.save()
    except IntegrityError:
        return render(request, "shiristory/register.html", {
            "message": "Username already taken."
        })
    
    # Login new user and redirect to index view
    login(request, user)
    return HttpResponseRedirect(reverse("index"))


