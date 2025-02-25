import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { NotificationProvider } from './context/NotificationContext';
import RootLayout from './components/layouts/RootLayout';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AuctionMode from './components/AuctionMode';
import PrivateRoute from './components/PrivateRoute';
import CreateAuction from './pages/CreateAuction';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: 'create-auction',
        element: <PrivateRoute><CreateAuction /></PrivateRoute>,
      },
      {
        path: 'auction/:id',
        element: <PrivateRoute><AuctionMode /></PrivateRoute>,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const App = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            <RouterProvider router={router} />
          </div>
        </NotificationProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App; 