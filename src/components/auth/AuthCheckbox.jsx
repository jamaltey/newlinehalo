import { Checkbox, Field, Label } from '@headlessui/react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

const AuthCheckbox = ({ label, checked, setChecked, required = false }) => {
  return (
    <Field className="group flex cursor-pointer items-start gap-2" onClick={() => setChecked(!checked)}>
      <Checkbox
        checked={checked}
        onChange={setChecked}
        className={clsx(
          'flex size-4 items-center border border-black bg-white p-0.5 outline-0!',
          'duration-150 group-hover:not-data-checked:border-[#ff6600] data-checked:bg-black',
          required && !checked && 'not-data-checked:border-[#d03a3a]'
        )}
      >
        <Check color="#fff" strokeWidth={5} />
      </Checkbox>
      <Label className={clsx('cursor-pointer text-sm leading-tight select-none', required && !checked && 'text-[#d03a3a]')}>
        {label}
      </Label>
    </Field>
  );
};

export default AuthCheckbox;
