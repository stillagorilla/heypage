from django.http import HttpResponse

def group_home(request, slug):
    return HttpResponse(f'Group {slug} (stub)')

def business_home(request, slug):
    return HttpResponse(f'Business {slug} (stub)')
