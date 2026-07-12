"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ShieldCheck,
  ShieldOff,
  User as UserIcon,
  Loader2,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getUsers } from "@/lib/api/user";
import { updateUserRole } from "@/lib/actions/user";
import Image from "next/image";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

interface PendingAction {
  user: AppUser;
  newRole: "user" | "admin";
}

export default function AdminUsersPage() {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleTab, setRoleTab] = useState<"all" | "admin" | "user">("all");

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );

  const showToast = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getUsers();
      setUsers(res || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const requestRoleToggle = (targetUser: AppUser) => {
    if (targetUser.id === currentUserId) {
      showToast("error", "You can't change your own role.");
      return;
    }
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    setPendingAction({ user: targetUser, newRole });
  };

  const confirmRoleToggle = async () => {
    if (!pendingAction) return;
    const { user: targetUser, newRole } = pendingAction;

    setPendingAction(null);
    try {
      setMutatingId(targetUser.id);
      await updateUserRole(targetUser.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u)),
      );
      showToast(
        "success",
        `${targetUser.name} is now ${newRole === "admin" ? "an Admin" : "a regular User"}.`,
      );
    } catch (err: any) {
      showToast("error", err.message || "Failed to update user role");
    } finally {
      setMutatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = roleTab === "all" || u.role === roleTab;
    return matchesSearch && matchesTab;
  });

  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalUsers = users.filter((u) => u.role !== "admin").length;

  const getRoleBadge = (role: AppUser["role"]) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-[#c8f542]/10 text-[#c8f542] border-[#c8f542]/20">
          <BadgeCheck size={12} />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-neutral-500/10 text-neutral-400 border-neutral-500/20">
        <UserIcon size={12} />
        User
      </span>
    );
  };

  return (
    <div className="space-y-6 min-h-screen bg-[#0a0a0a] text-slate-100 p-6 max-w-7xl mx-auto">
      {/* 🆕 Toast Container */}
      <div className="fixed top-6 right-6 z-[100] space-y-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-sm animate-in slide-in-from-top-2 fade-in duration-200 ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/20"
                : "bg-rose-950/90 border-rose-500/20"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2
                size={18}
                className="text-emerald-400 shrink-0 mt-0.5"
              />
            ) : (
              <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm font-semibold flex-1 ${
                toast.type === "success" ? "text-emerald-100" : "text-rose-100"
              }`}
            >
              {toast.message}
            </p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Manage Users
        </h1>
        <p className="text-sm font-medium text-slate-400 mt-0.5">
          View all registered users and control admin access.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-neutral-800 bg-neutral-900/40 rounded-2xl">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Total Users
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {loading ? "..." : users.length}
          </p>
        </div>
        <div className="p-5 border border-neutral-800 bg-neutral-900/40 rounded-2xl">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Admins
          </p>
          <p className="text-2xl font-black text-[#c8f542] mt-1">
            {loading ? "..." : totalAdmins}
          </p>
        </div>
        <div className="p-5 border border-neutral-800 bg-neutral-900/40 rounded-2xl">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Regular Users
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {loading ? "..." : totalUsers}
          </p>
        </div>
      </div>

      {/* Search + Role Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-3.5 text-neutral-500"
            size={16}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 rounded-2xl text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 transition-all"
          />
        </div>

        <div className="inline-flex bg-neutral-900/60 border border-neutral-800 rounded-2xl p-1">
          {(["all", "admin", "user"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRoleTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                roleTab === tab
                  ? "bg-[#c8f542] text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "All" : tab === "admin" ? "Admins" : "Users"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 border border-neutral-800 rounded-3xl bg-neutral-900/20">
          <Loader2 className="animate-spin text-[#c8f542] mb-3" size={32} />
          <p className="text-sm font-semibold text-neutral-400">
            Loading users...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 border border-rose-900/30 rounded-3xl bg-rose-950/10 text-center p-6">
          <p className="text-sm font-bold text-rose-400">Error: {error}</p>
          <button
            onClick={fetchUsersData}
            className="mt-3 text-xs font-bold text-[#c8f542] underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="border border-neutral-800 rounded-3xl overflow-hidden bg-neutral-900/20 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900/60 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-sm font-medium text-neutral-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-sm text-neutral-500 font-semibold"
                    >
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.id === currentUserId;
                    const isMutating = mutatingId === u.id;
                    const isAdmin = u.role === "admin";

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-neutral-900/40 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {u.image ? (
                              <Image
                                height={100}
                                width={100}
                                src={u.image}
                                alt={u.name}
                                className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
                                {u.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                            )}
                            <span className="font-bold text-neutral-200 group-hover:text-white transition-colors">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 text-[10px] font-bold text-neutral-500 uppercase">
                                  (You)
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-neutral-400 text-xs">
                          {u.email}
                        </td>

                        <td className="py-4 px-6">{getRoleBadge(u.role)}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            disabled={isSelf || isMutating}
                            onClick={() => requestRoleToggle(u)}
                            title={
                              isSelf
                                ? "You can't change your own role"
                                : isAdmin
                                  ? "Demote to user"
                                  : "Promote to admin"
                            }
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                              isAdmin
                                ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                : "bg-[#c8f542] hover:bg-[#b0d839] text-black"
                            }`}
                          >
                            {isMutating ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : isAdmin ? (
                              <ShieldOff size={14} />
                            ) : (
                              <ShieldCheck size={14} />
                            )}
                            {isAdmin ? "Demote" : "Promote"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-xs font-semibold text-neutral-500">
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>
      )}

      {/* 🆕 Confirmation Modal (confirm() এর বদলে) */}
      {pendingAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[90] animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-neutral-800 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                pendingAction.newRole === "admin"
                  ? "bg-[#c8f542]/10 text-[#c8f542]"
                  : "bg-rose-500/10 text-rose-400"
              }`}
            >
              <AlertTriangle size={22} />
            </div>

            <h2 className="text-lg font-black text-white text-center mb-2">
              {pendingAction.newRole === "admin"
                ? "Promote to Admin?"
                : "Demote to User?"}
            </h2>
            <p className="text-sm text-neutral-400 text-center mb-6">
              {pendingAction.newRole === "admin" ? (
                <>
                  <span className="font-bold text-white">
                    {pendingAction.user.name}
                  </span>{" "}
                  will get full admin access to this dashboard.
                </>
              ) : (
                <>
                  <span className="font-bold text-white">
                    {pendingAction.user.name}
                  </span>{" "}
                  will lose admin access and become a regular user.
                </>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPendingAction(null)}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold py-2.5 rounded-2xl border border-neutral-800 transition-all cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleToggle}
                className={`w-full font-bold py-2.5 rounded-2xl transition-all cursor-pointer text-sm ${
                  pendingAction.newRole === "admin"
                    ? "bg-[#c8f542] hover:bg-[#b0d839] text-black"
                    : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
