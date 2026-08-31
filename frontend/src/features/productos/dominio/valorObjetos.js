export const TIPOS_RECURSO = {
  herramienta_digital: 'Herramienta Digital',
  recurso_educativo:   'Recurso Educativo',
  servicio:            'Servicio Institucional',
  capacitacion:        'Capacitación / Taller',
  otro:                'Otro',
};

export class Producto {
  constructor({
    id,
    title,
    description,
    short_description,
    resource_type = 'herramienta_digital',
    price = 0,
    category,
    category_id,
    category_name,
    category_slug,
    image_url,
    image,
    external_url,
    section = 'destacadas',
    is_featured = false,
    is_active = true,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.title = title || '';
    this.description = description || '';
    this.short_description = short_description || '';
    this.resource_type = resource_type || 'herramienta_digital';
    this.price = Number(price || 0);
    this.category = category;
    this.category_id = category_id;
    this.category_name = category_name || '';
    this.category_slug = category_slug || '';
    this.image_url = image_url || image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';
    this.external_url = external_url || '';
    this.section = section || 'destacadas';
    this.is_featured = Boolean(is_featured);
    this.is_active = Boolean(is_active);
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  tipoEtiqueta() {
    return TIPOS_RECURSO[this.resource_type] || this.resource_type;
  }

  esDestacado() {
    return this.is_featured || this.section === 'destacadas';
  }

  esDelMes() {
    return this.section === 'mes';
  }

  esRecomendado() {
    return this.section === 'recomendadas';
  }

  tieneEnlaceExterno() {
    return Boolean(this.external_url && this.external_url.startsWith('http'));
  }
}
