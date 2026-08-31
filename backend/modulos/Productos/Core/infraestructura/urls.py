from rest_framework.routers import DefaultRouter
from modulos.Productos.Core.infraestructura.ProductoController import ProductoController, CategoriaController

router = DefaultRouter()
router.register(r"productos", ProductoController, basename="producto")
router.register(r"categorias", CategoriaController, basename="categoria")

urlpatterns = router.urls
