from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from modulos.Productos.Core.dominio.Producto import Producto

class ProductoRepository(ABC):
    """Puerto (interfaz abstracta) para operaciones de persistencia de Productos/Recursos.
    La capa de aplicación depende únicamente de este contrato.
    """

    @abstractmethod
    def obtener_todos(self, filtros: Optional[Dict[str, Any]] = None) -> List[Producto]:
        """Retorna lista de productos aplicando filtros opcionales (categoria, tipo, seccion, busqueda, activos_solo)."""
        pass

    @abstractmethod
    def obtener_por_id(self, producto_id: int) -> Optional[Producto]:
        """Retorna un producto por su identificador único, o None si no existe."""
        pass

    @abstractmethod
    def crear(self, datos: Dict[str, Any]) -> Producto:
        """Persiste un nuevo producto y lo retorna como entidad de dominio."""
        pass

    @abstractmethod
    def actualizar(self, producto_id: int, datos: Dict[str, Any]) -> Producto:
        """Actualiza un producto existente y lo retorna como entidad de dominio."""
        pass

    @abstractmethod
    def eliminar(self, producto_id: int) -> None:
        """Elimina un producto por su identificador único."""
        pass
