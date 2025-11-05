import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type ChatMessage = {
  _id: string;
  from: { _id: string; name?: string; avatar?: string; status?: string } | string;
  to: { _id: string; name?: string; avatar?: string; status?: string } | string;
  content: string;
  isRead?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type HistoryRequest = { withUserId: string; limit?: number; before?: string };

// Minimal contract for consumers
// - connected: boolean connection state
// - sendPrivateMessage(to, content): emit message event
// - requestHistory({ withUserId, limit, before }): request history; listen via onHistory
// - onMessageSent(cb): subscribe to 'message_sent'
// - onHistory(cb): subscribe to 'history'
// - onError(cb): subscribe to 'error'

export function useChatSocket(token?: string, options?: { apiUrl?: string; wsUrl?: string }) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const wsUrl = options?.wsUrl || 'http://localhost:3000/chat';

  const socket = useMemo(() => {
    if (!token) return null;

    const s = io(wsUrl, {
      transports: ['websocket'],
      auth: {
        // Backend accepts either raw token or Bearer <token>
        token: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    socketRef.current = s;
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, wsUrl]);

  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.disconnect();
      socketRef.current = null;
    };
  }, [socket]);

  const sendPrivateMessage = (to: string, content: string) => {
    const s = socketRef.current;
    if (!s) throw new Error('Socket not connected');
    s.emit('private_message', { to, content });
  };

  const requestHistory = (payload: HistoryRequest) => {
    const s = socketRef.current;
    if (!s) throw new Error('Socket not connected');
    s.emit('get_history', payload);
  };

  const onMessageSent = (cb: (msg: ChatMessage) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};
    s.on('message_sent', cb);
    return () => s.off('message_sent', cb);
  };

  const onHistory = (cb: (msgs: ChatMessage[]) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};
    s.on('history', cb);
    return () => s.off('history', cb);
  };

  const onError = (cb: (message: string) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};
    s.on('error', cb);
    return () => s.off('error', cb);
  };

  return {
    connected,
    socket: socketRef.current,
    sendPrivateMessage,
    requestHistory,
    onMessageSent,
    onHistory,
    onError,
  } as const;
}
