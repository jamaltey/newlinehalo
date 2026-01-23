import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import FormCheckbox from '../components/forms/FormCheckbox';
import FormInput from '../components/forms/FormInput';
import Loading from '../components/Loading';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const phoneRegex = /^[0-9+()\-.\s]*$/;

const schema = yup.object({
  firstName: yup.string().required('This field is required'),
  lastName: yup.string().required('This field is required'),
  phone: yup
    .string()
    .nullable()
    .max(30, 'Phone number is too long')
    .matches(phoneRegex, 'Use numbers and phone symbols only'),
  address: yup.string().nullable().max(255, 'Address is too long'),
  gender: yup
    .string()
    .oneOf(['', 'female', 'male'], 'Choose a valid option'),
  isSubscribed: yup.boolean(),
});

const EditProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile, loading, error } = useProfile();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      gender: '',
      isSubscribed: false,
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        phone: profile.phone ?? '',
        address: profile.address ?? '',
        gender: profile.gender ?? '',
        isSubscribed: !!profile.isSubscribed,
      });
    }
  }, [profile, reset]);

  if (!user && !authLoading) return <Navigate to="/login" />;

  if ((loading || authLoading) && !profile) {
    return (
      <div className="relative h-[50vh]">
        <Loading />
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" />;

  const submit = async values => {
    const payload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone?.trim() || null,
      address: values.address?.trim() || null,
      gender: values.gender || null,
      isSubscribed: values.isSubscribed,
    };

    const { error: updateError } = await updateProfile(payload);

    if (updateError) {
      toast.error('Could not update your profile. Please try again.');
      return;
    }

    toast.success('Profile updated successfully.');
    navigate('/profile');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#bfbfbf] pb-4">
        <Link to="/profile" className="flex items-center gap-1 text-xs uppercase underline">
          <ChevronLeft size={16} />
          Back to profile
        </Link>
        <h1 className="text-center text-2xl font-medium uppercase">Edit profile</h1>
        <span className="w-24" />
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="relative space-y-6 rounded-lg border border-[#e6e6e6] bg-white/70 p-5 shadow-sm"
        noValidate
      >
        {loading && profile && <Loading />}

        {error && <p className="text-xs text-[#d03a3a]">{error.message}</p>}

        <div className="-mx-2 flex flex-wrap gap-y-4">
          <div className="w-full px-2 md:w-1/2">
            <FormInput
              label="First name"
              name="firstName"
              invalid={!!errors.firstName}
              errorMessage={errors.firstName?.message}
              register={register}
            />
          </div>
          <div className="w-full px-2 md:w-1/2">
            <FormInput
              label="Last name"
              name="lastName"
              invalid={!!errors.lastName}
              errorMessage={errors.lastName?.message}
              register={register}
            />
          </div>
          <div className="w-full px-2 md:w-1/2">
            <FormInput
              label="Phone number"
              name="phone"
              placeholder="Add your phone number"
              invalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              register={register}
            />
          </div>
          <div className="w-full px-2 md:w-1/2">
            <label className="text-xs capitalize" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="mt-2 w-full border border-[#d4d4d4] bg-white px-4 py-2.5 text-[#495057] duration-300 hover:border-black focus:outline-0"
              {...register('gender')}
            >
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            {errors.gender && <p className="mt-2 text-xs text-[#d03a3a]">{errors.gender.message}</p>}
          </div>
          <div className="w-full px-2">
            <label className="text-xs capitalize" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              rows="3"
              className="mt-2 w-full resize-none border border-[#d4d4d4] bg-white px-4 py-2.5 text-[#495057] duration-300 hover:border-black focus:outline-0"
              placeholder="Street, house number, city"
              {...register('address')}
            />
            {errors.address && <p className="mt-2 text-xs text-[#d03a3a]">{errors.address.message}</p>}
          </div>
        </div>

        <Controller
          control={control}
          name="isSubscribed"
          render={({ field }) => (
            <FormCheckbox
              label="Yes, please sign me up for weekly HALO newsletters."
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/profile" className="btn text-dark [--btn-bg:#fff]">
            Cancel
          </Link>
          <button
            className="btn disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting || loading || !isDirty}
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
