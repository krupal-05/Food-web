import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ShieldX, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    const redirectUrl = allowedRoles.includes('admin') ? '/admin/login' : '/login';
    return <Navigate to={redirectUrl} state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toLowerCase() || '';
  const isOwner = userRole === 'restaurantowner' || userRole === 'owner';

  const hasAccess = allowedRoles.some((role) => {
    const r = role.toLowerCase();
    if (r === 'restaurantowner' || r === 'owner') {
      return isOwner;
    }
    return r === userRole;
  });

  if (!hasAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
            <ShieldX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Your account role (<span className="font-bold text-slate-700">{user?.role}</span>) is
            not authorized to view this resource. This area is protected by backend RBAC security.
          </p>
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Return Home
              </Button>
            </Link>
            {isOwner && (
              <Link to="/owner/dashboard">
                <Button variant="primary" size="sm">
                  Owner Dashboard
                </Button>
              </Link>
            )}
            {userRole === 'admin' && (
              <Link to="/admin/dashboard">
                <Button variant="secondary" size="sm">
                  Admin Console
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleRoute;
