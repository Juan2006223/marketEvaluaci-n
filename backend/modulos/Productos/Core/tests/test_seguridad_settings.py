"""
Pruebas unitarias de validación estricta de seguridad en configuración para Producción (DEBUG=False).
Valida el rechazo de configuraciones inseguras y la aceptación de configuraciones PostgreSQL y CORS conformes.
"""
import unittest
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured
from core.settings import (
    validar_configuracion_cors,
    validar_y_construir_database_config,
)

class TestSeguridadProduccionSettings(unittest.TestCase):
    def setUp(self):
        self.base_dir = Path("/tmp")

    # -------------------------------------------------------------------------
    # 1. Pruebas de Validación de DATABASE_URL en Producción (DEBUG=False)
    # -------------------------------------------------------------------------
    def test_produccion_rechaza_database_url_vacia(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_y_construir_database_config(
                debug=False,
                database_url_raw="",
                base_dir=self.base_dir,
                is_test=False,
            )
        self.assertIn("DATABASE_URL es obligatoria", str(ctx.exception))

    def test_produccion_rechaza_sqlite(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_y_construir_database_config(
                debug=False,
                database_url_raw="sqlite:///db.sqlite3",
                base_dir=self.base_dir,
                is_test=False,
            )
        self.assertIn("SQLite ('sqlite://') no está permitido en producción", str(ctx.exception))

    def test_produccion_rechaza_esquema_invalido(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_y_construir_database_config(
                debug=False,
                database_url_raw="mysql://usuario:clave@localhost:3306/marketplace",
                base_dir=self.base_dir,
                is_test=False,
            )
        self.assertIn("Esquema de base de datos 'mysql' no soportado", str(ctx.exception))

    def test_produccion_rechaza_url_sin_host(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_y_construir_database_config(
                debug=False,
                database_url_raw="postgresql:///marketplace_cinndet",
                base_dir=self.base_dir,
                is_test=False,
            )
        self.assertIn("debe especificar un host válido", str(ctx.exception))

    def test_produccion_rechaza_url_sin_nombre_base(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_y_construir_database_config(
                debug=False,
                database_url_raw="postgresql://usuario:clave@db.upn.edu.co:5432/",
                base_dir=self.base_dir,
                is_test=False,
            )
        self.assertIn("debe especificar un nombre de base de datos", str(ctx.exception))

    def test_produccion_rechaza_puerto_invalido(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_y_construir_database_config(
                debug=False,
                database_url_raw="postgresql://usuario:clave@db.upn.edu.co:99999/marketplace",
                base_dir=self.base_dir,
                is_test=False,
            )
        self.assertIn("Puerto de base de datos inválido", str(ctx.exception))

    def test_produccion_acepta_postgresql_valida_con_credenciales(self):
        config = validar_y_construir_database_config(
            debug=False,
            database_url_raw="postgresql://user_upn%40admin:p%40ssw0rd!@db.upn.edu.co:5432/marketplace_cinndet",
            base_dir=self.base_dir,
            is_test=False,
        )
        self.assertEqual(config["ENGINE"], "django.db.backends.postgresql")
        self.assertEqual(config["NAME"], "marketplace_cinndet")
        self.assertEqual(config["USER"], "user_upn@admin")
        self.assertEqual(config["PASSWORD"], "p@ssw0rd!")
        self.assertEqual(config["HOST"], "db.upn.edu.co")
        self.assertEqual(config["PORT"], "5432")

    def test_desarrollo_conserva_sqlite_como_fallback(self):
        config = validar_y_construir_database_config(
            debug=True,
            database_url_raw="",
            base_dir=self.base_dir,
            is_test=False,
        )
        self.assertEqual(config["ENGINE"], "django.db.backends.sqlite3")

    # -------------------------------------------------------------------------
    # 2. Pruebas de Validación de CORS en Producción (DEBUG=False)
    # -------------------------------------------------------------------------
    def test_produccion_rechaza_cors_allow_all_true(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_configuracion_cors(
                debug=False,
                cors_allow_all_raw="True",
                cors_origins_raw="https://cinndet.upn.edu.co",
                is_test=False,
            )
        self.assertIn("CORS_ALLOW_ALL no puede ser True", str(ctx.exception))

    def test_produccion_rechaza_cors_origins_vacio(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_configuracion_cors(
                debug=False,
                cors_allow_all_raw="False",
                cors_origins_raw="",
                is_test=False,
            )
        self.assertIn("CORS_ALLOWED_ORIGINS debe estar definido", str(ctx.exception))

    def test_produccion_rechaza_cors_con_comodin(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_configuracion_cors(
                debug=False,
                cors_allow_all_raw="False",
                cors_origins_raw="*",
                is_test=False,
            )
        self.assertIn("El comodín '*' está prohibido", str(ctx.exception))

    def test_produccion_rechaza_cors_origen_http_no_seguro(self):
        with self.assertRaises(ImproperlyConfigured) as ctx:
            validar_configuracion_cors(
                debug=False,
                cors_allow_all_raw="False",
                cors_origins_raw="http://cinndet.upn.edu.co",
                is_test=False,
            )
        self.assertIn("Cada origen CORS en producción debe usar HTTPS", str(ctx.exception))

    def test_produccion_acepta_cors_https_valido(self):
        allow_all, origenes = validar_configuracion_cors(
            debug=False,
            cors_allow_all_raw="False",
            cors_origins_raw="https://cinndet.upn.edu.co,https://marketplace.upn.edu.co",
            is_test=False,
        )
        self.assertFalse(allow_all)
        self.assertEqual(len(origenes), 2)
        self.assertIn("https://cinndet.upn.edu.co", origenes)
        self.assertIn("https://marketplace.upn.edu.co", origenes)

    def test_desarrollo_permite_cors_abierto_y_origenes_locales(self):
        allow_all, origenes = validar_configuracion_cors(
            debug=True,
            cors_allow_all_raw="True",
            cors_origins_raw="http://localhost:5173",
            is_test=False,
        )
        self.assertTrue(allow_all)
        self.assertIn("http://localhost:5173", origenes)


if __name__ == "__main__":
    unittest.main()
