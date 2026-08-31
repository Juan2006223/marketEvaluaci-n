"""
Controladores HTTP (ViewSets) de Productos y Categorías.
Capa de Infraestructura Hexagonal.
UNICA RESPONSABILIDAD: Recibir la petición HTTP, invocar el caso de uso correspondiente
y retornar la respuesta HTTP serializada con paginación y manejo de errores consistente.
NO CONTIENE LÓGICA DE NEGOCIO NI CONSULTAS DIRECTAS AL ORM.
"""
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.pagination import PageNumberPagination

# Casos de Uso de Productos
from modulos.Productos.Core.aplicacion.ObtenerProductos.ObtenerProductos import ObtenerProductos
from modulos.Productos.Core.aplicacion.ObtenerProducto.ObtenerProducto import ObtenerProducto
from modulos.Productos.Core.aplicacion.CrearProducto.CrearProducto import CrearProducto
from modulos.Productos.Core.aplicacion.ActualizarProducto.ActualizarProducto import ActualizarProducto
from modulos.Productos.Core.aplicacion.EliminarProducto.EliminarProducto import EliminarProducto

# Casos de Uso de Categorías
from modulos.Productos.Core.aplicacion.Categorias.ObtenerCategorias import ObtenerCategorias
from modulos.Productos.Core.aplicacion.Categorias.ObtenerCategoria import ObtenerCategoria
from modulos.Productos.Core.aplicacion.Categorias.CrearCategoria import CrearCategoria
from modulos.Productos.Core.aplicacion.Categorias.ActualizarCategoria import ActualizarCategoria
from modulos.Productos.Core.aplicacion.Categorias.EliminarCategoria import EliminarCategoria

# Adaptadores de Repositorio y Serializadores
from modulos.Productos.Core.infraestructura.DjangoProductoRepository import DjangoProductoRepository
from modulos.Productos.Core.infraestructura.DjangoCategoriaRepository import DjangoCategoriaRepository
from modulos.Productos.Core.infraestructura.ProductoSerializer import (
    ProductoCreateSerializer,
    CategoriaCreateUpdateSerializer,
    entidad_producto_a_dict,
    entidad_categoria_a_dict,
)

class CatalogoPaginacion(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100


class ProductoController(viewsets.ViewSet):
    """Controlador HTTP de Productos/Recursos basado en casos de uso con soporte de paginación."""

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAdminUser()]

    def _repositorio(self):
        return DjangoProductoRepository()

    def list(self, request):
        """GET /api/productos/ — Catálogo público con filtros y paginación."""
        filtros = {
            "section":       request.query_params.get("section"),
            "category":      request.query_params.get("category"),
            "resource_type": request.query_params.get("resource_type"),
            "search":        request.query_params.get("search") or request.query_params.get("q"),
            "is_featured":   request.query_params.get("is_featured") == "true" if "is_featured" in request.query_params else None,
            "activos_solo":  request.query_params.get("all") != "true" if not (request.user and request.user.is_staff) else False,
        }
        # Limpiar filtros None
        filtros = {k: v for k, v in filtros.items() if v is not None}
        
        caso_uso = ObtenerProductos(self._repositorio())
        productos = caso_uso.ejecutar(filtros=filtros)
        datos = [entidad_producto_a_dict(p) for p in productos]

        # Paginación DRF
        paginator = CatalogoPaginacion()
        page = paginator.paginate_queryset(datos, request)
        if page is not None:
            return paginator.get_paginated_response(page)
            
        return Response(datos, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """GET /api/productos/{id}/ — Detalle de un producto."""
        try:
            caso_uso = ObtenerProducto(self._repositorio())
            producto = caso_uso.ejecutar(int(pk))
            return Response(entidad_producto_a_dict(producto), status=status.HTTP_200_OK)
        except (ValueError, TypeError) as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """POST /api/productos/ — Crear nuevo producto (solo admin)."""
        serializer = ProductoCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            caso_uso = CrearProducto(self._repositorio())
            producto = caso_uso.ejecutar(serializer.validated_data)
            return Response(entidad_producto_a_dict(producto), status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """PUT /api/productos/{id}/ — Actualizar producto (solo admin)."""
        serializer = ProductoCreateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        try:
            caso_uso = ActualizarProducto(self._repositorio())
            producto = caso_uso.ejecutar(int(pk), serializer.validated_data)
            return Response(entidad_producto_a_dict(producto), status=status.HTTP_200_OK)
        except ValueError as e:
            if "no existe" in str(e).lower() or "no encontrado" in str(e).lower():
                return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        """PATCH /api/productos/{id}/ — Actualización parcial (solo admin)."""
        return self.update(request, pk=pk)

    def destroy(self, request, pk=None):
        """DELETE /api/productos/{id}/ — Eliminar producto (solo admin)."""
        try:
            caso_uso = EliminarProducto(self._repositorio())
            caso_uso.ejecutar(int(pk))
            return Response({"mensaje": "Producto eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class CategoriaController(viewsets.ViewSet):
    """Controlador HTTP de Categorías — CRUD completo desacoplado del ORM."""

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsAdminUser()]

    def _repositorio(self):
        return DjangoCategoriaRepository()

    def list(self, request):
        """GET /api/categorias/ — Lista de categorías."""
        solo_activas = request.query_params.get("all") != "true" if not (request.user and request.user.is_staff) else False
        caso_uso = ObtenerCategorias(self._repositorio())
        categorias = caso_uso.ejecutar(solo_activas=solo_activas)
        return Response([entidad_categoria_a_dict(c) for c in categorias], status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """GET /api/categorias/{id}/ — Detalle de una categoría."""
        try:
            caso_uso = ObtenerCategoria(self._repositorio())
            categoria = caso_uso.ejecutar(int(pk))
            return Response(entidad_categoria_a_dict(categoria), status=status.HTTP_200_OK)
        except (ValueError, TypeError) as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):
        """POST /api/categorias/ — Crear categoría (solo admin)."""
        serializer = CategoriaCreateUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            caso_uso = CrearCategoria(self._repositorio())
            categoria = caso_uso.ejecutar(serializer.validated_data)
            return Response(entidad_categoria_a_dict(categoria), status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """PUT /api/categorias/{id}/ — Actualizar categoría (solo admin)."""
        serializer = CategoriaCreateUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        try:
            caso_uso = ActualizarCategoria(self._repositorio())
            categoria = caso_uso.ejecutar(int(pk), serializer.validated_data)
            return Response(entidad_categoria_a_dict(categoria), status=status.HTTP_200_OK)
        except ValueError as e:
            if "no existe" in str(e).lower() or "no encontrada" in str(e).lower():
                return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        return self.update(request, pk=pk)

    def destroy(self, request, pk=None):
        """DELETE /api/categorias/{id}/ — Eliminar categoría (solo admin)."""
        try:
            caso_uso = EliminarCategoria(self._repositorio())
            caso_uso.ejecutar(int(pk))
            return Response({"mensaje": "Categoría eliminada"}, status=status.HTTP_204_NO_CONTENT)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
