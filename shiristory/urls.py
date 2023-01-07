from django.urls import path

from . import views

urlpatterns = [

    # GET Routes
    path('', views.index, name='index'),
    path('profile/<int:profile_id>', views.profile, name="profile"),
    path('leaderboard', views.leaderboard, name='leaderboard'),

    # API GET Routes
    path('wordlist', views.wordlist, name='wordlist'),
        # data collection GET routes only
        # for profile page stats, others...

    # POST Routes
    path('gamesave', views.gamesave, name='gamesave'),
    path('level/<str:data>', views.level, name='level'),

    # PUT Routes
    path('settings', views.settings, name='settings'),

    # Authentication Routes
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]
