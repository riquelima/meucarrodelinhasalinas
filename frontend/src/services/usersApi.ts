export type User = {
  _id: string;
  name: string;
  email?: string;
  role?: string | string[];
  avatar?: string;
  // Common
  number?: string;
  avgRating?: number;
  totalReviews?: number;
  createdAt?: string;
  // Driver specific (motorista)
  vehicle?: string;
  licensePlate?: string;
  origin?: string;
  destination?: string;
  description?: string;
  carColor?: string;
  seatsAvailable?: number;
  availableDays?: string;
  status?: string;
};

const DEFAULT_API_URL = 'http://localhost:3000';

export async function fetchAllUsers(token: string, apiUrl: string = DEFAULT_API_URL): Promise<User[]> {
  const res = await fetch(`${apiUrl}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Falha ao carregar usuários');
  }
  const data = await res.json();
  return data as User[];
}

export async function fetchUserById(id: string, token: string, apiUrl: string = DEFAULT_API_URL): Promise<User> {
  const res = await fetch(`${apiUrl}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Falha ao carregar usuário');
  }
  const data = await res.json();
  return data as User;
}
