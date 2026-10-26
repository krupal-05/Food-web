import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Store,
  User,
  Truck,
  RotateCcw,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { authService } from '../../services/auth.service.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import { TableSkeleton } from '../../components/common/Skeleton.jsx';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const { error: toastError } = useToast();

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      toastError('Could not fetch user directory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    // Role filter
    if (selectedRoleFilter !== 'all') {
      const normalizedRole = u.role?.toLowerCase() || '';
      if (selectedRoleFilter === 'owner') {
        if (!['restaurantowner', 'owner', 'restaurant_owner'].includes(normalizedRole))
          return false;
      } else if (normalizedRole !== selectedRoleFilter) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
      const email = u.email?.toLowerCase() || '';
      const phone = u.phone || '';
      return name.includes(q) || email.includes(q) || phone.includes(q);
    }

    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-1">
            Accounts & Access Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Outfit'] tracking-tight">
            User Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of all registered customers, restaurant merchants, and administrators
          </p>
        </div>

        <Button onClick={loadUsers} variant="outline" size="sm" icon={RotateCcw}>
          Refresh Directory
        </Button>
      </div>

      {/* Role Summary Counts Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Users</span>
          <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-0.5">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Customers</span>
          <p className="text-xl font-black text-slate-900 font-['Outfit'] mt-0.5">
            {users.filter((u) => u.role === 'customer').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Merchants / Owners</span>
          <p className="text-xl font-black text-orange-600 font-['Outfit'] mt-0.5">
            {
              users.filter((u) =>
                ['restaurantowner', 'owner', 'restaurant_owner'].includes(u.role?.toLowerCase())
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Admins</span>
          <p className="text-xl font-black text-purple-600 font-['Outfit'] mt-0.5">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'customer', label: 'Customers' },
            { id: 'owner', label: 'Merchants' },
            { id: 'admin', label: 'Admins' },
            { id: 'deliveryagent', label: 'Delivery Agents' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                selectedRoleFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-md mx-auto shadow-xs">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Users Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your role filter or search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const roleNormalized = u.role?.toLowerCase() || 'customer';
                  const isOwner = ['restaurantowner', 'owner', 'restaurant_owner'].includes(
                    roleNormalized
                  );
                  const isAdmin = roleNormalized === 'admin';

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                              isAdmin
                                ? 'bg-purple-100 text-purple-700'
                                : isOwner
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.firstName ? u.firstName[0].toUpperCase() : 'U'}
                          </div>
                          <span className="font-extrabold text-slate-900 text-sm">
                            {u.firstName || 'Unnamed'} {u.lastName || ''}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">{u.email}</td>

                      <td className="py-3.5 px-4 text-slate-500">{u.phone || '—'}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                            isAdmin
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : isOwner
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isAdmin ? 'Admin' : isOwner ? 'Merchant' : u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {u.address?.city
                          ? `${u.address.city}${u.address.pincode ? ` (${u.address.pincode})` : ''}`
                          : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
