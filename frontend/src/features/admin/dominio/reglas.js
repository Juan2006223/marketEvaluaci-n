export function validarProductoAdmin(form) {
  const errores = [];
  if (!form.title || form.title.trim().length < 3) errores.push('El titulo debe tener al menos 3 caracteres.');
  if (!form.price || Number(form.price) <= 0)       errores.push('El precio debe ser mayor a cero.');
  if (!form.section)   errores.push('La seccion es requerida.');
  if (!form.category)  errores.push('La categoria es requerida.');
  return errores;
}
