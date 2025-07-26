import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return <div className="container mx-auto max-w-3xl pt-40">Profile</div>;
};

export default Profile;
