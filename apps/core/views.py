from django.http import JsonResponse, HttpResponse

def healthz(request):
    return JsonResponse({"status": "ok"})

def terms(request):
    return HttpResponse("Terms/Privacy placeholder")
