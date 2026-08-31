"""
Modelos ORM de Django para Productos y Categorías.
SOLO se usan en la capa de infraestructura (adaptadores de repositorio).
El dominio NO importa este archivo directamente.
"""
from django.db import models

class CategoriaORM(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        app_label = "productos"
        db_table = "marketplace_category"
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["name"]


class SeccionORM(models.Model):
    """Configuración administrable de una sección pública del Marketplace."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    description = models.TextField(blank=True, default="")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "productos"
        db_table = "marketplace_section"
        ordering = ["display_order", "name"]


class ProductoORM(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ("herramienta_digital", "Herramienta Digital"),
        ("recurso_educativo",   "Recurso Educativo"),
        ("servicio",            "Servicio Institucional"),
        ("capacitacion",        "Capacitación / Taller"),
        ("otro",                "Otro"),
    ]

    SECTION_CHOICES = [
        ("destacadas",   "Soluciones Destacadas"),
        ("mes",          "Innovaciones del Mes"),
        ("recomendadas", "Colección Recomendada"),
        ("general",      "Catálogo General"),
    ]

    title             = models.CharField(max_length=200)
    description       = models.TextField()
    short_description = models.CharField(max_length=500, blank=True, default="")
    resource_type     = models.CharField(max_length=30, choices=RESOURCE_TYPE_CHOICES, default="herramienta_digital")
    price             = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    category          = models.ForeignKey(CategoriaORM, related_name="products", on_delete=models.CASCADE)
    image_url         = models.URLField(max_length=1000, blank=True, default="")
    image             = models.ImageField(upload_to="products/", blank=True, null=True)
    image_data        = models.TextField(blank=True, default="")
    external_url      = models.URLField(max_length=1000, blank=True, default="")
    section           = models.CharField(max_length=20, choices=SECTION_CHOICES, default="destacadas")
    is_featured       = models.BooleanField(default=False)
    is_active         = models.BooleanField(default=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        app_label = "productos"
        db_table = "marketplace_product"
        verbose_name = "Producto / Recurso"
        verbose_name_plural = "Productos / Recursos"
        ordering = ["-created_at"]
