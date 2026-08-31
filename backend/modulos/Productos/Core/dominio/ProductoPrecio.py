from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class ProductoPrecio:
    valor: Decimal

    def __post_init__(self):
        if self.valor < 0:
            raise ValueError("El valor o costo del recurso no puede ser negativo.")

    def __str__(self):
        return str(self.valor)
