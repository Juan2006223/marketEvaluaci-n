from typing import List, Optional, Dict, Any
from modulos.Productos.Core.dominio.Producto import Producto
from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository

class ObtenerProductos:
    """Caso de uso: Obtener listado de productos/recursos con filtros opcionales.
    Lógica de negocio pura — sin Django, sin HTTP, sin BD directa.
    """

    def __init__(self, repositorio: ProductoRepository):
        self._repositorio = repositorio

    def ejecutar(self, filtros: Optional[Dict[str, Any]] = None) -> List[Producto]:
        return self._repositorio.obtener_todos(filtros=filtros)
