"""
Pruebas de integración de la API REST (Django REST Framework).
Valida endpoints, paginación, permisos, filtros, manejo de errores 404/400/401/403
y flujos de autenticación JWT.
"""
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from modulos.Productos.Core.infraestructura.models import CategoriaORM, ProductoORM

class TestMarketplaceAPI(TestCase):

    def setUp(self):
        self.client = APIClient()
        
        # Crear usuario administrador (staff)
        self.admin_user = User.objects.create_superuser(
            username="admin@upn.edu.co",
            email="admin@upn.edu.co",
            password="admin_seguro_password"
        )
        
        # Crear usuario normal (no staff)
        self.normal_user = User.objects.create_user(
            username="estudiante@upn.edu.co",
            email="estudiante@upn.edu.co",
            password="user_seguro_password"
        )

        # Crear categorías iniciales
        self.cat_ia = CategoriaORM.objects.create(
            name="Inteligencia Artificial", slug="ia", description="Modelos y analítica"
        )
        self.cat_vr = CategoriaORM.objects.create(
            name="Realidad Virtual", slug="vr", description="Simulación inmersiva"
        )

        # Crear productos activos iniciales
        self.prod1 = ProductoORM.objects.create(
            title="Tutor IA UPN",
            description="Tutor virtual con IA",
            short_description="Tutor con IA",
            resource_type="herramienta_digital",
            category=self.cat_ia,
            section="destacadas",
            is_featured=True,
            is_active=True,
            external_url="https://www.upn.edu.co/tutor"
        )

        self.prod2 = ProductoORM.objects.create(
            title="Laboratorio de Química VR",
            description="Laboratorio inmersivo",
            short_description="Lab VR",
            resource_type="recurso_educativo",
            category=self.cat_vr,
            section="mes",
            is_featured=False,
            is_active=True,
            external_url="https://www.upn.edu.co/lab-quimica"
        )

        self.prod3 = ProductoORM.objects.create(
            title="Simulador de Robótica",
            description="Simulador para mecatrónica",
            short_description="Robótica educativa",
            resource_type="herramienta_digital",
            category=self.cat_vr,
            section="recomendadas",
            is_featured=False,
            is_active=True,
            external_url="https://www.upn.edu.co/robotica"
        )

        # Producto inactivo (no debe aparecer en catálogo público)
        self.prod_inactivo = ProductoORM.objects.create(
            title="Recurso Desactivado Temporalmente",
            description="En mantenimiento pedagógico",
            short_description="Inactivo",
            resource_type="herramienta_digital",
            category=self.cat_ia,
            section="general",
            is_featured=False,
            is_active=False
        )

    # -------------------------------------------------------------------------
    # 1. Catálogo Público y Paginación
    # -------------------------------------------------------------------------
    def test_catalogo_publico_paginacion_estructura(self):
        response = self.client.get("/api/productos/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("results", response.data)
        # Solo los 3 productos activos deben aparecer
        self.assertEqual(response.data["count"], 3)
        self.assertEqual(len(response.data["results"]), 3)

    def test_catalogo_publico_paginacion_tamano_pagina(self):
        # Solicitar 2 por página
        response = self.client.get("/api/productos/?page=1&page_size=2")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)
        self.assertEqual(len(response.data["results"]), 2)
        self.assertIsNotNone(response.data["next"])
        self.assertIsNone(response.data["previous"])

        # Página 2
        response2 = self.client.get("/api/productos/?page=2&page_size=2")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response2.data["results"]), 1)
        self.assertIsNone(response2.data["next"])
        self.assertIsNotNone(response2.data["previous"])

    def test_recursos_inactivos_no_visibles_al_publico(self):
        response = self.client.get("/api/productos/")
        titulos = [p["title"] for p in response.data["results"]]
        self.assertNotIn("Recurso Desactivado Temporalmente", titulos)

    def test_catalogo_publico_filtrar_por_categoria(self):
        response = self.client.get("/api/productos/?category=ia")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "Tutor IA UPN")

    def test_catalogo_publico_filtrar_por_tipo_recurso(self):
        response = self.client.get("/api/productos/?resource_type=recurso_educativo")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "Laboratorio de Química VR")

    def test_catalogo_publico_filtrar_por_busqueda(self):
        response = self.client.get("/api/productos/?search=Química")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["title"], "Laboratorio de Química VR")

    # -------------------------------------------------------------------------
    # 2. Detalle y Manejo de Recursos Inexistentes (404)
    # -------------------------------------------------------------------------
    def test_detalle_producto_existente(self):
        response = self.client.get(f"/api/productos/{self.prod1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Tutor IA UPN")
        self.assertEqual(response.data["resource_type"], "herramienta_digital")

    def test_detalle_producto_inexistente_retorna_404(self):
        response = self.client.get("/api/productos/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    def test_actualizar_producto_inexistente_retorna_404(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.put("/api/productos/99999/", {"title": "No existe"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_eliminar_producto_inexistente_retorna_404(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete("/api/productos/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # -------------------------------------------------------------------------
    # 3. Permisos y CRUD de Productos
    # -------------------------------------------------------------------------
    def test_creacion_producto_anonimo_denegada_401(self):
        payload = {
            "title": "Nuevo Recurso",
            "category": "ia",
            "section": "destacadas"
        }
        response = self.client.post("/api/productos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_creacion_producto_usuario_normal_denegada_403(self):
        self.client.force_authenticate(user=self.normal_user)
        payload = {
            "title": "Nuevo Recurso Normal",
            "category": "ia",
            "section": "destacadas"
        }
        response = self.client.post("/api/productos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_crud_producto_como_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        
        # 1. Crear
        payload = {
            "title": "Simulador de Biología 3D",
            "description": "Simulador para ciencias naturales.",
            "short_description": "Simulador 3D",
            "resource_type": "herramienta_digital",
            "price": "0.00",
            "category": "vr",
            "section": "destacadas",
            "external_url": "https://www.upn.edu.co/biologia",
            "is_featured": True,
            "is_active": True
        }
        response = self.client.post("/api/productos/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        nuevo_id = response.data["id"]

        # 2. Actualizar
        update_payload = {"title": "Simulador de Biología 3D Avanzado"}
        response = self.client.put(f"/api/productos/{nuevo_id}/", update_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Simulador de Biología 3D Avanzado")

        # 3. Eliminar
        response = self.client.delete(f"/api/productos/{nuevo_id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # -------------------------------------------------------------------------
    # 4. CRUD y Manejo de Categorías
    # -------------------------------------------------------------------------
    def test_categorias_publicas_listar(self):
        response = self.client.get("/api/categorias/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_detalle_categoria_inexistente_retorna_404(self):
        response = self.client.get("/api/categorias/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_crud_categorias_como_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        
        # 1. Crear categoría
        res = self.client.post("/api/categorias/", {
            "name": "Gamificación Pedagógica",
            "slug": "gamificacion",
            "description": "Juegos y dinámicas formativas"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        cat_id = res.data["id"]
        self.assertEqual(res.data["slug"], "gamificacion")

        # 2. Actualizar categoría
        res_update = self.client.put(f"/api/categorias/{cat_id}/", {
            "name": "Gamificación y Aprendizaje Lúdico",
            "slug": "gamificacion-ludica",
            "description": "Actualizado"
        }, format="json")
        self.assertEqual(res_update.status_code, status.HTTP_200_OK)
        self.assertEqual(res_update.data["name"], "Gamificación y Aprendizaje Lúdico")

        # 3. Eliminar categoría
        res_delete = self.client.delete(f"/api/categorias/{cat_id}/")
        self.assertEqual(res_delete.status_code, status.HTTP_204_NO_CONTENT)

        # 4. Verificar que fue eliminada (404)
        res_check = self.client.get(f"/api/categorias/{cat_id}/")
        self.assertEqual(res_check.status_code, status.HTTP_404_NOT_FOUND)

    def test_crear_categoria_anonimo_denegado_401(self):
        res = self.client.post("/api/categorias/", {"name": "Nueva", "slug": "nueva"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_crear_categoria_usuario_normal_denegado_403(self):
        self.client.force_authenticate(user=self.normal_user)
        res = self.client.post("/api/categorias/", {"name": "Nueva", "slug": "nueva"}, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------------------------------------------------------
    # 5. Autenticación JWT y Perfil /api/auth/me/
    # -------------------------------------------------------------------------
    def test_login_jwt_y_consulta_perfil_me(self):
        # 1. Obtener Token JWT
        login_res = self.client.post("/api/auth/token/", {
            "username": "admin@upn.edu.co",
            "password": "admin_seguro_password"
        }, format="json")
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_res.data)
        token = login_res.data["access"]

        # 2. Consultar /api/auth/me/ con Bearer Token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        me_res = self.client.get("/api/auth/me/")
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data["username"], "admin@upn.edu.co")
        self.assertTrue(me_res.data["is_staff"])
        self.assertEqual(me_res.data["rol"], "admin")

    def test_usuario_normal_perfil_me(self):
        # 1. Token para usuario normal
        login_res = self.client.post("/api/auth/token/", {
            "username": "estudiante@upn.edu.co",
            "password": "user_seguro_password"
        }, format="json")
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        token = login_res.data["access"]

        # 2. Consultar /api/auth/me/
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        me_res = self.client.get("/api/auth/me/")
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertFalse(me_res.data["is_staff"])
        self.assertEqual(me_res.data["rol"], "usuario")
