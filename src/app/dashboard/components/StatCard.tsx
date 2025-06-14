'use client'

import {
  BarChart,
  Users,
  Clock,
  ArrowUp,
  LucideIcon,
} from 'lucide-react'

const icons = {
  'bar-chart': BarChart,
  users: Users,
  clock: Clock,
  'arrow-up': ArrowUp,
} as const

type IconKey = keyof typeof icons

interface StatCardProps {
  title: string
  value: string | number
  delta: string | number
  icon: IconKey
}

export default function StatCard({ title, value, delta, icon }: StatCardProps) {
  const Icon: LucideIcon = icons[icon]
  return (
    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-800 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h2 className="text-md">{title}</h2>
        <Icon className="h-5 w-5 text-green-500" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-green-400">{delta} from last month</div>
    </div>
  )
}
