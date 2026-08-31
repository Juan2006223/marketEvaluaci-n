from typing import Optional
from modulos.Productos.Core.dominio.Producto import Producto
from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository

class ObtenerProducto:
    """Caso de uso: Obtener un producto por su ID."""

    def __init__(self, repositorio: ProductoRepository):
        self._repositorio = repositorio

    def ejecutar(self, producto_id: int) -> Optional[Producto]:
        producto = self._repositorio.obtener_por_id(producto_id)
        if not producto:
            raise ValueError(f"Producto con id={producto_id} no encontrado.")
        return producto
