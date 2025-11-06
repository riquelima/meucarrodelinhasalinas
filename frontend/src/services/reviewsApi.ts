import { API_BASE_URL } from '../config/api';

export interface CreateReviewDto {
  reviewerId: string;
  receiverId: string;
  rating: number;
  content: string;
}

export interface Review {
  _id: string;
  reviewerId: {
    _id: string;
    name: string;
    avatar?: string;
  } | string;
  receiverId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export async function createReview(data: CreateReviewDto, token: string) {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao criar avaliação' }));
    throw new Error(error.message || 'Erro ao criar avaliação');
  }

  return response.json();
}

export async function getReviewsByUser(userId: string, token: string): Promise<Review[]> {
  const response = await fetch(`${API_BASE_URL}/reviews/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro ao buscar avaliações' }));
    throw new Error(error.message || 'Erro ao buscar avaliações');
  }

  return response.json();
}

