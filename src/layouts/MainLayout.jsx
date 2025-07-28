import { Outlet, ScrollRestoration } from 'react-router';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const { loading } = useAuth();

  return (
    <>
      {loading && <Loading backdrop />}
      <ScrollRestoration />
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
