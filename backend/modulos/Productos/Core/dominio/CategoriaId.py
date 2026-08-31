from dataclasses import dataclass

@dataclass(frozen=True)
class CategoriaId:
    valor: int

    def __post_init__(self):
        if not isinstance(self.valor, int) or self.valor <= 0:
            raise ValueError(f"CategoriaId debe ser un entero positivo. Recibido: {self.valor}")

    def __str__(self):
        return str(self.valor)
