import { useTypedSelector, useAppDispatch } from '@/api/store/store';
import { logout } from '@/state/auth';
import { Navigate, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <h1 className='text-2xl font-bold text-gray-900'>User Profile</h1>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-sm border p-6'>
          <div className='flex justify-between items-start mb-6'>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>
                Profile Information
              </h2>
              <p className='text-sm text-gray-600'>
                Your account details and system access
              </p>
            </div>
            <button
              onClick={handleLogout}
              className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors'
            >
              Sign Out
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Account Details
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Username
                  </label>
                  <div className='mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border'>
                    {user.username}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Role
                  </label>
                  <div className='mt-1'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {formatRole(user.role)}
                    </span>
                  </div>
                </div>

                {user.name && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Full Name
                    </label>
                    <div className='mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border'>
                      {user.name}
                    </div>
                  </div>
                )}

                {user.email && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Email
                    </label>
                    <div className='mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border'>
                      {user.email}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                System Access
              </h3>

              <div className='space-y-3'>
                {user.role === 'admin' && (
                  <>
                    <div className='flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded'>
                      <div>
                        <div className='font-medium text-purple-900'>
                          Admin Dashboard
                        </div>
                        <div className='text-sm text-purple-700'>
                          Manage zones, users, and system settings
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/admin')}
                        className='bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm'
                      >
                        Access
                      </button>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded'>
                      <div>
                        <div className='font-medium text-blue-900'>
                          Checkpoint Access
                        </div>
                        <div className='text-sm text-blue-700'>
                          Process ticket checkouts
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/checkpoint')}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm'
                      >
                        Access
                      </button>
                    </div>
                  </>
                )}

                {user.role === 'employee' && (
                  <div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded'>
                    <div>
                      <div className='font-medium text-blue-900'>
                        Checkpoint Access
                      </div>
                      <div className='text-sm text-blue-700'>
                        Process ticket checkouts
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/checkpoint')}
                      className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm'
                    >
                      Access
                    </button>
                  </div>
                )}

                <div className='flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded'>
                  <div>
                    <div className='font-medium text-gray-900'>Gate Access</div>
                    <div className='text-sm text-gray-700'>
                      Access parking gates for check-ins
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className='bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm'
                  >
                    Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
