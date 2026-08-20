import { useState } from 'react'
import { AdminHeader } from './admin-header'
import { AdminKpiGrid } from './admin-kpi-grid'
import { AdminAnalyticsChart } from './admin-analytics-chart'
import { AdminRevenueChart } from './admin-revenue-chart'
import { AdminUserBehaviorCard } from './admin-user-behavior-card'
import { AdminSystemHealthCard } from './admin-system-health-card'
import { AdminUsersTable } from './admin-users-table'
import {
  ADMIN_KPI_METRICS,
  ANALYTICS_TRAFFIC_DATA,
  REVENUE_GROWTH_DATA,
  DEVICE_BREAKDOWN_DATA,
  TRAFFIC_SOURCES_DATA,
  SYSTEM_HEALTH_METRICS,
  ADMIN_USERS_LIST,
} from '../mocks/admin-mock-data'
import { toast } from 'sonner'

export function AdminDashboardView() {
  const [timeRange, setTimeRange] = useState('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('Admin Dashboard telemetry refreshed!')
    }, 600)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-ns-bg text-ns-text">
      {/* Top Sticky Admin Header */}
      <AdminHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Dashboard Canvas Flow */}
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* 1. Overview KPI Summary Row */}
        <AdminKpiGrid metrics={ADMIN_KPI_METRICS} />

        {/* 2. Double Chart Analytics Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Google Analytics Traffic Chart (7 cols) */}
          <div className="xl:col-span-7">
            <AdminAnalyticsChart data={ANALYTICS_TRAFFIC_DATA} />
          </div>

          {/* MRR & Subscription Tier Growth (5 cols) */}
          <div className="xl:col-span-5">
            <AdminRevenueChart data={REVENUE_GROWTH_DATA} />
          </div>
        </div>

        {/* 3. User Behavior & Acquisition Channels */}
        <AdminUserBehaviorCard
          deviceData={DEVICE_BREAKDOWN_DATA}
          trafficSources={TRAFFIC_SOURCES_DATA}
        />

        {/* 4. Infrastructure & Server Telemetry */}
        <AdminSystemHealthCard metrics={SYSTEM_HEALTH_METRICS} />

        {/* 5. User Directory Table */}
        <AdminUsersTable users={ADMIN_USERS_LIST} />
      </div>
    </div>
  )
}
