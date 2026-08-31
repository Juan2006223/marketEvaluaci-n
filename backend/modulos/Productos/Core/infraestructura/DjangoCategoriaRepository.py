"""
Adaptador concreto de CategoriaRepository usando Django ORM.
"""
from typing import List, Optional, Dict, Any
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.CategoriaId import CategoriaId
from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository
from modulos.Productos.Core.infraestructura.models import CategoriaORM

class DjangoCategoriaRepository(CategoriaRepository):

    def _orm_a_entidad(self, orm: CategoriaORM) -> Categoria:
        return Categoria(
            id          = CategoriaId(orm.id),
            nombre      = orm.name,
            slug        = orm.slug,
            descripcion = orm.description or "",
            activo      = orm.is_active,
        )

    def obtener_todas(self, solo_activas: bool = True) -> List[Categoria]:
        qs = CategoriaORM.objects.all()
        if solo_activas:
            qs = qs.filter(is_active=True)
        return [self._orm_a_entidad(c) for c in qs]

    def obtener_por_id(self, categoria_id: int) -> Optional[Categoria]:
        try:
            orm = CategoriaORM.objects.get(id=categoria_id)
            return self._orm_a_entidad(orm)
        except CategoriaORM.DoesNotExist:
            return None

    def obtener_por_slug(self, slug: str) -> Optional[Categoria]:
        try:
            orm = CategoriaORM.objects.get(slug=slug)
            return self._orm_a_entidad(orm)
        except CategoriaORM.DoesNotExist:
            return None

    def crear(self, datos: Dict[str, Any]) -> Categoria:
        orm = CategoriaORM.objects.create(
            name        = datos["name"],
            slug        = datos["slug"],
            description = datos.get("description", ""),
            is_active   = datos.get("is_active", True),
        )
        return self._orm_a_entidad(orm)

    def actualizar(self, categoria_id: int, datos: Dict[str, Any]) -> Categoria:
        orm = CategoriaORM.objects.get(id=categoria_id)
        if "name" in datos:
            orm.name = datos["name"]
        if "slug" in datos:
            orm.slug = datos["slug"]
        if "description" in datos:
            orm.description = datos["description"]
        if "is_active" in datos:
            orm.is_active = datos["is_active"]
        orm.save()
        orm.refresh_from_db()
        return self._orm_a_entidad(orm)

    def eliminar(self, categoria_id: int) -> None:
        CategoriaORM.objects.filter(id=categoria_id).delete()
