import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { emailRegex } from '../../utils/validation';
import AuthCheckbox from './AuthCheckbox';
import AuthInput from './AuthInput';

const schema = yup.object({
  email: yup.string().required('This field is required').matches(emailRegex, 'Enter an email address'),
  password: yup.string().required('This field is required'),
});

const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { signIn } = useAuth();

  const submit = ({ email, password }) => {
    signIn(email, password, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <AuthInput type="email" invalid={!!errors.email} errorMessage={errors.email?.message} register={register} />
      <AuthInput type="password" invalid={!!errors.password} register={register} />
      <AuthCheckbox label="Remember me" checked={rememberMe} setChecked={setRememberMe} />
      <p className="text-right select-none">
        <Link className="text-xs underline">Forgot password?</Link>
      </p>
      <button className="btn w-full">Login to your account</button>
    </form>
  );
};

export default LoginForm;
