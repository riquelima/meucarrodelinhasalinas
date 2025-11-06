import { API_BASE_URL } from '../config/api';

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  photo: string;
  status: 'online' | 'offline';
};

export async function fetchConversations(userId: string, token: string, apiUrl: string = API_BASE_URL): Promise<Conversation[]> {
  const res = await fetch(`${apiUrl}/messages/conversations/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Falha ao carregar conversas');
  }
  const data = await res.json();
  return data as Conversation[];
}

export async function fetchUnreadCount(userId: string, token: string, apiUrl: string = API_BASE_URL): Promise<number> {
  const res = await fetch(`${apiUrl}/messages/unread-count/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Falha ao carregar contagem de não lidas');
  }
  const data = await res.json();
  return (data && typeof data.count === 'number') ? data.count : 0;
}
