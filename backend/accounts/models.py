from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [('farmer', 'Farmer'), ('admin', 'Admin')]
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
        ('kn', 'Kannada'),
        ('ta', 'Tamil'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='farmer')
    phone = models.CharField(max_length=15, blank=True)
    preferred_language = models.CharField(
        max_length=10, choices=LANGUAGE_CHOICES, default='en'
    )
    district = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"