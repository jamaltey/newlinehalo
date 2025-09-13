import clsx from 'clsx';
import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const AccountLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="container mx-auto max-w-[52rem] px-4">
      <div className="flex items-center justify-center gap-4 pb-7 text-xs font-bold uppercase md:gap-6">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            clsx(
              'rounded-4xl border px-[10px] py-1',
              isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#f6f6f6]'
            )
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            clsx(
              'rounded-4xl border px-[10px] py-1',
              isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#f6f6f6]'
            )
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            clsx(
              'rounded-4xl border px-[10px] py-1',
              isActive ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#f6f6f6]'
            )
          }
        >
          Favorites
        </NavLink>
        <button
          onClick={signOut}
          className="rounded-4xl border bg-white px-[10px] py-1 text-black uppercase hover:bg-[#f6f6f6] md:hidden"
          type="button"
        >
          Logout
        </button>
      </div>
      <Outlet />
    </div>
  );
};

export default AccountLayout;
