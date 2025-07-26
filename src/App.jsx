import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import router from './router';

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
