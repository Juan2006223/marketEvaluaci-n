export const calcularTotal  = (items) => items.reduce((s, i) => s + Number(i.price) * i.qty, 0);
export const validarCantidad = (qty) => Number.isInteger(qty) && qty >= 1;
