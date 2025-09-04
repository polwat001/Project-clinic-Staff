'use client'
import React, { useMemo } from 'react'
import type { Visit } from '@/lib/types'
import { fmtDate } from '@/lib/utils'

export default function OverviewTab({ visits }: { visits: Visit[] }) {
  const latest = useMemo(() => {
    if (!visits?.length) return null
    return visits.reduce((acc: Visit | null, cur) => {
      if (!cur.visit_at) return acc
      if (!acc || new Date(cur.visit_at).getTime() > new Date(acc.visit_at).getTime()) {
        return cur
      }
      return acc
    }, null)
  }, [visits])

  if (!latest) {
    return <div className="text-sm text-gray-500">ยังไม่มีเวชระเบียน</div>
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-500">
        เยี่ยมล่าสุด: {latest.visit_at ? fmtDate(latest.visit_at) : '—'}
      </div>

      <div className="whitespace-pre-wrap break-words">
        <span className="font-medium">อาการนำ:</span>{' '}
        {latest.chief_complaint?.trim() || '-'}
      </div>

      <div className="whitespace-pre-wrap break-words">
        <span className="font-medium">การวินิจฉัย:</span>{' '}
        {latest.diagnosis?.trim() || '-'}
      </div>

      <div className="whitespace-pre-wrap break-words">
        <span className="font-medium">แผนการรักษา:</span>{' '}
        {latest.plan?.trim() || '-'}
      </div>

      <div className="whitespace-pre-wrap break-words">
        <span className="font-medium">คำแนะนำ:</span>{' '}
        {latest.advice?.trim() || '-'}
      </div>
    </div>
  )
}
