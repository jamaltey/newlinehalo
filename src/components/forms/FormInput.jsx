import { Field, Input, Label } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';

const FormInput = ({
  label = '',
  type = 'text',
  name = '',
  placeholder = '',
  invalid = false,
  errorMessage = 'This field is required',
  className = '',
  register = () => {},
}) => {
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
          className={clsx(
            'w-full border border-[#d4d4d4] bg-white px-4 py-2.5 text-[#495057] duration-300',
            'group-hover:border-black placeholder:text-xs placeholder:text-[#bfbfbf] focus:outline-0',
            invalid && 'border-[#d03a3a]! ring-[#d03a3a80] focus:ring-2'
          )}
          type={type === 'password' && passwordShown ? 'text' : type}
          placeholder={placeholder || defaultPlaceholders[type]}
          name={name}
          required
          {...register(name)}
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
      {invalid && <p className="mt-2 text-xs text-[#d03a3a]">{errorMessage}</p>}
    </Field>
  );
};

export default FormInput;
