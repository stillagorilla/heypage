from django.contrib import admin
from django.urls import path, include, re_path
from apps.accounts import views as account_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.core.urls')),

    # Prefixed entity namespaces FIRST
    path('g/', include('apps.entities.urls_groups')),      # /g/<slug>/
    path('b/', include('apps.entities.urls_businesses')),  # /b/<slug>/

    # Fixed routes NEXT
    path('search/', include('apps.search.urls')),
    path('settings/', include('apps.accounts.urls_settings')),
    path('login/', account_views.login_view, name='login'),
    path('register/', account_views.register_view, name='register'),
    path('chat/', include('apps.chat.urls')),

    # Root-level username catch-all LAST
    re_path(r'^(?P<username>[A-Za-z0-9_\.]{3,30})/$', account_views.profile_view, name='profile'),
]
