from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("login-register/", views.login_register_page, name="login_register"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),

    path("reset-password/", views.password_reset_view, name="password_reset"),
    path("social/google/", views.social_login_google, name="social_login_google"),
    path("social/facebook/", views.social_login_facebook, name="social_login_facebook"),
]
