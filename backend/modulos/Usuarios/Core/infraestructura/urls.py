from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from modulos.Usuarios.Core.infraestructura.views import CustomTokenObtainPairView, GoogleLoginView, UsuarioMeView

urlpatterns = [
    path("token/",         CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(),          name="token_refresh"),
    path("me/",            UsuarioMeView.as_view(),             name="usuario_me"),
    path("google/",        GoogleLoginView.as_view(),           name="google_login"),
]
