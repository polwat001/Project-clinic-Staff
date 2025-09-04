'use client'
import React, { useMemo } from 'react'
import type { Visit } from '@/lib/types'
import { fmtDate } from '@/lib/utils'

export default function HistoryTab({
  patientId,
  visits,
}: {
  patientId: string
  visits: Visit[]
}) {
  const sorted = useMemo(
    () =>
      [...visits].sort(
        (a, b) => new Date(b.visit_at).getTime() - new Date(a.visit_at).getTime()
      ),
    [visits]
  )

  if (sorted.length === 0) {
    return <div className="text-sm text-gray-500">ไม่มีประวัติการรักษาเดิม</div>
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">Patient ID: {patientId}</div>

      {sorted.map((v, i) => (
        <div key={v.id ?? `${v.visit_at}-${i}`} className="p-3 border rounded-xl bg-white">
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium break-words">
              {v.diagnosis?.trim() || '—'}
            </div>
            <div className="text-xs text-gray-500 shrink-0">
              {fmtDate(v.visit_at)}
            </div>
          </div>

          <div className="mt-2 space-y-1 text-sm text-gray-700 whitespace-pre-wrap break-words">
            <div>
              <span className="font-medium">Chief Complaint:</span>{' '}
              {v.chief_complaint?.trim() || '—'}
            </div>
            <div>
              <span className="font-medium">Plan:</span>{' '}
              {v.plan?.trim() || '—'}
            </div>
            <div>
              <span className="font-medium">Advice:</span>{' '}
              {v.advice?.trim() || '—'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
