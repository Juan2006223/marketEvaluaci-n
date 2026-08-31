from dataclasses import dataclass
from enum import Enum

class TipoRecursoEnum(str, Enum):
    HERRAMIENTA_DIGITAL = "herramienta_digital"
    RECURSO_EDUCATIVO   = "recurso_educativo"
    SERVICIO            = "servicio"
    CAPACITACION        = "capacitacion"
    OTRO                = "otro"

@dataclass(frozen=True)
class ProductoTipo:
    """Value Object para clasificar el tipo de recurso pedagógico/tecnológico."""
    valor: str

    def __post_init__(self):
        valores_validos = [t.value for t in TipoRecursoEnum]
        if self.valor not in valores_validos:
            raise ValueError(f"Tipo de recurso inválido: '{self.valor}'. Permitidos: {valores_validos}")

    @property
    def etiqueta(self) -> str:
        etiquetas = {
            TipoRecursoEnum.HERRAMIENTA_DIGITAL: "Herramienta Digital",
            TipoRecursoEnum.RECURSO_EDUCATIVO:   "Recurso Educativo",
            TipoRecursoEnum.SERVICIO:            "Servicio Institucional",
            TipoRecursoEnum.CAPACITACION:        "Capacitación / Taller",
            TipoRecursoEnum.OTRO:                "Otro",
        }
        return etiquetas.get(self.valor, self.valor)

    def __str__(self):
        return self.valor
