import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

const AuthInput = ({ label = '', type = 'text', name = '', placeholder = '', className = '' }) => {
  const [passwordShown, setPasswordShown] = useState(false);

  const defaultPlaceholders = {
    email: 'Example@example.com',
    password: 'xxxxxxxx',
  };

  name = name || type;
  label = label || name;

  return (
    <Field className={clsx('group', className)}>
      <Label className="text-xs capitalize">{label}</Label>
      <div className="relative mt-2">
        <Input
          className="w-full border border-[#d4d4d4] bg-white px-4 py-2.5 text-[#495057] transition-colors duration-300 group-hover:border-black placeholder:text-xs placeholder:text-[#bfbfbf]"
          type={type === 'password' && passwordShown ? 'text' : type}
          placeholder={placeholder || defaultPlaceholders[type]}
          name={name}
          required
        />
        {type === 'password' && (
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-xs font-bold hover:underline"
            onClick={() => setPasswordShown(!passwordShown)}
          >
            {passwordShown ? 'HIDE' : 'SHOW'}
          </button>
        )}
      </div>
    </Field>
  );
};

export default AuthInput;
