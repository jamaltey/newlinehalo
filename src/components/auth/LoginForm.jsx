import { useState } from 'react';
import { Link } from 'react-router';
import AuthCheckbox from './AuthCheckbox';
import AuthInput from './AuthInput';

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const submit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <AuthInput type="email" />
      <AuthInput type="password" />
      <AuthCheckbox label="Remember me" checked={rememberMe} setChecked={setRememberMe} />
      <p className="text-right select-none">
        <Link className="text-xs underline">Forgot password?</Link>
      </p>
      <button className="btn w-full">Login to your account</button>
    </form>
  );
};

export default LoginForm;
