from django.contrib import admin

# Register your models here.

from .models import User, Word, Game

class UserAdmin(admin.ModelAdmin):
    pass

# class WordAdmin(admin.ModelAdmin):
    # filter_horizontal = ('games',)

class GameAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'timestamp')
    filter_horizontal = ('words', )
    readonly_fields = ('timestamp', )

class GamesInline(admin.TabularInline):
    model = Game.words.through

class WordAdmin(admin.ModelAdmin):
    inlines = [GamesInline, ]

admin.site.register(User, UserAdmin)
admin.site.register(Word, WordAdmin)
admin.site.register(Game, GameAdmin)