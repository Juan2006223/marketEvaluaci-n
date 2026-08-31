from typing import Dict, Any
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository

class ActualizarCategoria:
    def __init__(self, repositorio: CategoriaRepository):
        self._repositorio = repositorio

    def ejecutar(self, categoria_id: int, datos: Dict[str, Any]) -> Categoria:
        existente = self._repositorio.obtener_por_id(categoria_id)
        if not existente:
            raise ValueError(f"Categoría con id={categoria_id} no existe.")

        if "name" in datos and len(datos["name"].strip()) < 2:
            raise ValueError("El nombre de la categoría debe tener al menos 2 caracteres.")
        if "slug" in datos and len(datos["slug"].strip()) < 2:
            raise ValueError("El slug de la categoría debe tener al menos 2 caracteres.")

        return self._repositorio.actualizar(categoria_id, datos)
