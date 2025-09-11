import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { SORT_OPTIONS } from '../constants/products';

const SortDialog = ({ open, setOpen, sort, setSort }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogBackdrop
        transition
        className={clsx('fixed inset-0 z-50 bg-[#817d734c]', 'duration-150 data-closed:opacity-0')}
      />
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-start md:justify-end">
        <DialogPanel
          transition
          className={clsx(
            'm-4 mt-4! w-[95vw] data-closed:m-0 md:w-[40vw] lg:w-[25vw]',
            'duration-300 ease-in-out max-md:data-closed:translate-y-full md:data-closed:translate-x-full',
            'bg-cream flex flex-col rounded-lg p-7.5 uppercase [box-shadow:0_.313em_.938em_#00000080]'
          )}
        >
          <div className="flex justify-between py-4">
            <DialogTitle className="text-[15px] font-bold">Sort Products</DialogTitle>
            <CloseButton>
              <X size={16} />
            </CloseButton>
          </div>
          <div className="space-y-5 overflow-auto py-5 hover:[&:has(button:hover)]:*:opacity-50">
            {SORT_OPTIONS.map(opt => {
              const selected = sort === opt.id;
              return (
                <button
                  key={opt.id}
                  className={clsx(
                    'flex w-full items-center gap-3 text-[13px] font-medium uppercase',
                    'duration-200 hover:opacity-100!'
                  )}
                  onClick={() => {
                    setSort(opt.id);
                    setOpen(false);
                  }}
                >
                  <span
                    className={clsx(
                      'inline-block size-3 border border-[#cbcbcb]',
                      selected && 'bg-[#ff6600]'
                    )}
                  />
                  <span>
                    {opt.title} // {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default SortDialog;
