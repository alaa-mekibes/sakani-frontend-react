import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { api } from '../../lib/api';
import type { IUser } from '../../interfaces';
import { User, Mail, Calendar, Camera, Save, X, Lock, Eye, EyeOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils';
import DefaultAvatar from '../../components/images/DefaultAvatar';
import { updateUserSchema } from '../../validation';
import { FieldInfo } from '../../components/layout/FieldInfo';
import ConfirmDialog from '../../components/layout/ConfirmDialog';

export const Route = createFileRoute('/profile/$userId')({
  loader: async ({ params, context }) => {
    const res = await api.get<IUser>(`/auth/${params.userId}`);
    if (!res?.data) throw notFound();
    const isMine = context.user?._id === res.data._id;
    return { user: res.data, isMine }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user: initialUser, isMine } = Route.useLoaderData();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser>(initialUser!);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: initialUser!.name,
      password: '',
      confirmPassword: '',
    },
    validators: { onSubmit: updateUserSchema },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      if (value.name !== initialUser!.name) formData.append('name', value.name);
      if (value.password) formData.append('password', value.password);
      if (avatarFile) formData.append('avatar', avatarFile);

      if ([...formData.entries()].length === 0) {
        toast('Nothing to update');
        return;
      }

      const res = await api.uploadPatch<IUser>('/auth/me', formData);

      if (res?.status === 'success') {
        setCurrentUser(res.data!);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        toast.error(res.message ?? 'Update failed');
      }
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const deleteMe = async () => {
    const res = await api.delete("/auth/");
    if (res.status === 'success') {
      toast.success('Bye bye 🥺');
      setTimeout(() => navigate({ to: '/' }), 2000);
    } else {
      toast.error(res.message ?? 'Deletion failed');
    }
  };

  const avatarUrl = avatarPreview || currentUser.avatar || null;

  return (
    <div className="bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="relative h-32 bg-linear-to-r from-primary to-secondary rounded-t-2xl" />

          <div className="card-body pt-0">
            {/* avatar */}
            <div className="flex flex-col items-center -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full ring-4 ring-base-100 overflow-hidden bg-base-200">
                  {avatarUrl
                    ? <img src={avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    : <DefaultAvatar />
                  }
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>

              {isMine && (!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm mt-4 gap-2">
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={form.handleSubmit}
                    className="btn btn-primary btn-sm gap-2"
                    disabled={form.state.isSubmitting}
                  >
                    {form.state.isSubmitting
                      ? <span className="loading loading-spinner loading-xs" />
                      : <Save className="h-4 w-4" />
                    }
                    Save Changes
                  </button>
                  <button onClick={handleCancel} className="btn btn-ghost btn-sm gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Profile Information
              </h2>
              <div className="divider" />

              <div className="space-y-4  flex flex-col">
                {/* Name */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </span>
                  </label>
                  {isMine && isEditing ? (
                    <form.Field
                      name="name"
                      validators={{ onChange: ({ value }) => !value ? 'Name is required' : undefined }}
                    >
                      {(field) => (
                        <>
                          <input
                            type="text"
                            className="input input-bordered w-full"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                          <FieldInfo field={field} />
                        </>
                      )}
                    </form.Field>
                  ) : (
                    <p className="text-lg">{currentUser.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email Address
                    </span>
                  </label>
                  <a href={`mailto:${currentUser.email}`} className="text-lg text-primary hover:underline block">
                    {currentUser.email}
                  </a>
                </div>

                {/* password */}
                {isMine && isEditing && (
                  <>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4" /> New Password
                        </span>
                      </label>
                      <form.Field
                        name="password"
                        validators={{
                          onChange: ({ value }) =>
                            value && value.length < 6 ? 'Minimum 6 characters' : undefined,
                        }}
                      >
                        {(field) => (
                          <>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className="input input-bordered w-full pr-10"
                                placeholder="Leave blank to keep current"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50"
                                onClick={() => setShowPassword(p => !p)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <FieldInfo field={field} />
                          </>
                        )}
                      </form.Field>
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Confirm Password
                        </span>
                      </label>
                      <form.Field
                        name="confirmPassword"
                        validators={{
                          onChangeListenTo: ['password'],
                          onChange: ({ value, fieldApi }) =>
                            value !== fieldApi.form.getFieldValue('password')
                              ? 'Passwords do not match'
                              : undefined,
                        }}
                      >
                        {(field) => (
                          <>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className="input input-bordered w-full"
                              placeholder="Confirm new password"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                            />
                            <FieldInfo field={field} />
                          </>
                        )}
                      </form.Field>
                    </div>
                    <button
                      onClick={() => setOpenConfirm(true)}
                      className="btn btn-error mr-auto"
                    >
                      <Trash2 size={16} /> Delete account
                    </button>

                    {openConfirm && (
                      <ConfirmDialog
                        open={openConfirm}
                        title="Delete your account?"
                        text="This action cannot be undone."
                        onClose={() => setOpenConfirm(false)}
                        onConfirm={() => {
                          deleteMe();
                          setOpenConfirm(false);
                        }}
                      />
                    )}
                  </>
                )}

                {/* member Since */}
                {!isEditing && (
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Member Since
                      </span>
                    </label>
                    <p className="text-lg">
                      {formatDate(currentUser.createdAt)}
                    </p>
                  </div>
                )}

                {isMine && currentUser.updatedAt !== currentUser.createdAt && (
                  <p className="text-sm text-base-content/50">
                    Last updated: {formatDate(currentUser.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}