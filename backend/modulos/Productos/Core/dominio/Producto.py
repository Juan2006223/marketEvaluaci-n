from dataclasses import dataclass
from typing import Optional
from decimal import Decimal
from modulos.Productos.Core.dominio.ProductoId import ProductoId
from modulos.Productos.Core.dominio.ProductoTitulo import ProductoTitulo
from modulos.Productos.Core.dominio.ProductoTipo import ProductoTipo
from modulos.Productos.Core.dominio.ProductoPrecio import ProductoPrecio
from modulos.Productos.Core.dominio.ProductoSeccion import ProductoSeccion
from modulos.Productos.Core.dominio.CategoriaId import CategoriaId

@dataclass
class Producto:
    """Entidad de dominio - Recurso/Producto del Marketplace CINNDET UPN.
    Puro Python, sin dependencias de Django ni de ninguna librería externa.
    """
    id: Optional[ProductoId]
    titulo: ProductoTitulo
    descripcion: str
    descripcion_corta: str
    tipo_recurso: ProductoTipo
    precio: ProductoPrecio
    categoria_id: CategoriaId
    imagen_url: str = ""
    url_externa: str = ""
    seccion: ProductoSeccion = ProductoSeccion("destacadas")
    es_destacado: bool = False
    activo: bool = True
    categoria_nombre: Optional[str] = None
    categoria_slug: Optional[str] = None
    fecha_creacion: Optional[str] = None
    fecha_actualizacion: Optional[str] = None

    # Métodos de negocio de dominio
    def marcar_destacado(self):
        self.es_destacado = True

    def desmarcar_destacado(self):
        self.es_destacado = False

    def desactivar(self):
        self.activo = False

    def activar(self):
        self.activo = True

    def tiene_acceso_externo(self) -> bool:
        return bool(self.url_externa and self.url_externa.strip().startswith("http"))

    def __str__(self):
        return str(self.titulo)
