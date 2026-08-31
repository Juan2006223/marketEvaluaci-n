from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository

class EliminarProducto:
    """Caso de uso: Eliminar un producto por ID."""

    def __init__(self, repositorio: ProductoRepository):
        self._repositorio = repositorio

    def ejecutar(self, producto_id: int) -> None:
        existente = self._repositorio.obtener_por_id(producto_id)
        if not existente:
            raise ValueError(f"Producto con id={producto_id} no existe.")
        self._repositorio.eliminar(producto_id)
