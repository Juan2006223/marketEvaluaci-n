"""
Pruebas unitarias de casos de uso utilizando repositorios en memoria (Mocks).
"""
import unittest
from decimal import Decimal
from typing import List, Optional, Dict, Any

from modulos.Productos.Core.dominio.Producto import Producto
from modulos.Productos.Core.dominio.ProductoId import ProductoId
from modulos.Productos.Core.dominio.ProductoTitulo import ProductoTitulo
from modulos.Productos.Core.dominio.ProductoPrecio import ProductoPrecio
from modulos.Productos.Core.dominio.ProductoSeccion import ProductoSeccion
from modulos.Productos.Core.dominio.ProductoTipo import ProductoTipo
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.CategoriaId import CategoriaId
from modulos.Productos.Core.dominio.ProductoRepository import ProductoRepository
from modulos.Productos.Core.dominio.CategoriaRepository import CategoriaRepository

from modulos.Productos.Core.aplicacion.ObtenerProductos.ObtenerProductos import ObtenerProductos
from modulos.Productos.Core.aplicacion.ObtenerProducto.ObtenerProducto import ObtenerProducto
from modulos.Productos.Core.aplicacion.CrearProducto.CrearProducto import CrearProducto
from modulos.Productos.Core.aplicacion.ActualizarProducto.ActualizarProducto import ActualizarProducto
from modulos.Productos.Core.aplicacion.EliminarProducto.EliminarProducto import EliminarProducto

from modulos.Productos.Core.aplicacion.Categorias.ObtenerCategorias import ObtenerCategorias
from modulos.Productos.Core.aplicacion.Categorias.ObtenerCategoria import ObtenerCategoria
from modulos.Productos.Core.aplicacion.Categorias.CrearCategoria import CrearCategoria
from modulos.Productos.Core.aplicacion.Categorias.ActualizarCategoria import ActualizarCategoria
from modulos.Productos.Core.aplicacion.Categorias.EliminarCategoria import EliminarCategoria

class MockProductoRepository(ProductoRepository):
    def __init__(self):
        self.productos: Dict[int, Producto] = {}
        self.current_id = 1

    def obtener_todos(self, filtros: Optional[Dict[str, Any]] = None) -> List[Producto]:
        filtros = filtros or {}
        resultado = list(self.productos.values())
        if filtros.get("activos_solo", True):
            resultado = [p for p in resultado if p.activo]
        if filtros.get("category"):
            resultado = [p for p in resultado if p.categoria_slug == filtros["category"]]
        if filtros.get("resource_type"):
            resultado = [p for p in resultado if str(p.tipo_recurso) == filtros["resource_type"]]
        if filtros.get("search"):
            q = filtros["search"].lower()
            resultado = [p for p in resultado if q in str(p.titulo).lower() or q in p.descripcion.lower()]
        return resultado

    def obtener_por_id(self, producto_id: int) -> Optional[Producto]:
        return self.productos.get(producto_id)

    def crear(self, datos: Dict[str, Any]) -> Producto:
        p = Producto(
            id=ProductoId(self.current_id),
            titulo=ProductoTitulo(datos["title"]),
            descripcion=datos.get("description", ""),
            descripcion_corta=datos.get("short_description", ""),
            tipo_recurso=ProductoTipo(datos.get("resource_type", "herramienta_digital")),
            precio=ProductoPrecio(Decimal(str(datos.get("price", 0) or 0))),
            categoria_id=CategoriaId(1),
            categoria_slug=datos.get("category", "ia"),
            url_externa=datos.get("external_url", ""),
            seccion=ProductoSeccion(datos.get("section", "destacadas")),
            es_destacado=datos.get("is_featured", False),
            activo=datos.get("is_active", True),
        )
        self.productos[self.current_id] = p
        self.current_id += 1
        return p

    def actualizar(self, producto_id: int, datos: Dict[str, Any]) -> Producto:
        p = self.productos[producto_id]
        if "title" in datos:
            p.titulo = ProductoTitulo(datos["title"])
        if "description" in datos:
            p.descripcion = datos["description"]
        if "is_active" in datos:
            p.activo = datos["is_active"]
        return p

    def eliminar(self, producto_id: int) -> None:
        self.productos.pop(producto_id, None)


class MockCategoriaRepository(CategoriaRepository):
    def __init__(self):
        self.categorias: Dict[int, Categoria] = {}
        self.current_id = 1

    def obtener_todas(self, solo_activas: bool = True) -> List[Categoria]:
        resultado = list(self.categorias.values())
        if solo_activas:
            resultado = [c for c in resultado if c.activo]
        return resultado

    def obtener_por_id(self, categoria_id: int) -> Optional[Categoria]:
        return self.categorias.get(categoria_id)

    def obtener_por_slug(self, slug: str) -> Optional[Categoria]:
        for c in self.categorias.values():
            if c.slug == slug:
                return c
        return None

    def crear(self, datos: Dict[str, Any]) -> Categoria:
        c = Categoria(
            id=CategoriaId(self.current_id),
            nombre=datos["name"],
            slug=datos["slug"],
            descripcion=datos.get("description", ""),
            activo=datos.get("is_active", True)
        )
        self.categorias[self.current_id] = c
        self.current_id += 1
        return c

    def actualizar(self, categoria_id: int, datos: Dict[str, Any]) -> Categoria:
        c = self.categorias[categoria_id]
        if "name" in datos:
            c.nombre = datos["name"]
        if "slug" in datos:
            c.slug = datos["slug"]
        if "is_active" in datos:
            c.activo = datos["is_active"]
        return c

    def eliminar(self, categoria_id: int) -> None:
        self.categorias.pop(categoria_id, None)


class TestCasosDeUso(unittest.TestCase):

    def setUp(self):
        self.repo_prod = MockProductoRepository()
        self.repo_cat = MockCategoriaRepository()

    def test_crear_y_obtener_producto(self):
        crear_uc = CrearProducto(self.repo_prod)
        producto = crear_uc.ejecutar({
            "title": "Tutor IA UPN",
            "description": "Tutor inteligente",
            "category": "ia",
            "resource_type": "herramienta_digital",
            "section": "destacadas"
        })
        self.assertEqual(producto.id.valor, 1)
        self.assertEqual(str(producto.titulo), "Tutor IA UPN")

        obtener_uc = ObtenerProducto(self.repo_prod)
        recuperado = obtener_uc.ejecutar(1)
        self.assertEqual(recuperado.id.valor, 1)

    def test_filtrar_productos_por_busqueda(self):
        crear_uc = CrearProducto(self.repo_prod)
        crear_uc.ejecutar({"title": "Laboratorio VR Química", "category": "vr", "resource_type": "herramienta_digital"})
        crear_uc.ejecutar({"title": "Kit de Gamificación", "category": "gamificacion", "resource_type": "recurso_educativo"})

        listar_uc = ObtenerProductos(self.repo_prod)
        resultado = listar_uc.ejecutar(filtros={"search": "Química"})
        self.assertEqual(len(resultado), 1)
        self.assertEqual(str(resultado[0].titulo), "Laboratorio VR Química")

    def test_eliminar_producto(self):
        crear_uc = CrearProducto(self.repo_prod)
        p = crear_uc.ejecutar({"title": "App Evaluación", "category": "apps"})

        eliminar_uc = EliminarProducto(self.repo_prod)
        eliminar_uc.ejecutar(p.id.valor)

        obtener_uc = ObtenerProducto(self.repo_prod)
        with self.assertRaises(ValueError):
            obtener_uc.ejecutar(p.id.valor)

    def test_actualizar_producto(self):
        crear_uc = CrearProducto(self.repo_prod)
        p = crear_uc.ejecutar({"title": "Original Title", "category": "ia"})

        actualizar_uc = ActualizarProducto(self.repo_prod)
        actualizado = actualizar_uc.ejecutar(p.id.valor, {"title": "Updated Title"})
        self.assertEqual(str(actualizado.titulo), "Updated Title")

    def test_crud_categorias_casos_uso(self):
        # 1. Crear
        crear_cat_uc = CrearCategoria(self.repo_cat)
        cat = crear_cat_uc.ejecutar({"name": "Gamificación", "slug": "gamificacion"})
        self.assertEqual(cat.nombre, "Gamificación")

        # 2. Obtener
        obtener_cat_uc = ObtenerCategoria(self.repo_cat)
        recuperada = obtener_cat_uc.ejecutar(cat.id.valor)
        self.assertEqual(recuperada.slug, "gamificacion")

        # 3. Actualizar
        act_cat_uc = ActualizarCategoria(self.repo_cat)
        actualizada = act_cat_uc.ejecutar(cat.id.valor, {"name": "Gamificación y Aprendizaje Lúdico"})
        self.assertEqual(actualizada.nombre, "Gamificación y Aprendizaje Lúdico")

        # 4. Eliminar
        elim_cat_uc = EliminarCategoria(self.repo_cat)
        elim_cat_uc.ejecutar(cat.id.valor)
        with self.assertRaises(ValueError):
            obtener_cat_uc.ejecutar(cat.id.valor)

    def test_crear_categoria_duplicada_falla(self):
        crear_cat_uc = CrearCategoria(self.repo_cat)
        crear_cat_uc.ejecutar({"name": "Gamificación", "slug": "gamificacion"})
        
        with self.assertRaises(ValueError):
            crear_cat_uc.ejecutar({"name": "Gamificación 2", "slug": "gamificacion"})

if __name__ == "__main__":
    unittest.main()
