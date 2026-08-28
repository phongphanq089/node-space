export interface AdminKpiMetric {
  id: string
  label: string
  value: string | number
  change: number // percentage
  trend: 'up' | 'down' | 'neutral'
  subtitle: string
  iconName: string
  color: string
}

export interface AnalyticsTrafficPoint {
  date: string
  pageviews: number
  visitors: number
  sessions: number
  bounceRate: number
}

export interface RevenueGrowthPoint {
  month: string
  mrr: number
  newCustomers: number
  churnRate: number
  proUsers: number
  teamUsers: number
}

export interface AdminUserItem {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'moderator'
  plan: 'Free' | 'Pro' | 'Team' | 'Enterprise'
  status: 'active' | 'pending' | 'suspended'
  notesCount: number
  storageUsedMb: number
  country: string
  countryCode: string
  lastActive: string
  createdAt: string
}

export interface SystemHealthMetric {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  latency: string
  uptime: string
  metricLabel: string
  metricValue: string
  usagePercent?: number
}

export interface DeviceBreakdownItem {
  device: string
  percentage: number
  visitors: number
  icon: string
}

export interface TrafficSourceItem {
  source: string
  visitors: number
  percentage: number
  change: number
}
