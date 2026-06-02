import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, LogIn, ShieldAlert } from 'lucide-react';

export function AdminLogin() {
  const { user, login, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  if (loading) return <div>Loading...</div>; // Or use a custom Loader component

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary p-4">
      <div className="max-w-md w-full bg-white p-12 border border-brand-gold/20 shadow-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-brand-gold/10 rounded-full text-brand-gold">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-4xl font-serif">Google Account</h1>
          <p className="text-gray-500 text-sm">
            Please sign in with an authorized admin account to manage Mirha By Insaf.
          </p>
        </div>

        {user && !isAdmin && (
          <div className="bg-red-50 text-red-600 p-4 rounded text-xs border border-red-100">
            Access Denied: Your account ({user?.email}) is not authorized as an admin.
          </div>
        )}

        <button
          onClick={login}
          disabled={loading} // Disable button while authentication is in progress
          className="w-full bg-black text-white py-5 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold transition-all flex items-center justify-center space-x-3"
        >
          <LogIn size={18} />
          <span>Sign In with Google</span>
        </button>

        {/* Use Link instead of <a> for React Router navigation */}
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 text-xs uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-all"
        >
          <ChevronLeft size={14} />
          <span>Back to Store</span>
        </Link>
      </div>
    </div>
  );
}
