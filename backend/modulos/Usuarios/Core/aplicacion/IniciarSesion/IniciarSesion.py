"""
Caso de uso: Iniciar sesion.
La autenticacion real la maneja Django REST Framework + Simple JWT.
Este caso de uso encapsula la logica de negocio post-autenticacion.
"""
from modulos.Usuarios.Core.dominio.Usuario    import Usuario
from modulos.Usuarios.Core.dominio.UsuarioId  import UsuarioId
from modulos.Usuarios.Core.dominio.UsuarioRol import UsuarioRol

class IniciarSesion:
    def ejecutar(self, user_django) -> Usuario:
        """Convierte un usuario autenticado de Django en una entidad de dominio."""
        rol = "admin" if (user_django.is_staff or user_django.is_superuser) else "user"
        return Usuario(
            id     = UsuarioId(user_django.id),
            nombre = user_django.get_full_name() or user_django.username,
            email  = user_django.email,
            rol    = UsuarioRol(rol),
        )
