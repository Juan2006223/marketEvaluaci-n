"""
Pruebas unitarias de dominio (Puro Python).
No dependen de Django ni de bases de datos.
"""
import unittest
from decimal import Decimal

from modulos.Productos.Core.dominio.ProductoId import ProductoId
from modulos.Productos.Core.dominio.ProductoTitulo import ProductoTitulo
from modulos.Productos.Core.dominio.ProductoPrecio import ProductoPrecio
from modulos.Productos.Core.dominio.ProductoSeccion import ProductoSeccion
from modulos.Productos.Core.dominio.ProductoTipo import ProductoTipo, TipoRecursoEnum
from modulos.Productos.Core.dominio.CategoriaId import CategoriaId
from modulos.Productos.Core.dominio.Categoria import Categoria
from modulos.Productos.Core.dominio.Producto import Producto

class TestDominio(unittest.TestCase):

    def test_producto_titulo_valido(self):
        t = ProductoTitulo("Laboratorio de Física")
        self.assertEqual(str(t), "Laboratorio de Física")

    def test_producto_titulo_muy_corto_falla(self):
        with self.assertRaises(ValueError):
            ProductoTitulo("ab")

    def test_producto_precio_valido(self):
        p = ProductoPrecio(Decimal("0.00"))
        self.assertEqual(p.valor, Decimal("0.00"))
        p2 = ProductoPrecio(Decimal("150.50"))
        self.assertEqual(p2.valor, Decimal("150.50"))

    def test_producto_precio_negativo_falla(self):
        with self.assertRaises(ValueError):
            ProductoPrecio(Decimal("-10.00"))

    def test_producto_seccion_valida(self):
        s = ProductoSeccion("destacadas")
        self.assertEqual(str(s), "destacadas")
        s2 = ProductoSeccion("general")
        self.assertEqual(str(s2), "general")

    def test_producto_seccion_invalida_falla(self):
        with self.assertRaises(ValueError):
            ProductoSeccion("seccion_inexistente")

    def test_producto_tipo_valido(self):
        t = ProductoTipo("herramienta_digital")
        self.assertEqual(t.valor, "herramienta_digital")
        self.assertEqual(t.etiqueta, "Herramienta Digital")

    def test_producto_tipo_invalido_falla(self):
        with self.assertRaises(ValueError):
            ProductoTipo("tipo_desconocido")

    def test_categoria_entidad_valida(self):
        c = Categoria(id=CategoriaId(1), nombre="Inteligencia Artificial", slug="ia")
        self.assertEqual(c.nombre, "Inteligencia Artificial")
        self.assertEqual(c.slug, "ia")
        self.assertTrue(c.activo)

    def test_categoria_nombre_invalido_falla(self):
        with self.assertRaises(ValueError):
            Categoria(id=CategoriaId(1), nombre=" ", slug="ia")

    def test_producto_entidad_y_metodos_negocio(self):
        prod = Producto(
            id=ProductoId(1),
            titulo=ProductoTitulo("Simulador VR"),
            descripcion="Simulador inmersivo para laboratorio.",
            descripcion_corta="Simulador inmersivo.",
            tipo_recurso=ProductoTipo("herramienta_digital"),
            precio=ProductoPrecio(Decimal("0.00")),
            categoria_id=CategoriaId(1),
            url_externa="https://cinndet.upn.edu.co/vr",
            seccion=ProductoSeccion("destacadas"),
            es_destacado=False,
            activo=True,
        )
        self.assertTrue(prod.tiene_acceso_externo())
        self.assertFalse(prod.es_destacado)
        
        prod.marcar_destacado()
        self.assertTrue(prod.es_destacado)
        
        prod.desactivar()
        self.assertFalse(prod.activo)
        prod.activar()
        self.assertTrue(prod.activo)

if __name__ == "__main__":
    unittest.main()
