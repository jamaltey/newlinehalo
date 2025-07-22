import { Dialog, DialogPanel } from '@headlessui/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const SearchDialog = ({ open, setOpen }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      console.log(debouncedQuery);
    }
  }, [debouncedQuery]);

  const submit = e => {
    e.preventDefault();
  };

  return (
    <Dialog className="bg-cream text-dark fixed inset-0 z-50 lg:hidden" open={open} onClose={() => setOpen(false)}>
      <DialogPanel className="p-4">
        <div className="flex w-full justify-end">
          <button className="text-[#212529]" onClick={() => setOpen(false)} type="button">
            <X size={30} />
          </button>
        </div>
        <form className="flex w-full border-b px-6 py-3" onSubmit={submit}>
          <Search className="mr-6" size={25} />
          <input
            className="w-full"
            value={query}
            onChange={e => setQuery(e.target.value)}
            name="search"
            placeholder="What are you looking for?"
            type="search"
          />
        </form>
      </DialogPanel>
    </Dialog>
  );
};

export default SearchDialog;
