from django.shortcuts import render

def search(request):
    q = (request.GET.get("q") or "").strip()
    # TODO: implement per-entity icontains queries + pagination + tab switching
    return render(request, "search/search.html", {"q": q})
