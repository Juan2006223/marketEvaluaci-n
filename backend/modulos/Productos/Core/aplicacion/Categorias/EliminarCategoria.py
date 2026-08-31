from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository

class EliminarCategoria:
    def __init__(self, repositorio: CategoriaRepository):
        self._repositorio = repositorio

    def ejecutar(self, categoria_id: int) -> None:
        existente = self._repositorio.obtener_por_id(categoria_id)
        if not existente:
            raise ValueError(f"Categoría con id={categoria_id} no existe.")
        self._repositorio.eliminar(categoria_id)
