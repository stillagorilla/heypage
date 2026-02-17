from django.contrib import admin
from django.urls import include, path, re_path
from apps.accounts import views as account_views
from apps.core import views as core_views

urlpatterns = [
    path("admin/", admin.site.urls),

    # Root landing: authenticated -> feed, anonymous -> login/register
    path("", core_views.root_view, name="root"),

    # Core fixed endpoints (healthz, terms, feed, etc.)
    # Keep these before entity/user catch-alls.
    path("", include(("apps.core.urls", "core"), namespace="core")),

    # Prefixed entity namespaces
    path("g/", include("apps.entities.urls_groups")),
    path("b/", include("apps.entities.urls_businesses")),

    # Fixed feature routes
    path("search/", include(("apps.search.urls", "search"), namespace="search")),
    path("settings/", include(("apps.accounts.urls_settings", "accounts_settings"), namespace="accounts_settings")),
    path("chat/", include("apps.chat.urls")),

    # Accounts (login/register/logout/etc.) — keep before mockups & username
    path("", include(("apps.accounts.urls", "accounts"), namespace="accounts")),

    # Mockups browser (must be before username catch-all)
    path("", include("apps.mockups.urls")),

    # Root-level username catch-all LAST
    re_path(r"^(?P<username>[A-Za-z0-9_\.]{3,30})/$", account_views.profile_view, name="profile"),
]
