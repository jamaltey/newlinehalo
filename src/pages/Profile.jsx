import { Link, Navigate } from 'react-router';
import FormCheckbox from '../components/forms/FormCheckbox';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const Profile = () => {
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile();

  if (!user || !profile) return <Navigate to="/login" />;

  if (loading) {
    return (
      <div className="relative h-[50vh]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <h1 className="text-center text-2xl font-medium uppercase">Hello {profile.firstName}</h1>
      <div className="flex justify-between border-b border-[#bfbfbf] py-3">
        <h3 className="text-sm font-medium uppercase">Personal Information</h3>
        <Link to="/profile/edit" className="text-dark text-xs underline">
          Edit Profile
        </Link>
      </div>
      <div className="-mx-2 flex flex-wrap gap-y-7">
        {/* Name */}
        <div className="order-0 w-1/2 px-2 sm:w-1/3">
          <dl>
            <dt className="text-xs text-[#737373] uppercase">Name</dt>
            <dd className="text-sm">
              {profile.firstName} {profile.lastName}
            </dd>
          </dl>
        </div>

        {/* Phone */}
        <div className="order-1 w-1/2 px-2 sm:order-none sm:w-1/3">
          <dl>
            <dt className="text-xs text-[#737373] uppercase">Phone</dt>
            <dd className="text-sm">{profile.phone}</dd>
          </dl>
        </div>

        {/* Address */}
        <div className="order-2 w-1/2 px-2 sm:order-none sm:w-1/3">
          <dl>
            <dt className="text-xs text-[#737373] uppercase">Address</dt>
            <dd className="text-sm">{profile.address}</dd>
          </dl>
        </div>

        {/* Gender */}
        <div className="order-0 w-1/2 px-2 sm:order-none sm:w-1/3">
          <dl>
            <dt className="text-xs text-[#737373] uppercase">Gender</dt>
            <dd className="text-sm">{profile.gender}</dd>
          </dl>
        </div>

        {/* Mail */}
        <div className="order-1 w-1/2 px-2 sm:order-none sm:w-1/3">
          <dl>
            <dt className="text-xs text-[#737373] uppercase">Mail</dt>
            <dd className="text-sm">{user.email}</dd>
          </dl>
        </div>
      </div>
      <div className="flex justify-end border-b border-[#bfbfbf] pb-8">
        <div className="w-2/3 text-[#6c757d]">
          <FormCheckbox
            label="Yes, please sign me up for weekly HALO newsletters."
            checked={profile.isSubscribed}
            onChange={isSubscribed => updateProfile({ isSubscribed })}
          />
        </div>
      </div>
      <div className="text-sm">
        <h3 className="mb-3 font-medium uppercase">Orders</h3>
        <p>We look forward to receiving your first order.</p>
      </div>
    </div>
  );
};

export default Profile;
