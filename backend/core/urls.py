"""
Enrutador principal de URLs para Marketplace CINNDET UPN.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    # Módulos de la aplicación
    path("api/", include("modulos.Productos.Core.infraestructura.urls")),
    path("api/auth/", include("modulos.Usuarios.Core.infraestructura.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
