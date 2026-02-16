from __future__ import annotations

import os
from pathlib import Path
from django.conf import settings
from django.http import FileResponse, Http404, HttpResponseForbidden
from django.shortcuts import render

BASE_DIR = Path(__file__).resolve().parents[2]
MOCKUPS_DIR = BASE_DIR / 'mockups-original'

def _client_ip(request) -> str:
    # Prefer X-Forwarded-For when behind nginx
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')

def _is_allowed(request) -> bool:
    enabled = os.environ.get('HP_MOCKUPS_ENABLED', '0') == '1'
    if not enabled:
        return False
    allowed = os.environ.get('HP_MOCKUPS_ALLOWED_IPS', '')
    allowed_ips = {ip.strip() for ip in allowed.split(',') if ip.strip()}
    return _client_ip(request) in allowed_ips

def index(request):
    if not _is_allowed(request):
        return HttpResponseForbidden('Mockups browser disabled.')

    if not MOCKUPS_DIR.exists():
        raise Http404('mockups-original not found.')

    files = sorted([p for p in MOCKUPS_DIR.rglob('*') if p.is_file()])
    rel_files = [str(p.relative_to(MOCKUPS_DIR)) for p in files]
    return render(request, 'mockups/index.html', {'files': rel_files})

def serve(request, path: str):
    if not _is_allowed(request):
        return HttpResponseForbidden('Mockups browser disabled.')

    target = (MOCKUPS_DIR / path).resolve()
    if not str(target).startswith(str(MOCKUPS_DIR.resolve())):
        raise Http404('Invalid path.')

    if not target.exists() or not target.is_file():
        raise Http404('Not found.')

    return FileResponse(open(target, 'rb'))
