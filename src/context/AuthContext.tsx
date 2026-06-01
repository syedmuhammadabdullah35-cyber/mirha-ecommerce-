export function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the authentication check is completed
    if (loading) return;

    // If the user is not logged in or is not an admin, redirect to login
    if (!user || !isAdmin) {
      navigate('/admin/login');
    }
  }, [user, loading, isAdmin, navigate]);

  // Show a loading message while authentication is in progress
  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Your Admin Dashboard content */}
      <Outlet />
    </div>
  );
}
