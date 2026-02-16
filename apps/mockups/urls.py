from django.urls import path
from . import views

urlpatterns = [
    path('mockups/', views.index, name='mockups_index'),
    path('mockups/<path:path>', views.serve, name='mockups_serve'),
]
