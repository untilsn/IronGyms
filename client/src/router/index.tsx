import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/home/HomePage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);
