import { useState } from 'react';
import { Link } from 'react-router';
import AuthCheckbox from './AuthCheckbox';
import AuthInput from './AuthInput';

const SignupForm = () => {
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const submit = e => {
    e.preventDefault();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <AuthInput type="email" />
      <AuthInput type="email" label="Repeat email" name="repeatEmail" />
      <AuthInput type="text" label="First name" name="firstName" />
      <AuthInput type="text" label="Last name" name="lastName" />
      <AuthInput type="password" />
      <AuthInput type="password" label="Repeat password" name="repeatPassword" />
      <AuthCheckbox
        label={
          <span>
            I have read and accept the privacy policy. <Link className="hover:underline">Read more</Link>
          </span>
        }
        checked={policyAccepted}
        setChecked={setPolicyAccepted}
      />
      <AuthCheckbox
        label={
          <span>
            Yes, I want to subscribe to the HALO newsletter with information about exclusive sales, new collections and much
            more. You can unsubscribe from the newsletter at any time.{' '}
            <Link className="hover:underline">Read the terms and conditions.</Link>
          </span>
        }
        checked={subscribe}
        setChecked={setSubscribe}
      />
      <button className="btn w-full" type="submit">
        Create account
      </button>
    </form>
  );
};

export default SignupForm;
