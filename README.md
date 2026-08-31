# Marketplace CINNDET - Universidad Pedagógica Nacional (UPN)

Plataforma institucional para centralizar, visibilizar y gestionar la oferta de recursos, herramientas y servicios educativos y tecnológicos de la Universidad Pedagógica Nacional (UPN).

---

## 1. Arquitectura del Sistema (Limpia / Hexagonal)

El backend implementa **Arquitectura Hexagonal (Puertos y Adaptadores)** garantizando el desacoplamiento entre las reglas de negocio y los detalles de infraestructura (ORM, HTTP, BD):

```
marketplaceRefactoring/
├── backend/
│   ├── core/                           # Configuración Django (settings con validaciones estrictas de seguridad)
│   ├── modulos/
│   │   ├── Productos/Core/
│   │   │   ├── dominio/                # Entidades (Producto, Categoria), Value Objects (ProductoTipo, etc.), Puertos
│   │   │   ├── aplicacion/             # Casos de uso (CRUD Productos, CRUD Categorías)
│   │   │   ├── infraestructura/        # Adaptadores Django ORM, Serializadores DRF, ViewSets con paginación
│   │   │   └── tests/                  # 51 Pruebas unitarias de dominio, casos de uso, API y seguridad
│   │   └── Usuarios/Core/
│   │       └── infraestructura/        # Autenticación JWT y endpoint de perfil /api/auth/me/
│   ├── requirements.txt                # Dependencias incluyendo psycopg, psycopg2-binary, python-dotenv
│   ├── .env.example                    # Plantilla de entorno para backend
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── productos/              # Catálogo público, detalle de recurso, búsqueda reactiva y filtros
│   │   │   ├── interes/                # Lista de recursos de interés guardados localmente
│   │   │   ├── auth/                   # Inicio de sesión institucional
│   │   │   └── admin/                  # Panel administrativo (Gestión de recursos y categorías)
│   │   ├── shared/                     # Navbar, Footer, Cliente HTTP Axios, Contextos de Auth e Interés
│   │   └── rutas/                      # Enrutador y control de acceso RutaProtegida
│   ├── .env.example                    # Plantilla de entorno para frontend (VITE_API_URL)
│   └── package.json
└── docs/                               # Diagnóstico técnico y plan de trabajo
```

---

## 2. Requisitos y Dependencias

- **Python:** 3.10+ (incluyendo Python 3.14)
- **Node.js:** 18+ / 20+ y `npm`
- **Bases de Datos:**
  - **Desarrollo local / Pruebas:** SQLite (integrado por defecto).
  - **Producción:** PostgreSQL 14+ con drivers `psycopg` / `psycopg2-binary` (incluidos en `requirements.txt`).

---

## 3. Configuración de Variables de Entorno y Seguridad

Las variables de entorno están estrictamente separadas por capa:

### 3.1 Backend (`backend/.env`)
Copia `backend/.env.example` a `backend/.env`:
```powershell
cp backend/.env.example backend/.env
```
Reglas estrictas de validación en `core/settings.py`:
- `DEBUG`: `True` para desarrollo local, `False` para producción.
- `SECRET_KEY`: En producción (`DEBUG=False`), exige al menos 32 caracteres y rechaza valores con `django-insecure` o vacíos.
- `ALLOWED_HOSTS`: En producción, exige dominios/IPs explícitos y **prohíbe el comodín `*`**.
- `CORS_ALLOW_ALL`: En producción, debe ser `False`.
- `CORS_ALLOWED_ORIGINS`: En producción, exige orígenes con protocolo seguro `https://` explícitos (rechaza `http://`, vacíos y comodines `*`).
- `DATABASE_URL`: En producción, es obligatoria y **solo acepta esquemas `postgresql://` o `postgres://`** con host, nombre de base de datos y puerto válidos (rechaza `sqlite://`, otros motores o URLs incompletas). En desarrollo local (`DEBUG=True`), si se omite, utiliza SQLite (`backend/db.sqlite3`).
- `SEED_ADMIN_PASSWORD`: Contraseña para el superusuario al ejecutar `seed_db` (sin valor por defecto por seguridad).

### 3.2 Frontend (`frontend/.env`)
Copia `frontend/.env.example` a `frontend/.env`:
```powershell
cp frontend/.env.example frontend/.env
```
- `VITE_API_URL`: URL base del API backend (ej: `http://localhost:8000/api/`).

---

## 4. Instalación y Puesta en Marcha

### 4.1 Backend (Django REST Framework)
1. Instalar dependencias:
   ```powershell
   cd backend
   py -m pip install -r requirements.txt
   ```
2. Ejecutar chequeo del sistema y migraciones:
   ```powershell
   py manage.py check
   py manage.py migrate
   ```
3. Cargar datos demostrativos y crear superusuario administrador:
   ```powershell
   # Opción A: Proporcionar contraseña por variable de entorno
   $env:SEED_ADMIN_PASSWORD="TuPasswordSeguro123!"; py manage.py seed_db

   # Opción B: Ejecutar y proporcionar la contraseña interactivamente por terminal
   py manage.py seed_db

   # Opción C: Cargar solo catálogo demostrativo sin superusuario
   py manage.py seed_db --no-admin
   ```
4. Iniciar servidor backend:
   ```powershell
   py manage.py runserver 8000
   ```

### 4.2 Frontend (React + Vite)
1. Instalar dependencias:
   ```powershell
   cd frontend
   npm install
   ```
2. Iniciar servidor de desarrollo:
   ```powershell
   npm run dev
   ```
3. Acceder en el navegador a `http://localhost:5173`.

---

## 5. Endpoints REST Principales

| Método | Endpoint | Descripción | Paginación / Filtros | Acceso |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/productos/` | Catálogo de recursos | `page`, `page_size`, `category`, `resource_type`, `section`, `search` | Público |
| `GET` | `/api/productos/{id}/` | Detalle de recurso | Retorna 404 si no existe | Público |
| `POST` | `/api/productos/` | Crear recurso | Valida campos requeridos | Admin (Staff) |
| `PUT/PATCH`| `/api/productos/{id}/` | Actualizar recurso | Retorna 404 si no existe | Admin (Staff) |
| `DELETE` | `/api/productos/{id}/` | Eliminar recurso | Retorna 404 si no existe | Admin (Staff) |
| `GET` | `/api/categorias/` | Listado de categorías | `all=true` para incluir inactivas | Público |
| `POST` | `/api/categorias/` | Crear categoría | Valida unicidad de slug | Admin (Staff) |
| `PUT/PATCH`| `/api/categorias/{id}/` | Actualizar categoría | Retorna 404 si no existe | Admin (Staff) |
| `DELETE` | `/api/categorias/{id}/` | Eliminar categoría | Retorna 404 si no existe | Admin (Staff) |
| `POST` | `/api/auth/token/` | Obtención de tokens JWT | Retorna token con claims de rol | Público |
| `POST` | `/api/auth/token/refresh/`| Renovación de JWT | Retorna nuevo access token | Público |
| `GET` | `/api/auth/me/` | Perfil del usuario | Retorna username, email, is_staff, rol | Autenticado |

---

## 6. Comandos de Verificación y Pruebas

### 6.1 Backend Tests (51 Pruebas)
```powershell
cd backend
py manage.py test
```
Cubre:
- Pruebas unitarias de dominio (Value Objects y Entidades).
- Pruebas de casos de uso con repositorios mockeados (CRUD productos y categorías).
- Pruebas de integración de endpoints (catálogo paginado, filtros combinados, recursos inactivos, 404 en inexistentes, permisos admin vs anónimo/normal).
- Pruebas exhaustivas de validación de seguridad de configuración en producción (`DEBUG=False`): rechazo de SQLite en producción, esquemas no-PostgreSQL, URLs sin host, URLs sin nombre de base, puertos inválidos, `CORS_ALLOW_ALL=True`, orígenes HTTP o comodines, y aceptación de URLs PostgreSQL y orígenes HTTPS válidos.

### 6.2 Frontend Lint y Build
```powershell
cd frontend
npm run lint
npm run build
```
Valida 0 errores de ESLint y genera el build de producción en `dist/`.
