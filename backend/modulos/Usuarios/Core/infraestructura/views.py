"""
Vistas de autenticación y perfil de usuario.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import Http404
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Añade claims adicionales al token JWT y respuesta de login."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["is_staff"] = user.is_staff
        token["is_superuser"] = user.is_superuser
        token["rol"] = "admin" if (user.is_staff or user.is_superuser) else "usuario"
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "is_staff": self.user.is_staff,
            "is_superuser": self.user.is_superuser,
            "rol": "admin" if (self.user.is_staff or self.user.is_superuser) else "usuario",
        }
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GoogleLoginView(APIView):
    """POST /api/auth/google/ — valida el ID token de Google y emite JWT local."""
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get("credential")
        client_id = getattr(settings, "GOOGLE_OAUTH_CLIENT_ID", "")
        if not client_id:
            return Response({"error": "El acceso con Google no está configurado."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if not credential:
            return Response({"error": "No se recibió la credencial de Google."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            datos = id_token.verify_oauth2_token(credential, google_requests.Request(), client_id)
        except ValueError:
            return Response({"error": "La credencial de Google es inválida o no pertenece a esta aplicación."}, status=status.HTTP_401_UNAUTHORIZED)

        if not datos.get("email_verified") or not datos.get("email"):
            return Response({"error": "Google no confirmó un correo electrónico verificado."}, status=status.HTTP_400_BAD_REQUEST)

        email = datos["email"].lower()
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            base_username = f"google_{datos['sub']}"[:150]
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                suffix += 1
                username = f"{base_username[:145]}_{suffix}"
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=datos.get("given_name", "")[:150],
                last_name=datos.get("family_name", "")[:150],
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id, "username": user.username, "email": user.email,
                "first_name": user.first_name, "last_name": user.last_name,
                "is_staff": user.is_staff, "is_superuser": user.is_superuser,
                "rol": "admin" if (user.is_staff or user.is_superuser) else "usuario",
            },
        }, status=status.HTTP_200_OK)


class EvaluatorBootstrapView(APIView):
    """Alta única de evaluador; queda deshabilitada sin token de entorno."""
    permission_classes = [AllowAny]

    def post(self, request):
        token = getattr(settings, "EVALUATOR_BOOTSTRAP_TOKEN", "")
        if not token or request.headers.get("X-Bootstrap-Token") != token:
            raise Http404

        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")
        if not username or not email or len(password) < 12:
            return Response({"error": "Datos de evaluador inválidos."}, status=status.HTTP_400_BAD_REQUEST)

        user, _ = User.objects.get_or_create(username=username, defaults={"email": email})
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()
        return Response({"detail": "Cuenta evaluadora creada."}, status=status.HTTP_201_CREATED)


class UsuarioMeView(APIView):
    """GET /api/auth/me/ — Consulta del perfil del usuario autenticado."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        datos = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "rol": "admin" if (user.is_staff or user.is_superuser) else "usuario",
        }
        return Response(datos, status=status.HTTP_200_OK)
