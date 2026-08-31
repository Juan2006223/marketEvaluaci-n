// ADAPTADOR: abstrae localStorage para tokens, sesión y lista de recursos de interés.
const CLAVES = {
  ACCESS_TOKEN:  'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USUARIO:       'user',
  INTERES:       'interes_items',
};

export const tokenStorage = {
  obtenerAccessToken:  () => localStorage.getItem(CLAVES.ACCESS_TOKEN),
  guardarAccessToken:  (t) => localStorage.setItem(CLAVES.ACCESS_TOKEN, t),
  obtenerRefreshToken: () => localStorage.getItem(CLAVES.REFRESH_TOKEN),
  guardarRefreshToken: (t) => localStorage.setItem(CLAVES.REFRESH_TOKEN, t),
  obtenerUsuario:      () => {
    try {
      return JSON.parse(localStorage.getItem(CLAVES.USUARIO) || 'null');
    } catch {
      return null;
    }
  },
  guardarUsuario:      (u) => localStorage.setItem(CLAVES.USUARIO, JSON.stringify(u)),
  limpiar:             () => {
    localStorage.removeItem(CLAVES.ACCESS_TOKEN);
    localStorage.removeItem(CLAVES.REFRESH_TOKEN);
    localStorage.removeItem(CLAVES.USUARIO);
  },
};

export const interesStorage = {
  obtenerItems:  () => {
    try {
      return JSON.parse(localStorage.getItem(CLAVES.INTERES) || '[]');
    } catch {
      return [];
    }
  },
  guardarItems:  (items) => localStorage.setItem(CLAVES.INTERES, JSON.stringify(items)),
  limpiarItems:  () => localStorage.setItem(CLAVES.INTERES, '[]'),
};
