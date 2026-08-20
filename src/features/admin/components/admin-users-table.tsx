import { useState } from 'react'
import { Users, Search, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import type { AdminUserItem } from '../types'
import { toast } from 'sonner'

interface AdminUsersTableProps {
  users: AdminUserItem[]
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
    const matchPlan =
      planFilter === 'all' || u.plan.toLowerCase() === planFilter.toLowerCase()
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchPlan && matchStatus
  })

  const handleUserAction = (userName: string, action: string) => {
    toast.success(`Action "${action}" performed on ${userName}`)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ns-border bg-ns-panel p-4 shadow-sm backdrop-blur-md sm:p-6 dark:border-ns-border/30 dark:bg-ns-panel/80 dark:shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-50 text-violet-600 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-400">
            <Users size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-ns-text sm:text-base">
                User Directory & Subscription Management
              </h2>
              <span className="py-0.2 rounded-full border border-violet-500/30 bg-violet-50 px-2 text-[0.6rem] font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                {users.length} Active Accounts
              </span>
            </div>
            <p className="text-[0.7rem] font-medium text-ns-muted">
              Inspect user roles, storage quotas, subscription plans, and
              account statuses
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 text-ns-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or email..."
              className="h-8.5 w-44 rounded-xl border border-ns-border bg-ns-surface pr-3 pl-8 text-xs font-semibold text-ns-text placeholder-ns-placeholder transition-all outline-none focus:w-56 focus:border-violet-500 dark:border-white/10 dark:bg-black/40"
            />
          </div>

          {/* Plan Filter Custom UI Select */}
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="h-8.5 w-36 rounded-xl border-ns-border bg-ns-surface text-xs font-semibold text-ns-text shadow-xs dark:border-white/10 dark:bg-black/40">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-ns-border bg-ns-surface text-ns-text shadow-xl dark:border-white/15 dark:bg-[#120f24] dark:text-white"
            >
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro ($8/mo)</SelectItem>
              <SelectItem value="team">Team ($24/mo)</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter Custom UI Select */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8.5 w-32 rounded-xl border-ns-border bg-ns-surface text-xs font-semibold text-ns-text shadow-xs dark:border-white/10 dark:bg-black/40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="border-ns-border bg-ns-surface text-ns-text shadow-xl dark:border-white/15 dark:bg-[#120f24] dark:text-white"
            >
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-ns-border bg-ns-surface dark:border-white/10 dark:bg-black/30">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-ns-border bg-ns-surface-alt text-[0.65rem] font-bold tracking-wider text-ns-muted uppercase dark:border-white/10 dark:bg-white/5">
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Plan</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Notes</th>
              <th className="p-3.5">Storage</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Joined</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ns-border-soft font-medium text-ns-text-2 dark:divide-white/5">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="p-8 text-center text-xs text-ns-muted"
                >
                  No users found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="transition-colors hover:bg-ns-hover/30 dark:hover:bg-white/5"
                >
                  {/* User name & email */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-violet-200 bg-violet-100 dark:border-transparent dark:bg-violet-600/20">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-violet-700 dark:text-violet-300">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="truncate font-bold text-ns-text">
                          {u.name}
                        </span>
                        <span className="text-[0.65rem] text-ns-muted">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-3.5">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-50 px-2 py-0.5 text-[0.65rem] font-bold text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-300">
                        <Shield size={10} />
                        <span>Admin</span>
                      </span>
                    ) : u.role === 'moderator' ? (
                      <span className="inline-flex items-center rounded-md border border-sky-500/30 bg-sky-50 px-2 py-0.5 text-[0.65rem] font-bold text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-300">
                        Mod
                      </span>
                    ) : (
                      <span className="text-ns-muted">User</span>
                    )}
                  </td>

                  {/* Plan */}
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-black ${
                        u.plan === 'Enterprise'
                          ? 'border border-amber-500/30 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300'
                          : u.plan === 'Team'
                            ? 'border border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300'
                            : u.plan === 'Pro'
                              ? 'border border-violet-500/30 bg-violet-50 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-300'
                              : 'border border-ns-border bg-ns-surface-alt text-ns-muted dark:border-white/10 dark:bg-white/5'
                      }`}
                    >
                      {u.plan}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                        u.status === 'active'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : u.status === 'pending'
                            ? 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.status === 'active'
                            ? 'bg-emerald-500'
                            : u.status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                        }`}
                      />
                      <span className="capitalize">{u.status}</span>
                    </span>
                  </td>

                  {/* Notes Count */}
                  <td className="p-3.5 font-bold text-ns-text">
                    {u.notesCount}
                  </td>

                  {/* Storage */}
                  <td className="p-3.5 text-ns-muted">
                    {u.storageUsedMb >= 1000
                      ? `${(u.storageUsedMb / 1000).toFixed(1)} GB`
                      : `${u.storageUsedMb} MB`}
                  </td>

                  {/* Country */}
                  <td className="p-3.5 text-ns-muted">
                    {u.country} ({u.countryCode})
                  </td>

                  {/* Joined */}
                  <td className="p-3.5 text-[0.7rem] text-ns-muted">
                    {u.createdAt}
                  </td>

                  {/* Action */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleUserAction(u.name, 'Edit Role')}
                        className="cursor-pointer rounded-lg border border-ns-border bg-ns-surface-alt px-2.5 py-1 text-[0.65rem] font-bold text-ns-text shadow-xs transition-all hover:border-violet-400 hover:bg-ns-hover dark:border-white/10 dark:bg-white/5 dark:text-ns-text-2"
                      >
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-1 text-xs text-ns-muted">
        <span>
          Showing {filteredUsers.length} of {users.length} users
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-ns-border bg-ns-surface opacity-50 dark:border-white/10 dark:bg-white/5"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            type="button"
            disabled
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-ns-border bg-ns-surface opacity-50 dark:border-white/10 dark:bg-white/5"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
