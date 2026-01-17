import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './contexts/AuthProvider';
import router from './router';
import { store } from './store';

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  </Provider>
);

export default App;
