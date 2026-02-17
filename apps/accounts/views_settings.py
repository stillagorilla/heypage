from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def settings_view(request):
    # TODO: account edits + privacy + notifications
    return render(request, "accounts/settings.html")
