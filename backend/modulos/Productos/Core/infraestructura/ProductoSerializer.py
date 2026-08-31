"""
Serializadores DRF — adaptadores de infraestructura para validación y serialización HTTP.
"""
from rest_framework import serializers
from modulos.Productos.Core.infraestructura.models import CategoriaORM, ProductoORM

class CategoriaSerializer(serializers.ModelSerializer):
    """Serializador de salida para Categorías."""
    class Meta:
        model = CategoriaORM
        fields = ["id", "name", "slug", "description", "is_active", "created_at", "updated_at"]

class CategoriaCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializador de entrada para crear/actualizar Categorías."""
    name = serializers.CharField(max_length=100, min_length=2)
    slug = serializers.SlugField(max_length=100, min_length=2)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    is_active = serializers.BooleanField(required=False, default=True)

    class Meta:
        model = CategoriaORM
        fields = ["name", "slug", "description", "is_active"]


class ProductoSerializer(serializers.ModelSerializer):
    """Serializador de salida (lectura) para Productos / Recursos."""
    category_name = serializers.ReadOnlyField(source="category.name")
    category_slug = serializers.ReadOnlyField(source="category.slug")
    category_id   = serializers.ReadOnlyField(source="category.id")

    class Meta:
        model = ProductoORM
        fields = [
            "id",
            "title",
            "description",
            "short_description",
            "resource_type",
            "price",
            "category",
            "category_id",
            "category_name",
            "category_slug",
            "image_url",
            "image",
            "external_url",
            "section",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        ]


class ProductoCreateSerializer(serializers.Serializer):
    """Serializador de entrada (escritura) para crear/actualizar Recursos."""
    title             = serializers.CharField(max_length=200, min_length=3)
    description       = serializers.CharField(required=False, allow_blank=True, default="")
    short_description = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")
    resource_type     = serializers.ChoiceField(
        choices=["herramienta_digital", "recurso_educativo", "servicio", "capacitacion", "otro"],
        default="herramienta_digital"
    )
    price             = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)
    category          = serializers.CharField()
    image_url         = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")
    external_url      = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")
    section           = serializers.ChoiceField(
        choices=["destacadas", "mes", "recomendadas", "general"],
        default="destacadas"
    )
    is_featured       = serializers.BooleanField(required=False, default=False)
    is_active         = serializers.BooleanField(required=False, default=True)


def entidad_producto_a_dict(producto) -> dict:
    """Convierte una entidad de dominio Producto a diccionario serializable."""
    return {
        "id": producto.id.valor if producto.id else None,
        "title": str(producto.titulo),
        "description": producto.descripcion,
        "short_description": producto.descripcion_corta,
        "resource_type": str(producto.tipo_recurso),
        "price": float(producto.precio.valor),
        "category_id": producto.categoria_id.valor if producto.categoria_id else None,
        "category_name": producto.categoria_nombre,
        "category_slug": producto.categoria_slug,
        "image_url": producto.imagen_url,
        "external_url": producto.url_externa,
        "section": str(producto.seccion),
        "is_featured": producto.es_destacado,
        "is_active": producto.activo,
        "created_at": producto.fecha_creacion,
        "updated_at": producto.fecha_actualizacion,
    }


def entidad_categoria_a_dict(categoria) -> dict:
    """Convierte una entidad de dominio Categoria a diccionario serializable."""
    return {
        "id": categoria.id.valor if categoria.id else None,
        "name": categoria.nombre,
        "slug": categoria.slug,
        "description": categoria.descripcion,
        "is_active": categoria.activo,
    }
