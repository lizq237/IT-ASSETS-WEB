
import api from './api';

export async function obtenerEquipos() {
  const response = await api.get('/assets');
  return response.data;
}

export async function obtenerCategorias() {
  const response = await api.get('/categories');
  return response.data;
}

export async function registrarEquipo(datos) {
  const response = await api.post('/assets', datos);
  return response.data;
}
