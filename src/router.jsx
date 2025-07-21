import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  { basename: import.meta.env.MODE === 'production' ? '/newlinehalo' : undefined }
);

export default router;
