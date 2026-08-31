from typing import Optional
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository

class ObtenerCategoria:
    def __init__(self, repositorio: CategoriaRepository):
        self._repositorio = repositorio

    def ejecutar(self, categoria_id: int) -> Optional[Categoria]:
        cat = self._repositorio.obtener_por_id(categoria_id)
        if not cat:
            raise ValueError(f"Categoría con id={categoria_id} no encontrada.")
        return cat
