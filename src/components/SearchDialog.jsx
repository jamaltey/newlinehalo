import { Dialog, DialogPanel } from '@headlessui/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import supabase from '../utils/supabase';

const SearchDialog = ({ open, setOpen }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!debouncedQuery) {
        setResults([]);
        setTotalCount(0);
        return;
      }
      setLoading(true);
      const { data, error, count } = await supabase
        .from('products')
        .select('id,name,slug,price_current,price_old,tags,product_images(*),product_colors(color_id)', { count: 'exact' })
        .in('product_images.type', ['packshot'])
        .ilike('name', `%${debouncedQuery}%`)
        .range(0, 4);
      if (cancelled) return;
      if (!error) {
        setResults(data || []);
        setTotalCount(count || 0);
      }
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const submit = e => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <Dialog
      className="bg-cream text-dark fixed inset-0 z-50 lg:hidden"
      open={open}
      onClose={() => setOpen(false)}
    >
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
        {query && (
          <div className="px-6 py-3">
            <div className="mb-3 text-xs font-bold uppercase text-[#6a6967]">
              {loading ? (
                'Searching…'
              ) : totalCount ? (
                <Link
                  to={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setOpen(false)}
                  className="underline"
                >
                  See all results ({totalCount})
                </Link>
              ) : (
                'No results'
              )}
            </div>
            <ul className="divide-y divide-[#cbcbcb]">
              {results.map(p => {
                const image = p.product_images?.[0];
                return (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-2"
                    >
                      {image && (
                        <img
                          className="h-14 w-10 object-cover"
                          src={`${image.url}?sw=140&sh=186&q=80`}
                          alt={p.name}
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase leading-tight">{p.name}</span>
                        <span className="text-xs">{p.price_current} EUR</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
};

export default SearchDialog;
