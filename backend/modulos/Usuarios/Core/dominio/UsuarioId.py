from dataclasses import dataclass

@dataclass(frozen=True)
class UsuarioId:
    valor: int

    def __post_init__(self):
        if not isinstance(self.valor, int) or self.valor <= 0:
            raise ValueError("UsuarioId debe ser un entero positivo.")

    def __str__(self):
        return str(self.valor)
