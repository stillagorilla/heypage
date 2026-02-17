from django.urls import path
from . import views

app_name = "search"

urlpatterns = [
    # Hard results page (tabbed Users/Groups/Businesses)
    path("", views.search, name="results"),
]
