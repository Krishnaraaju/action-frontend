import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const ws = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL}/ws`;
      console.log('Connecting to WebSocket:', wsUrl);
      
      ws.current = new WebSocket(wsUrl);
      let mounted = true;
      
      ws.current.onopen = () => {
        if (!mounted) return;
        console.log('WebSocket connected');
        setIsConnected(true);
        
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
        
        if (user) {
          ws.current.send(JSON.stringify({
            type: 'auth',
            token: localStorage.getItem('token')
          }));
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        if (event.code !== 1000 && event.code !== 1001) {
          reconnectTimeout.current = setTimeout(connect, 3000);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
          switch (data.type) {
            case 'connected':
              console.log('Connection confirmed by server');
              break;
            case 'pong':
              console.log('Received pong from server');
              break;
            case 'authSuccess':
              console.log('Authentication successful');
              break;
            case 'authError':
              console.error('Authentication failed:', data.message);
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      return () => {
        mounted = false;
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  }, [user]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, [isConnected]);

  const sendMessage = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws: ws.current, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 