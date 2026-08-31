import { useContext } from 'react';
import { InteresContext } from './interesContextDef';

export function useInteresContext() {
  const ctx = useContext(InteresContext);
  if (!ctx) throw new Error('useInteresContext debe usarse dentro de InteresProvider');
  return ctx;
}
