import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router';
import Loading from './components/Loading';
import AccountLayout from './layouts/AccountLayout';
import MainLayout from './layouts/MainLayout';
import Cart from './pages/Cart';
import Category from './pages/Category';
import EditProfile from './pages/EditProfile';
import Favorites from './pages/Favorites';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import supabase from './utils/supabase';

const rootLoader = async () => {
  try {
    const cached = localStorage.getItem('categories');
    if (cached) {
      try {
        const categories = JSON.parse(cached);
        return { categories };
      } catch (err) {}
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*, subcategories(*)');
    if (error) throw error;

    localStorage.setItem('categories', JSON.stringify(categories));
    return { categories };
  } catch (err) {
    console.error('Error loading categories:', err.message);
    return { categories: [] };
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
      <Route path="/search" element={<SearchResults />} />
      <Route path="/:id" element={<Category />} />
      <Route path="/products/:slug" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route element={<AccountLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
      </Route>
      <Route path="*" element={<NotFound />} handle={{ is404: true }} id="notFound" />
    </Route>
  )
);

export default router;
