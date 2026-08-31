from dataclasses import dataclass
from typing import Optional
from modulos.Productos.Core.dominio.CategoriaId import CategoriaId

@dataclass
class Categoria:
    """Entidad de dominio - Categoría de recursos educativos/tecnológicos.
    Puro Python, sin dependencias de Django.
    """
    id: Optional[CategoriaId]
    nombre: str
    slug: str
    descripcion: str = ""
    activo: bool = True

    def __post_init__(self):
        if not self.nombre or len(self.nombre.strip()) < 2:
            raise ValueError("El nombre de la categoría debe tener al menos 2 caracteres.")
        if not self.slug or len(self.slug.strip()) < 2:
            raise ValueError("El slug de la categoría debe tener al menos 2 caracteres.")

    def __str__(self):
        return self.nombre
