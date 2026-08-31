from dataclasses import dataclass

@dataclass(frozen=True)
class ProductoTitulo:
    valor: str

    def __post_init__(self):
        if not self.valor or len(self.valor.strip()) < 3:
            raise ValueError("El titulo del producto debe tener al menos 3 caracteres.")
        if len(self.valor) > 200:
            raise ValueError("El titulo del producto no puede superar 200 caracteres.")

    def __str__(self):
        return self.valor
