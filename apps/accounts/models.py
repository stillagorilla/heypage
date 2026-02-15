from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

RESERVED_USERNAMES = {
    # entity prefixes
    'g', 'b',

    # fixed routes
    'search', 'settings', 'login', 'logout', 'register', 'reset-password', 'chat',

    # common reserved
    'admin', 'api', 'static', 'media', 'favicon.ico', 'robots.txt',
}

def validate_username_not_reserved(value: str):
    if value is None:
        return
    if value.lower() in RESERVED_USERNAMES:
        raise ValidationError('This username is reserved.')

class User(AbstractUser):
    # AbstractUser already has username/email/first_name/last_name.
    # Add display_name for public UI.
    display_name = models.CharField(max_length=80, blank=True)

    def clean(self):
        super().clean()
        validate_username_not_reserved(self.username)
