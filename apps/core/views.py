from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect

def root_view(request):
    # Root landing: authenticated -> feed, anonymous -> login/register
    if request.user.is_authenticated:
        return redirect("/feed/")
    return redirect("/login/")

def healthz(request):
    return JsonResponse({"status": "ok"})

def terms(request):
    return HttpResponse("Terms/Privacy placeholder")
