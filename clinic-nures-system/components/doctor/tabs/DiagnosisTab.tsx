'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, CardContent, Textarea } from '@/components/doctor/ui-lite'
import { useToast } from '@/components/ui/use-toast' // เพิ่ม import

type Props = {
  diag: string
  setDiag: (v: string) => void
  plan: string
  setPlan: (v: string) => void
  advice: string
  setAdvice: (v: string) => void
  onSave: () => void
}

export default function DiagnosisTab({
  diag,
  setDiag,
  plan,
  setPlan,
  advice,
  setAdvice,
  onSave,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [copying, setCopying] = useState(false)
  const [editing, setEditing] = useState(false)
  const { toast } = useToast() // ใช้งาน toast

  const patientSummary = useMemo(
    () =>
      `การวินิจฉัย: ${diag?.trim() || 'ไม่มีข้อมูล'}\nแผนการรักษา: ${
        plan?.trim() || 'ไม่มีข้อมูล'
      }\nคำแนะนำ: ${advice?.trim() || 'ไม่มีข้อมูล'}`,
    [diag, plan, advice]
  )

  const handleSave = useCallback(async () => {
    try {
      setSaving(true)
      await Promise.resolve(onSave())
      // toast({ description: 'บันทึกเวชระเบียนเรียบร้อย', variant: 'default' }) // แจ้งเตือนแบบ toast
    } finally {
      setSaving(false)
    }
  }, [onSave, toast])

  const handleCopy = useCallback(async () => {
    try {
      setCopying(true)
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(patientSummary)
        // toast({ description: 'คัดลอกคำแนะนำเรียบร้อย', variant: 'default' }) // แจ้งเตือนแบบ toast
      } else {
        const ta = document.createElement('textarea')
        ta.value = patientSummary
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        // toast({ description: 'คัดลอกคำแนะนำเรียบร้อย', variant: 'default' }) // แจ้งเตือนแบบ toast
      }
    } finally {
      setCopying(false)
    }
  }, [patientSummary, toast])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'
      if (isSave) {
        e.preventDefault()
        if (!saving) void handleSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave, saving])

  const isAllEmpty = !diag?.trim() && !plan?.trim() && !advice?.trim()

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor="diag">
          การวินิจฉัย
        </label>
        <Textarea
          id="diag"
          rows={4}
          value={diag}
          onChange={e => setDiag(e.target.value)}
          placeholder="เช่น J02.9 Acute pharyngitis"
          disabled={!editing}
        />

        <label className="text-sm font-medium" htmlFor="plan">
          แผนการรักษา
        </label>
        <Textarea
          id="plan"
          rows={4}
          value={plan}
          onChange={e => setPlan(e.target.value)}
          placeholder="คำสั่งตรวจ, เวชปฏิบัติ, ติดตามอาการ"
          disabled={!editing}
        />

        <label className="text-sm font-medium" htmlFor="advice">
          คำแนะนำผู้ป่วย
        </label>
        <Textarea
          id="advice"
          rows={3}
          value={advice}
          onChange={e => setAdvice(e.target.value)}
          placeholder="เช่น ดื่มน้ำมากๆ พักผ่อน"
          disabled={!editing}
        />
      </div>

      <div className="space-y-3">
        <Card className="bg-slate-50">
          <CardContent>
            <div className="text-sm text-gray-600">สรุปฉบับผู้ป่วย</div>
            <div className="mt-2 p-3 bg-white rounded-xl border text-sm whitespace-pre-wrap">
              {patientSummary}
            </div>

            <div className="mt-3 flex gap-2">
              {!editing ? (
                <Button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="px-3 py-1 rounded bg-gray-100 border"
                >
                  แก้ไข
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={() => {
                      handleSave()
                      setEditing(false)
                    }}
                    disabled={saving}
                    className="px-3 py-1 rounded bg-green-100 border"
                  >
                    {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-3 py-1 rounded bg-gray-100 border"
                  >
                    ยกเลิก
                  </Button>
                </>
              )}

              <Button
                type="button"
                onClick={handleCopy}
                disabled={copying || isAllEmpty}
                className="px-3 py-1 rounded bg-blue-100 border"
              >
                {copying ? 'กำลังคัดลอก…' : 'คัดลอกคำแนะนำ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
