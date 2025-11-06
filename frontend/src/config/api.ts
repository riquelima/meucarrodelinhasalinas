// Centraliza a URL da API para todos os módulos do frontend
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
