import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import Loading from './components/Loading';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import Category from './pages/Category';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import supabase from './utils/supabase';

const rootLoader = async () => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*, subcategories(*)')
    if (error) throw error;
    return { categories };
  } catch (err) {
    console.error('Error loading categories:', err.message);
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<MainLayout />}
      loader={rootLoader}
      HydrateFallback={Loading}
      id="root"
    >
      <Route index element={<Home />} />
      <Route path="/:id" element={<Category />} />
      <Route path="/products/:slug" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route element={<AccountLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
      <Route path="*" element={<NotFound />} handle={{ is404: true }} id="notFound" />
    </Route>
  ),
  { basename: import.meta.env.MODE === 'production' ? '/newlinehalo/' : undefined }
);

export default router;
