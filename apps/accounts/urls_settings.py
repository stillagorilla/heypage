from django.urls import path
from . import views_settings

app_name = "accounts_settings"

urlpatterns = [
    path("", views_settings.settings_view, name="settings"),
]
