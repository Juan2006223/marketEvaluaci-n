from dataclasses import dataclass
from enum import Enum

class SeccionEnum(str, Enum):
    DESTACADAS   = "destacadas"
    MES          = "mes"
    RECOMENDADAS = "recomendadas"
    GENERAL      = "general"

@dataclass(frozen=True)
class ProductoSeccion:
    valor: str

    def __post_init__(self):
        valores_validos = [s.value for s in SeccionEnum]
        if self.valor not in valores_validos:
            raise ValueError(f"Sección inválida: '{self.valor}'. Valores permitidos: {valores_validos}")

    def __str__(self):
        return self.valor
