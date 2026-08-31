from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from modulos.Productos.Core.dominio.Categoria import Categoria

class CategoriaRepository(ABC):
    """Puerto (interfaz abstracta) para operaciones de persistencia de Categorías."""

    @abstractmethod
    def obtener_todas(self, solo_activas: bool = True) -> List[Categoria]:
        """Retorna todas las categorías."""
        pass

    @abstractmethod
    def obtener_por_id(self, categoria_id: int) -> Optional[Categoria]:
        """Retorna una categoría por ID o None si no existe."""
        pass

    @abstractmethod
    def obtener_por_slug(self, slug: str) -> Optional[Categoria]:
        """Retorna una categoría por slug o None si no existe."""
        pass

    @abstractmethod
    def crear(self, datos: Dict[str, Any]) -> Categoria:
        """Crea y persiste una nueva categoría."""
        pass

    @abstractmethod
    def actualizar(self, categoria_id: int, datos: Dict[str, Any]) -> Categoria:
        """Actualiza y retorna una categoría existente."""
        pass

    @abstractmethod
    def eliminar(self, categoria_id: int) -> None:
        """Elimina una categoría por ID."""
        pass
