from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=16, unique=True)
    points = models.PositiveIntegerField(default=0)
    total_points = models.PositiveIntegerField(default=0)
    helped = models.PositiveIntegerField(default=0)

    sfx_volume = models.PositiveSmallIntegerField(default=5)
    music_volume = models.PositiveSmallIntegerField(default=5)
    # is_compact = models.BooleanField(default=False)

    level = models.PositiveIntegerField(default=1)
    wildcard1 = models.CharField(max_length=45, default="", blank=True)
    wildcard2 = models.CharField(max_length=45, default="", blank=True)
    wildcard3 = models.CharField(max_length=45, default="", blank=True)
    extender = models.CharField(max_length=45, default="", blank=True)

    def __str__(self):
        return f'User {self.id}: {self.username}'

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "points": self.points,
            "total_points": self.total_points,
            "helped": self.helped,
            "sfx_volume": self.sfx_volume,
            "music_volume": self.music_volume,
            # "is_compact": self.is_compact,
            "level": self.level,
            'wildcards': {
                    'wildcard1' : self.wildcard1, 
                    'wildcard2' : self.wildcard2, 
                    'wildcard3' : self.wildcard3
                },
            'extenders': {
                    'extender': self.extender
                }
        }
        
class Word(models.Model):
    word = models.CharField(max_length=45, unique=True, db_index=True)

    def __str__(self):
        return f'{self.word}'

    def serialize(self):
        return {
            "word": self.word
        }

class Game(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games')
    points = models.PositiveIntegerField()
    helped = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    words = models.ManyToManyField(Word, related_name='games')
    max_combo = models.PositiveIntegerField()
    ave_multiplier = models.DecimalField(max_digits=5, decimal_places=4)

    def __str__(self):
        return f'Game {self.id}: {self.player.username}'

    def serialize(self):
        return {
            "id": self.id,
            "player": self.player.username,
            "player_id": self.player.id,
            "points": self.points,
            "helped": self.points,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "max_combo": self.max_combo,
            "ave_multiplier": self.ave_multiplier
        }

