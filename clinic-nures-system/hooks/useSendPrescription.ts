// src/hooks/useSendPrescription.ts
'use client'
import { useCallback, useState } from 'react'
import type { RxItem } from '@/lib/types'
import { sendPrescription } from '@/lib/db'

export function useSendPrescription(patientId: string | null) {
  const [sending, setSending] = useState(false)
  const [lastId, setLastId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onSend = useCallback(async (items: RxItem[]) => {
    if (!patientId) {
      setError('ไม่พบรหัสผู้ป่วย')
      return null
    }
    if (!items.length) {
      setError('ไม่มีรายการยา')
      return null
    }

    setSending(true)
    setError(null)
    setLastId(null)
    try {
      const res = await sendPrescription({ patient_id: patientId, items })
      if (!res) {
        setError('ส่งใบสั่งยาไม่สำเร็จ')
        return null
      }
      setLastId(res.id)
      return res.id
    } catch (e) {
      console.error(e)
      setError('เกิดข้อผิดพลาดขณะส่งใบสั่งยา')
      return null
    } finally {
      setSending(false)
    }
  }, [patientId])

  return { sending, lastId, error, onSend }
}
