from django.shortcuts import render, redirect
from django.http import HttpResponseNotFound

def login_register_page(request):
    return render(request, "accounts/login_register.html")

def login_view(request):
    if request.method == "POST":
        # TODO authenticate
        return redirect("core:healthz")
    return redirect("accounts:login_register")  # or render same page with anchor

def register_view(request):
    if request.method == "POST":
        # TODO create user
        return redirect("accounts:login_register")
    return redirect("accounts:login_register")

def password_reset_view(request):
    return HttpResponseNotFound("Not implemented yet")

def social_login_google(request):
    return HttpResponseNotFound("Google login not wired yet")

def social_login_facebook(request):
    return HttpResponseNotFound("Facebook login not wired yet")

def profile_view(request, username):
    return HttpResponseNotFound("Profile page not implemented yet")

from django.http import HttpResponse

def settings_view(request):
    return HttpResponse("Settings stub (temporary)", content_type="text/plain")
