'use client'
import * as React from 'react'
import { Button, Input, Textarea } from '@/components/doctor/ui-lite'
import type { RxItem } from '@/lib/types'

type CatalogItem = {
  drug_code: string
  name: string
  strength: string | null
  frequency: string | null
  period: string | null
  note: string | null
}

type VitalsRO = {
  taken_at: string
  bp_sys: number | null; bp_dia: number | null; pulse: number | null
  rr: number | null; temp_c: number | null; spo2: number | null
  height_cm: number | null; weight_kg: number | null; bmi: number | null
}

const PAGE_SIZE = 50

export default function PrescriptionTab({
  rxItems,
  addRx,
  removeRx,
  onSendRx,
  sending = false,
  /** ออปชัน: อัปเดตรายการยาเฉพาะฟิลด์ (ถ้าไม่ส่งมา จะ fallback เป็นลบแล้วเพิ่มใหม่) */
  updateRx,
  /** ออปชัน: ส่ง vitals ล่าสุดมาเพื่อโชว์ด้านบน */
  lastVitals,
}: {
  rxItems: RxItem[]
  addRx: (i: RxItem) => void
  removeRx: (code: string) => void
  onSendRx: (advice?: string | null) => void
  sending?: boolean
  updateRx?: (code: string, patch: Partial<RxItem>) => void
  lastVitals?: VitalsRO | null
}) {
  const [search, setSearch] = React.useState('')
  const [catalog, setCatalog] = React.useState<CatalogItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [offset, setOffset] = React.useState(0)
  const [hasMore, setHasMore] = React.useState(true)
  const [rxAdvice, setRxAdvice] = React.useState('')

  // โหลดหน้าแรก + รีเซ็ตเมื่อเปลี่ยนคำค้น
  React.useEffect(() => {
    setCatalog([])
    setOffset(0)
    setHasMore(true)
    setError(null)

    const t = setTimeout(() => {
      void loadPage(true)
    }, 200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // โหลดหน้า (append หรือ replace)
  const loadPage = React.useCallback(
    async (replace = false) => {
      if (loading || (!hasMore && !replace)) return
      try {
        setLoading(true)
        const url =
          `/api/meds?limit=${PAGE_SIZE}&offset=${replace ? 0 : offset}` +
          (search.trim() ? `&q=${encodeURIComponent(search.trim())}` : '')
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(await res.text())
        const { items, total, nextOffset } = (await res.json()) as {
          items: CatalogItem[]
          total: number
          nextOffset: number
        }
        setCatalog(prev => (replace ? items : [...prev, ...items]))
        setOffset(nextOffset ?? (replace ? items.length : offset + items.length))
        setHasMore((nextOffset ?? 0) < total)
      } catch (e) {
        console.error(e)
        setError('โหลดรายการยาไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    },
    [loading, hasMore, offset, search]
  )

  // Infinite scroll
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) void loadPage()
    }, { threshold: 1 })
    io.observe(el)
    return () => io.disconnect()
  }, [loadPage, catalog.length])

  const alreadyHas = React.useCallback(
    (code: string) => rxItems.some(i => i.drug_code === code),
    [rxItems]
  )

  const ensureQtyDefaults = (i: Partial<RxItem>): Partial<RxItem> => ({
    qty_per_dose: i.qty_per_dose ?? 1,
    doses_per_day: i.doses_per_day ?? 1,
    // แปลง "7 วัน" → 7 ถ้า period_days ยังไม่ถูกกำหนด
    period_days: i.period_days ?? (() => {
      const m = (i.period as string | undefined)?.match?.(/(\d+)/)
      return m ? Math.max(1, parseInt(m[1], 10)) : 1
    })(),
  })

  const handleAdd = React.useCallback(
    (m: CatalogItem) => {
      if (alreadyHas(m.drug_code)) {
        alert('มีรายการยานี้อยู่แล้ว')
        return
      }
      const item: RxItem = {
        drug_code: m.drug_code,
        name: m.name,
        strength: m.strength ?? undefined,
        frequency: m.frequency ?? undefined,
        period: m.period ?? undefined,
        note: m.note ?? undefined,
        ...ensureQtyDefaults({ period: m.period }),
      }
      addRx(item)
    },
    [addRx, alreadyHas]
  )

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && catalog.length === 1) {
      e.preventDefault()
      handleAdd(catalog[0])
    }
  }

  // อัปเดตรายการยา: ใช้ updateRx ถ้ามี, ไม่งั้น fallback เป็นลบแล้วเพิ่มใหม่ (รักษาค่า field เดิม)
  const applyPatch = React.useCallback((code: string, patch: Partial<RxItem>) => {
    if (updateRx) {
      updateRx(code, patch)
      return
    }
    const idx = rxItems.findIndex(x => x.drug_code === code)
    if (idx === -1) return
    const merged: RxItem = { ...rxItems[idx], ...patch }
    removeRx(code)
    // เว้นหนึ่ง tick เพื่อให้ state parent ทัน (ป้องกันชนกัน)
    setTimeout(() => addRx(merged), 0)
  }, [rxItems, updateRx, removeRx, addRx])

  const toPosInt = (v: any, def = 1) => {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : def
  }

  const calcTotalUnits = (i: RxItem) => {
    const q = toPosInt(i.qty_per_dose ?? 1)
    const d = toPosInt(i.doses_per_day ?? 1)
    const days = toPosInt(i.period_days ?? 1)
    return q * d * days
  }

  const renderVitals = (v?: VitalsRO | null) => {
    if (!v) return null
    return (
      <div className="text-xs text-slate-700 bg-slate-50 border rounded-xl p-2 mb-2">
        <div className="font-medium mb-1">สัญญาณชีพล่าสุด • {new Date(v.taken_at).toLocaleString()}</div>
        <div className="flex flex-wrap gap-2">
          <span>BP: {v.bp_sys ?? '—'}/{v.bp_dia ?? '—'} mmHg</span>
          <span>Pulse: {v.pulse ?? '—'} bpm</span>
          <span>Temp: {v.temp_c ?? '—'} °C</span>
          <span>RR: {v.rr ?? '—'} /min</span>
          <span>SpO₂: {v.spo2 ?? '—'} %</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* ซ้าย: รายการยา (ดึงทั้งหมด + ค้นหาได้) */}
      <div>
        <div className="font-medium mb-2">รายการยา</div>
        <Input
          placeholder="ค้นหา (ชื่อยา/รหัส)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={onSearchKeyDown}
          aria-label="ค้นหารายการยา"
        />

        <div className="mt-2 space-y-2 max-h-[40vh] overflow-auto">
          {catalog.map(m => (
            <div key={m.drug_code} className="p-3 border rounded-xl flex items-center justify-between bg-white">
              <div className="min-w-0">
                <div className="font-medium truncate" title={m.name}>
                  {m.name}{m.strength ? ` ${m.strength}` : ''}
                </div>
                <div className="text-xs text-slate-500">
                  {[m.frequency, m.note].filter(Boolean).join(' ')}
                  {m.period ? ` · ${m.period}` : ''}
                </div>
              </div>
              <Button onClick={() => handleAdd(m)} disabled={alreadyHas(m.drug_code) || sending}>
                {alreadyHas(m.drug_code) ? 'เพิ่มแล้ว' : 'เพิ่ม'}
              </Button>
            </div>
          ))}

          {/* สถานะโหลด/ผิดพลาด/หมดแล้ว */}
          {loading && <div className="text-sm text-gray-500">กำลังโหลด...</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {!loading && !error && catalog.length === 0 && (
            <div className="text-sm text-gray-500">
              {search ? 'ไม่พบรายการยาตามคำค้น' : 'ยังไม่มีข้อมูลยา'}
            </div>
          )}

          {/* sentinel สำหรับ infinite scroll */}
          <div ref={sentinelRef} />
          {!hasMore && catalog.length > 0 && (
            <div className="text-center text-xs text-gray-400">โหลดครบแล้ว</div>
          )}
        </div>
      </div>

      {/* ขวา: ใบสั่งยานี้ */}
      <div>
        <div className="font-medium mb-2">ใบสั่งยานี้</div>

        {/* vitals ล่าสุด (ออปชัน) */}
        {renderVitals(lastVitals)}

        <div className="space-y-2 min-h-[12rem]">
          {rxItems.length === 0 && <div className="text-sm text-gray-500">ยังไม่มีรายการยา</div>}
          {rxItems.map(i => (
            <div key={i.drug_code} className="p-3 border rounded-xl bg-white space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate" title={i.name}>
                    {i.name}{i.strength ? ` ${i.strength}` : ''}
                  </div>
                  <div className="text-xs text-slate-500">
                    {[i.frequency, i.note].filter(Boolean).join(' ')}
                    {i.period ? ` · ${i.period}` : ''}
                    {!("frequency" in i) && (i as any).sig
                      ? ` ${(i as any).sig}${(i as any).days ? ` · ${(i as any).days} days` : ''}`
                      : ''}
                  </div>
                </div>
                <button
                  onClick={() => removeRx(i.drug_code)}
                  className="text-xs text-red-600 hover:underline shrink-0"
                  disabled={sending}
                >
                  ลบ
                </button>
              </div>

              {/* 🔢 ฟอร์มจำนวนยา */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">จำนวนต่อครั้ง</label>
                  <Input
                    type="number" min={1}
                    value={i.qty_per_dose ?? 1}
                    onChange={e =>
                      applyPatch(i.drug_code, { qty_per_dose: Math.max(1, Number(e.target.value || 1)) })
                    }
                    placeholder="เช่น 1 (เม็ด/ช้อน/หลอด)"
                    disabled={sending}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">ครั้งต่อวัน</label>
                  <Input
                    type="number" min={1}
                    value={i.doses_per_day ?? 1}
                    onChange={e =>
                      applyPatch(i.drug_code, { doses_per_day: Math.max(1, Number(e.target.value || 1)) })
                    }
                    placeholder="เช่น 3"
                    disabled={sending}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">จำนวนวัน</label>
                  <Input
                    type="number" min={1}
                    value={i.period_days ?? (() => {
                      const m = i.period?.match?.(/(\d+)/)
                      return m ? Math.max(1, parseInt(m[1], 10)) : 1
                    })()}
                    onChange={e =>
                      applyPatch(i.drug_code, { period_days: Math.max(1, Number(e.target.value || 1)) })
                    }
                    placeholder="เช่น 7"
                    disabled={sending}
                  />
                </div>
              </div>

              <div className="text-xs text-slate-600">
                รวมที่ต้องจ่ายโดยประมาณ: <span className="font-medium">{calcTotalUnits(i)}</span> หน่วย
              </div>
            </div>
          ))}
        </div>

        {/* คำแนะนำหมอ */}
        <div className="mt-3">
          <div className="text-sm font-medium mb-1">คำแนะนำหมอ (จะแนบไปกับใบสั่งยา)</div>
          <Textarea
            rows={3}
            value={rxAdvice}
            onChange={e => setRxAdvice(e.target.value)}
            placeholder="ตัวอย่าง: ดื่มน้ำมากๆ พักผ่อน หลีกเลี่ยงของทอดเผ็ด หากมีไข้สูง/หอบ ให้กลับมาพบแพทย์ทันที"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => onSendRx(rxAdvice)} disabled={rxItems.length === 0 || sending}>
            {sending ? 'กำลังส่ง…' : 'ส่งใบสั่งยาให้พนักงาน'}
          </Button>
          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(JSON.stringify(rxItems, null, 2))
                alert('คัดลอก JSON แล้ว')
              } catch {
                alert('คัดลอกไม่สำเร็จ')
              }
            }}
            disabled={rxItems.length === 0 || sending}
          >
            คัดลอก JSON
          </Button>
          {rxItems.length > 0 && (
            <span className="text-xs text-gray-500 self-center">รวม {rxItems.length} รายการ</span>
          )}
        </div>
      </div>
    </div>
  )
}
