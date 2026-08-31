from typing import Dict, Any
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository

class CrearCategoria:
    def __init__(self, repositorio: CategoriaRepository):
        self._repositorio = repositorio

    def ejecutar(self, datos: Dict[str, Any]) -> Categoria:
        nombre = datos.get("name", "")
        slug = datos.get("slug", "")
        if not nombre or len(nombre.strip()) < 2:
            raise ValueError("El nombre de la categoría debe tener al menos 2 caracteres.")
        if not slug or len(slug.strip()) < 2:
            raise ValueError("El slug de la categoría debe tener al menos 2 caracteres.")
        
        existente = self._repositorio.obtener_por_slug(slug)
        if existente:
            raise ValueError(f"Ya existe una categoría con el slug '{slug}'.")
            
        return self._repositorio.crear(datos)
