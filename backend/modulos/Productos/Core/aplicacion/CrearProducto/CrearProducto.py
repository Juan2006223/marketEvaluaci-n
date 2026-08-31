from decimal import Decimal
from typing import Dict, Any
from modulos.Productos.Core.dominio.Producto import Producto
from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository
from modulos.Productos.Core.dominio.ProductoTitulo import ProductoTitulo
from modulos.Productos.Core.dominio.ProductoPrecio import ProductoPrecio
from modulos.Productos.Core.dominio.ProductoSeccion import ProductoSeccion
from modulos.Productos.Core.dominio.ProductoTipo import ProductoTipo

class CrearProducto:
    """Caso de uso: Crear un nuevo recurso pedagógico/tecnológico.
    Valida reglas de dominio antes de delegar la persistencia al repositorio.
    """

    def __init__(self, repositorio: ProductoRepository):
        self._repositorio = repositorio

    def ejecutar(self, datos: Dict[str, Any]) -> Producto:
        # Validaciones de dominio mediante Value Objects
        ProductoTitulo(datos.get("title", ""))
        ProductoPrecio(Decimal(str(datos.get("price", 0) or 0)))
        
        seccion = datos.get("section", "destacadas")
        if seccion:
            ProductoSeccion(seccion)

        tipo = datos.get("resource_type", "herramienta_digital")
        if tipo:
            ProductoTipo(tipo)

        return self._repositorio.crear(datos)
