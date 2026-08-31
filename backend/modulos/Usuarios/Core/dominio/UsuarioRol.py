from dataclasses import dataclass
from enum import Enum

class RolEnum(str, Enum):
    ADMIN   = "admin"
    USUARIO = "user"

@dataclass(frozen=True)
class UsuarioRol:
    valor: str

    def __post_init__(self):
        roles_validos = [r.value for r in RolEnum]
        if self.valor not in roles_validos:
            raise ValueError(f"Rol invalido: '{self.valor}'. Valores: {roles_validos}")

    def es_admin(self) -> bool:
        return self.valor == RolEnum.ADMIN

    def __str__(self):
        return self.valor
