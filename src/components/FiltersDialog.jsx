import { CloseButton, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import {
  DEFAULT_FILTERS,
  PRICE_RANGES,
  areArraySetsEqual,
  areFiltersEqual,
} from '../constants/products';

const FiltersDialog = ({ open, setOpen, filters, setFilters, totalCount }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogBackdrop
        transition
        className={clsx('fixed inset-0 z-50 bg-[#817d734c]', 'duration-150 data-closed:opacity-0')}
      />
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end">
        <DialogPanel
          transition
          className={clsx(
            'm-4 h-[60vh] w-[95vw] data-closed:m-0 md:h-[95vh] md:w-[40vw] lg:w-[25vw]',
            'duration-300 ease-in-out max-md:data-closed:translate-y-full md:data-closed:translate-x-full',
            'bg-cream flex flex-col rounded-lg p-7.5 uppercase [box-shadow:0_.313em_.938em_#00000080]'
          )}
        >
          <div className="flex justify-between py-4">
            <DialogTitle className="text-[15px] font-bold">Filters</DialogTitle>
            <CloseButton>
              <X size={16} />
            </CloseButton>
          </div>
          <div className="space-y-3 overflow-auto pr-2">
            <h4 className="text-xs font-bold">Price</h4>
            <div className="flex flex-col gap-3 text-xs">
              {PRICE_RANGES.map(range => {
                const checked = filters.priceRanges.includes(range.id);
                return (
                  <label
                    key={range.id}
                    className="flex cursor-pointer items-center gap-3 select-none"
                  >
                    <input
                      type="checkbox"
                      className="size-3.5 cursor-pointer appearance-none border border-[#cbcbcb] checked:bg-[#ff6600]"
                      checked={checked}
                      onChange={() => {
                        setFilters(prev => {
                          const has = prev.priceRanges.includes(range.id);
                          const next = has
                            ? prev.priceRanges.filter(id => id !== range.id)
                            : [...prev.priceRanges, range.id];
                          if (areArraySetsEqual(prev.priceRanges, next)) return prev;
                          return { ...prev, priceRanges: next };
                        });
                      }}
                    />
                    <span className="text-dark text-[13px] font-bold">{range.label}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                id="onSale"
                type="checkbox"
                className="size-3.5 cursor-pointer appearance-none border border-[#cbcbcb] checked:bg-[#ff6600]"
                checked={filters.onSale}
                onChange={e => {
                  const checked = e.target.checked;
                  setFilters(prev =>
                    prev.onSale === checked ? prev : { ...prev, onSale: checked }
                  );
                }}
              />
              <label htmlFor="onSale" className="cursor-pointer text-xs font-bold">
                On Sale
              </label>
            </div>
          </div>
          <button
            className="mt-auto mb-5 text-sm font-bold uppercase underline"
            onClick={() => {
              if (!areFiltersEqual(filters, DEFAULT_FILTERS)) {
                setFilters(DEFAULT_FILTERS);
              }
            }}
          >
            Clear Filters
          </button>
          <CloseButton className="btn text-sm" onClick={() => setOpen(false)}>
            Show results ({totalCount})
          </CloseButton>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FiltersDialog;
