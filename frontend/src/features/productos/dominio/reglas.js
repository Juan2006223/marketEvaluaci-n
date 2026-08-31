export const filtrarPorSeccion = (productos, seccion) =>
  productos.filter((p) => p.section === seccion);

export const filtrarPorCategoria = (productos, slug) =>
  slug === 'all' || !slug ? productos : productos.filter((p) => p.category_slug === slug);

export const filtrarPorTipo = (productos, tipo) =>
  tipo === 'all' || !tipo ? productos : productos.filter((p) => p.resource_type === tipo);

export const filtrarPorBusqueda = (productos, query) => {
  if (!query || !query.trim()) return productos;
  const q = query.toLowerCase().trim();
  return productos.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.short_description.toLowerCase().includes(q) ||
      p.category_name.toLowerCase().includes(q)
  );
};
