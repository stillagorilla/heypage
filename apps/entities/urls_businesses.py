from django.urls import path
from . import views

urlpatterns = [
    path('<slug:slug>/', views.business_home, name='business-home'),
]
