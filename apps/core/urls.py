from django.urls import path
from django.views.generic import TemplateView
from .views import healthz, terms

app_name = "core"

urlpatterns = [
    path("healthz/", healthz, name="healthz"),
    path("terms/", terms, name="terms"),

    # TEMP: render the converted feed template directly
    path("feed/", TemplateView.as_view(template_name="feed/feed.html"), name="feed"),
]
