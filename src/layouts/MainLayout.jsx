import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className='min-h-screen'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
