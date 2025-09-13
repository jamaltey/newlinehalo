import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate } from 'react-router';
import LoginForm from '../components/forms/LoginForm';
import SignupForm from '../components/forms/SignupForm';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [signupFormShown, setSignupFormShown] = useState(false);
  const { user } = useAuth();

  if (user) return <Navigate to="/" />;

  return (
    <div className="container mx-auto max-w-3xl pb-25">
      <div className="relative flex items-end justify-center pb-14">
        <Link to="/" className="absolute left-0 hidden uppercase hover:underline lg:flex">
          <ChevronLeft />
          Go back
        </Link>
        <h1 className="relative font-medium uppercase md:text-2xl">Create account or login</h1>
      </div>
      <div className="flex w-full flex-col gap-8 p-4 md:flex-row">
        <div className="md:w-1/2">
          <div className="mb-7 border-b border-[#00000020] pb-2.5">
            <h2 className="text-center text-xs font-semibold uppercase md:text-xl">New customer</h2>
          </div>
          <div className="px-5">
            {signupFormShown ? (
              <SignupForm />
            ) : (
              <button onClick={() => setSignupFormShown(true)} className="btn w-full">
                Create account
              </button>
            )}
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="mb-7 border-b border-[#00000020] pb-2.5">
            <h2 className="text-center text-xs font-semibold uppercase md:text-xl">Login</h2>
          </div>
          <div className="px-5">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
