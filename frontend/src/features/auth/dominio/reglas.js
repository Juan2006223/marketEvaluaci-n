export const validarEmail    = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
export const validarPassword = (p) => typeof p === 'string' && p.length >= 6;
export const esAdmin         = (u) => u?.rol === 'admin';
