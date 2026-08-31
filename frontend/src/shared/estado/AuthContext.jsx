import React, { useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../api/almacenamiento';
import { clienteHttp }  from '../api/clienteHttp';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => tokenStorage.obtenerUsuario());
  const [cargandoSesion, setCargandoSesion] = useState(true);

  // Verificar y sincronizar perfil real desde /api/auth/me/
  const sincronizarPerfil = useCallback(async () => {
    const token = tokenStorage.obtenerAccessToken();
    if (!token) {
      setUsuario(null);
      setCargandoSesion(false);
      return;
    }
    try {
      const { data } = await clienteHttp.get('auth/me/');
      const sesion = {
        id: data.id,
        nombre: data.first_name ? `${data.first_name} ${data.last_name}`.trim() : data.username,
        username: data.username,
        email: data.email,
        is_staff: Boolean(data.is_staff),
        is_superuser: Boolean(data.is_superuser),
        rol: data.rol || (data.is_staff ? 'admin' : 'usuario'),
      };
      tokenStorage.guardarUsuario(sesion);
      setUsuario(sesion);
    } catch {
      tokenStorage.limpiar();
      setUsuario(null);
    } finally {
      setCargandoSesion(false);
    }
  }, []);

  useEffect(() => {
    sincronizarPerfil();
  }, [sincronizarPerfil]);

  const iniciarSesion = useCallback(async (usernameOrEmail, password) => {
    const { data } = await clienteHttp.post('auth/token/', {
      username: usernameOrEmail,
      password,
    });
    tokenStorage.guardarAccessToken(data.access);
    if (data.refresh) {
      tokenStorage.guardarRefreshToken(data.refresh);
    }
    
    // Obtener perfil completo desde /api/auth/me/
    const meRes = await clienteHttp.get('auth/me/');
    const meData = meRes.data;
    const sesion = {
      id: meData.id,
      nombre: meData.first_name ? `${meData.first_name} ${meData.last_name}`.trim() : meData.username,
      username: meData.username,
      email: meData.email,
      is_staff: Boolean(meData.is_staff),
      is_superuser: Boolean(meData.is_superuser),
      rol: meData.rol || (meData.is_staff ? 'admin' : 'usuario'),
    };
    tokenStorage.guardarUsuario(sesion);
    setUsuario(sesion);
    window.dispatchEvent(new Event('storage'));
    return sesion;
  }, []);

  const cerrarSesion = useCallback(() => {
    tokenStorage.limpiar();
    setUsuario(null);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const esAdmin = Boolean(usuario?.is_staff || usuario?.is_superuser || usuario?.rol === 'admin');

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion, esAdmin, cargandoSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
