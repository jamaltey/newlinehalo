import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} handle={{ is404: true }} id="notFound" />
    </Route>
  ),
  { basename: import.meta.env.MODE === 'production' ? '/newlinehalo/' : undefined }
);

export default router;
