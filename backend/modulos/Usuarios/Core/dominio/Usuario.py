from dataclasses import dataclass
from modulos.Usuarios.Core.dominio.UsuarioId  import UsuarioId
from modulos.Usuarios.Core.dominio.UsuarioRol import UsuarioRol

@dataclass
class Usuario:
    """Entidad de dominio Usuario."""
    id:     UsuarioId
    nombre: str
    email:  str
    rol:    UsuarioRol

    def es_admin(self) -> bool:
        return self.rol.es_admin()

    def __str__(self):
        return f"{self.nombre} ({self.email})"
