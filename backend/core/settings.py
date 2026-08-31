"""
Django settings for Marketplace CINNDET UPN.
Arquitectura Hexagonal con soporte dual PostgreSQL (producción) y SQLite (desarrollo local y pruebas).
Validación estricta de seguridad en producción cuando DEBUG=False.
"""

import os
import sys
import urllib.parse
from pathlib import Path
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar variables de entorno desde backend/.env o .env
try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
    load_dotenv(BASE_DIR.parent / ".env")
except ImportError:
    pass

# -----------------------------------------------------------------------------
# 1. Modo de Ejecución y Validación de Seguridad
# -----------------------------------------------------------------------------
DEBUG_ENV = os.environ.get("DEBUG", "True").strip().lower()
DEBUG = DEBUG_ENV in ("true", "1", "yes")
IS_TEST_RUN = "test" in sys.argv

# Validar SECRET_KEY
RAW_SECRET_KEY = os.environ.get("SECRET_KEY", "").strip()
if not DEBUG and not IS_TEST_RUN:
    if not RAW_SECRET_KEY or "django-insecure" in RAW_SECRET_KEY or len(RAW_SECRET_KEY) < 32:
        raise ImproperlyConfigured(
            "ERROR DE SEGURIDAD EN PRODUCCIÓN: SECRET_KEY debe estar definida en el entorno (.env), "
            "no puede contener 'django-insecure' y debe tener al menos 32 caracteres."
        )
    SECRET_KEY = RAW_SECRET_KEY
else:
    SECRET_KEY = RAW_SECRET_KEY or "django-insecure-marketplace-cinndet-upn-desarrollo-local-2026"

# Validar ALLOWED_HOSTS
raw_hosts = os.environ.get("ALLOWED_HOSTS", "").strip()
if not DEBUG and not IS_TEST_RUN:
    if not raw_hosts or "*" in [h.strip() for h in raw_hosts.split(",")]:
        raise ImproperlyConfigured(
            "ERROR DE SEGURIDAD EN PRODUCCIÓN: ALLOWED_HOSTS debe especificar nombres de dominio/IPs reales "
            "y no puede contener el comodín '*'."
        )
    ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(",") if h.strip()]
else:
    ALLOWED_HOSTS = [
        h.strip()
        for h in (raw_hosts or "localhost,127.0.0.1,0.0.0.0").split(",")
        if h.strip()
    ]


# -----------------------------------------------------------------------------
# 2. Validación de CORS
# -----------------------------------------------------------------------------
def validar_configuracion_cors(debug: bool, cors_allow_all_raw: str, cors_origins_raw: str, is_test: bool = False):
    """
    Valida la configuración CORS.
    En producción (debug=False y no is_test):
    - Falla si CORS_ALLOW_ALL es True / 1 / yes
    - Exige al menos un origen HTTPS válido
    - Rechaza orígenes vacíos, http:// y comodines (*)
    """
    is_allow_all = str(cors_allow_all_raw).strip().lower() in ("true", "1", "yes")

    if not debug and not is_test:
        if is_allow_all:
            raise ImproperlyConfigured(
                "ERROR DE SEGURIDAD EN PRODUCCIÓN: CORS_ALLOW_ALL no puede ser True cuando DEBUG=False."
            )
        if not cors_origins_raw or not cors_origins_raw.strip():
            raise ImproperlyConfigured(
                "ERROR DE SEGURIDAD EN PRODUCCIÓN: CORS_ALLOWED_ORIGINS debe estar definido cuando DEBUG=False."
            )
        origenes = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]
        if not origenes:
            raise ImproperlyConfigured(
                "ERROR DE SEGURIDAD EN PRODUCCIÓN: CORS_ALLOWED_ORIGINS no contiene orígenes válidos."
            )
        for origen in origenes:
            if origen == "*" or "*" in origen:
                raise ImproperlyConfigured(
                    f"ERROR DE SEGURIDAD EN PRODUCCIÓN: El comodín '*' está prohibido en CORS_ALLOWED_ORIGINS ('{origen}')."
                )
            if not origen.startswith("https://"):
                raise ImproperlyConfigured(
                    f"ERROR DE SEGURIDAD EN PRODUCCIÓN: Cada origen CORS en producción debe usar HTTPS ('{origen}')."
                )
        return False, origenes

    # Modo desarrollo
    origenes = [
        o.strip()
        for o in (cors_origins_raw or "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if o.strip()
    ]
    return is_allow_all, origenes


CORS_ALLOW_ALL_ORIGINS, CORS_ALLOWED_ORIGINS = validar_configuracion_cors(
    debug=DEBUG,
    cors_allow_all_raw=os.environ.get("CORS_ALLOW_ALL", "True"),
    cors_origins_raw=os.environ.get("CORS_ALLOWED_ORIGINS", ""),
    is_test=IS_TEST_RUN,
)


# -----------------------------------------------------------------------------
# 3. Validación y Construcción de Base de Datos (PostgreSQL / SQLite)
# -----------------------------------------------------------------------------
def validar_y_construir_database_config(debug: bool, database_url_raw: str, base_dir: Path, is_test: bool = False):
    """
    Valida y construye la configuración de DATABASES['default'].
    En producción (debug=False y no is_test):
    - Exige DATABASE_URL no vacía
    - Solo acepta esquemas 'postgresql://' o 'postgres://' (rechaza sqlite, mysql, etc.)
    - Exige host no vacío
    - Exige nombre de base de datos no vacío
    - Exige puerto válido (numérico entre 1 y 65535) si se especifica
    - Decodifica credenciales con unquote
    """
    db_url = (database_url_raw or "").strip()

    if not debug and not is_test:
        if not db_url:
            raise ImproperlyConfigured(
                "ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: DATABASE_URL es obligatoria cuando DEBUG=False."
            )

        try:
            parsed = urllib.parse.urlparse(db_url)
        except ValueError as e:
            raise ImproperlyConfigured(
                f"ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: Formato de DATABASE_URL inválido: {e}"
            )

        if parsed.scheme == "sqlite":
            raise ImproperlyConfigured(
                "ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: SQLite ('sqlite://') no está permitido en producción. "
                "Utiliza PostgreSQL."
            )

        if parsed.scheme not in ("postgresql", "postgres"):
            raise ImproperlyConfigured(
                f"ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: Esquema de base de datos '{parsed.scheme}' no soportado. "
                "Debe ser 'postgresql://' o 'postgres://'."
            )

        if not parsed.hostname:
            raise ImproperlyConfigured(
                "ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: DATABASE_URL debe especificar un host válido."
            )

        dbname = parsed.path.lstrip("/")
        if not dbname:
            raise ImproperlyConfigured(
                "ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: DATABASE_URL debe especificar un nombre de base de datos."
            )

        try:
            port_val = parsed.port
            if port_val is not None:
                port_num = int(port_val)
                if port_num < 1 or port_num > 65535:
                    raise ValueError()
        except (ValueError, TypeError):
            raise ImproperlyConfigured(
                "ERROR DE CONFIGURACIÓN EN PRODUCCIÓN: Puerto de base de datos inválido en DATABASE_URL."
            )

        user = urllib.parse.unquote(parsed.username or "")
        password = urllib.parse.unquote(parsed.password or "")
        port = str(parsed.port or "5432")

        return {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": dbname,
            "USER": user,
            "PASSWORD": password,
            "HOST": parsed.hostname,
            "PORT": port,
        }

    # Modo desarrollo o pruebas
    if db_url:
        try:
            parsed = urllib.parse.urlparse(db_url)
            if parsed.scheme in ("postgresql", "postgres"):
                return {
                    "ENGINE": "django.db.backends.postgresql",
                    "NAME": parsed.path.lstrip("/"),
                    "USER": urllib.parse.unquote(parsed.username or ""),
                    "PASSWORD": urllib.parse.unquote(parsed.password or ""),
                    "HOST": parsed.hostname or "localhost",
                    "PORT": str(parsed.port or "5432"),
                }
            elif parsed.scheme == "sqlite":
                return {
                    "ENGINE": "django.db.backends.sqlite3",
                    "NAME": base_dir / parsed.path.lstrip("/"),
                }
        except Exception:
            pass

    # Fallback predeterminado a SQLite para desarrollo y pruebas
    return {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": base_dir / "db.sqlite3",
    }


DATABASES = {
    "default": validar_y_construir_database_config(
        debug=DEBUG,
        database_url_raw=os.environ.get("DATABASE_URL", ""),
        base_dir=BASE_DIR,
        is_test=IS_TEST_RUN,
    )
}

# -----------------------------------------------------------------------------
# 4. Aplicaciones y Middleware
# -----------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party apps
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    # Módulos hexagonales
    "modulos.Productos.Core.infraestructura.apps.ProductosConfig",
    "modulos.Usuarios.Core.infraestructura.apps.UsuariosConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# -----------------------------------------------------------------------------
# 5. Django REST Framework & Paginación Estándar
# -----------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# -----------------------------------------------------------------------------
# 6. Password validation & i18n
# -----------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "es-co"
TIME_ZONE = "America/Bogota"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
