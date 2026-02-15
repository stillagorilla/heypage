from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

def login_view(request):
    return HttpResponse('Login (stub)')

def register_view(request):
    return HttpResponse('Register (stub)')

@login_required
def settings_view(request):
    return HttpResponse('Settings (stub)')

def profile_view(request, username):
    return HttpResponse(f'Profile for {username} (stub)')
