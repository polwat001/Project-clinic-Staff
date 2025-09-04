'use client'
import React, { useMemo } from 'react'
import type { Appointment } from '@/lib/types'
import { fmtDate } from '@/lib/utils'

export default function ApptsTab({ appts }: { appts: Appointment[] }) {
  const sorted = useMemo(
    () =>
      [...appts].sort(
        (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      ),
    [appts]
  )

  if (sorted.length === 0) {
    return <div className="text-sm text-gray-500">ยังไม่มีนัดหมาย</div>
  }

  return (
    <div className="space-y-2">
      {sorted.map((a) => (
        <div key={a.id} className="p-3 border rounded-xl bg-white">
          <div className="flex items-center justify-between">
            <div className="font-medium">{a.reason || 'ติดตามอาการ'}</div>
            <div className="text-xs text-gray-500">{fmtDate(a.start_at)}</div>
          </div>
          {a.note && <div className="text-sm text-gray-600 mt-1">{a.note}</div>}
        </div>
      ))}
    </div>
  )
}
