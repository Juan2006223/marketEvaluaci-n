from decimal import Decimal
from typing import Dict, Any
from modulos.Productos.Core.dominio.Producto import Producto
from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository
from modulos.Productos.Core.dominio.ProductoTitulo import ProductoTitulo
from modulos.Productos.Core.dominio.ProductoPrecio import ProductoPrecio
from modulos.Productos.Core.dominio.ProductoSeccion import ProductoSeccion
from modulos.Productos.Core.dominio.ProductoTipo import ProductoTipo

class ActualizarProducto:
    """Caso de uso: Actualizar un recurso existente."""

    def __init__(self, repositorio: ProductoRepository):
        self._repositorio = repositorio

    def ejecutar(self, producto_id: int, datos: Dict[str, Any]) -> Producto:
        existente = self._repositorio.obtener_por_id(producto_id)
        if not existente:
            raise ValueError(f"Producto con id={producto_id} no existe.")

        if "title" in datos:
            ProductoTitulo(datos["title"])
        if "price" in datos:
            ProductoPrecio(Decimal(str(datos["price"] or 0)))
        if "section" in datos and datos["section"]:
            ProductoSeccion(datos["section"])
        if "resource_type" in datos and datos["resource_type"]:
            ProductoTipo(datos["resource_type"])

        return self._repositorio.actualizar(producto_id, datos)
