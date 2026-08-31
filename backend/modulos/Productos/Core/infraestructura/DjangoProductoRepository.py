"""
Implementación concreta de ProductoRepository usando Django ORM.
Capa de Infraestructura - Adaptador de Base de Datos.
"""
from typing import List, Optional, Dict, Any
from decimal import Decimal
from django.db.models import Q

from modulos.Productos.Core.dominio.Producto import Producto
from modulos.Productos.Core.dominio.ProductoId import ProductoId
from modulos.Productos.Core.dominio.ProductoTitulo import ProductoTitulo
from modulos.Productos.Core.dominio.ProductoPrecio import ProductoPrecio
from modulos.Productos.Core.dominio.ProductoSeccion import ProductoSeccion
from modulos.Productos.Core.dominio.ProductoTipo import ProductoTipo
from modulos.Productos.Core.dominio.CategoriaId import CategoriaId
from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository
from modulos.Productos.Core.infraestructura.models import ProductoORM, CategoriaORM

class DjangoProductoRepository(ProductoRepository):
    """Adaptador: traduce entre el ORM de Django y las entidades de dominio puro."""

    def _orm_a_entidad(self, orm: ProductoORM) -> Producto:
        return Producto(
            id                  = ProductoId(orm.id),
            titulo              = ProductoTitulo(orm.title),
            descripcion         = orm.description or "",
            descripcion_corta   = orm.short_description or "",
            tipo_recurso        = ProductoTipo(orm.resource_type or "herramienta_digital"),
            precio              = ProductoPrecio(Decimal(str(orm.price or 0))),
            categoria_id        = CategoriaId(orm.category_id),
            imagen_url          = orm.image_url or (orm.image.url if orm.image else ""),
            url_externa         = orm.external_url or "",
            seccion             = ProductoSeccion(orm.section or "destacadas"),
            es_destacado        = orm.is_featured,
            activo              = orm.is_active,
            categoria_nombre    = orm.category.name if hasattr(orm, "category") and orm.category else None,
            categoria_slug      = orm.category.slug if hasattr(orm, "category") and orm.category else None,
            fecha_creacion      = orm.created_at.isoformat() if orm.created_at else None,
            fecha_actualizacion = orm.updated_at.isoformat() if orm.updated_at else None,
        )

    def obtener_todos(self, filtros: Optional[Dict[str, Any]] = None) -> List[Producto]:
        filtros = filtros or {}
        qs = ProductoORM.objects.select_related("category")

        # Filtro por estado activo (por defecto solo activos para público, configurable)
        if filtros.get("activos_solo", True):
            qs = qs.filter(is_active=True)
        elif "is_active" in filtros and filtros["is_active"] is not None:
            qs = qs.filter(is_active=filtros["is_active"])

        # Filtro por sección
        if filtros.get("section") and filtros["section"] != "all":
            qs = qs.filter(section=filtros["section"])

        # Filtro por categoría (slug)
        if filtros.get("category") and filtros["category"] != "all":
            qs = qs.filter(category__slug=filtros["category"])

        # Filtro por tipo de recurso
        if filtros.get("resource_type") and filtros["resource_type"] != "all":
            qs = qs.filter(resource_type=filtros["resource_type"])

        # Filtro por destacado
        if filtros.get("is_featured") is True:
            qs = qs.filter(is_featured=True)

        # Filtro por búsqueda de texto
        busqueda = filtros.get("search") or filtros.get("q")
        if busqueda:
            qs = qs.filter(
                Q(title__icontains=busqueda) |
                Q(description__icontains=busqueda) |
                Q(short_description__icontains=busqueda) |
                Q(category__name__icontains=busqueda)
            )

        return [self._orm_a_entidad(p) for p in qs]

    def obtener_por_id(self, producto_id: int) -> Optional[Producto]:
        try:
            orm = ProductoORM.objects.select_related("category").get(id=producto_id)
            return self._orm_a_entidad(orm)
        except ProductoORM.DoesNotExist:
            return None

    def crear(self, datos: Dict[str, Any]) -> Producto:
        # Resolver categoría por slug o id
        categoria_ref = datos["category"]
        if isinstance(categoria_ref, int) or (isinstance(categoria_ref, str) and categoria_ref.isdigit()):
            categoria = CategoriaORM.objects.get(id=int(categoria_ref))
        else:
            categoria = CategoriaORM.objects.get(slug=categoria_ref)

        orm = ProductoORM.objects.create(
            title             = datos["title"],
            description       = datos.get("description", ""),
            short_description = datos.get("short_description", ""),
            resource_type     = datos.get("resource_type", "herramienta_digital"),
            price             = Decimal(str(datos.get("price", 0) or 0)),
            category          = categoria,
            image_url         = datos.get("image_url", ""),
            external_url      = datos.get("external_url", ""),
            section           = datos.get("section", "destacadas"),
            is_featured       = bool(datos.get("is_featured", False)),
            is_active         = bool(datos.get("is_active", True)),
        )
        return self._orm_a_entidad(orm)

    def actualizar(self, producto_id: int, datos: Dict[str, Any]) -> Producto:
        orm = ProductoORM.objects.select_related("category").get(id=producto_id)
        for campo, valor in datos.items():
            if campo == "category" and valor is not None:
                if isinstance(valor, int) or (isinstance(valor, str) and valor.isdigit()):
                    orm.category = CategoriaORM.objects.get(id=int(valor))
                else:
                    orm.category = CategoriaORM.objects.get(slug=valor)
            elif campo == "price" and valor is not None:
                orm.price = Decimal(str(valor or 0))
            elif hasattr(orm, campo):
                setattr(orm, campo, valor)
        orm.save()
        orm.refresh_from_db()
        return self._orm_a_entidad(orm)

    def eliminar(self, producto_id: int) -> None:
        ProductoORM.objects.filter(id=producto_id).delete()
