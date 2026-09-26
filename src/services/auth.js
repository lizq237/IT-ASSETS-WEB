import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  return data; // { access_token, token_type, user }
}

export async function logout() {
  const { data } = await api.post('/logout');
  return data;
}

export async function me() {
  const { data } = await api.get('/me');
  return data; // { user }
}