import { Checkbox, Field, Label } from '@headlessui/react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

const FormCheckbox = ({ label, checked, onChange, required = false }) => {
  return (
    <Field className="flex cursor-pointer items-start gap-2">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className={clsx(
          'flex size-4 items-center border border-black bg-white p-0.5 outline-0!',
          'duration-150 data-checked:bg-black data-hover:border-[#ff6600]',
          required && 'not-data-checked:border-[#d03a3a]'
        )}
      >
        <Check color="#fff" strokeWidth={5} />
      </Checkbox>
      <Label
        className={clsx(
          'cursor-pointer text-sm leading-tight select-none',
          required && !checked && 'text-[#d03a3a]'
        )}
      >
        {label}
      </Label>
    </Field>
  );
};

export default FormCheckbox;
