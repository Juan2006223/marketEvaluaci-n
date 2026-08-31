from typing import List
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository

class ObtenerCategorias:
    def __init__(self, repositorio: CategoriaRepository):
        self._repositorio = repositorio

    def ejecutar(self, solo_activas: bool = True) -> List[Categoria]:
        return self._repositorio.obtener_todas(solo_activas=solo_activas)
