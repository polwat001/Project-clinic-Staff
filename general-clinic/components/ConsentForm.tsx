'use client';
import { useState } from 'react';

export default function ConsentForm({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState({
    collect: false,
    disclose: false,
    improve: false,
    all: false,
  });
  const [triedSubmit, setTriedSubmit] = useState(false);

  const handleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setChecked({
      collect: value,
      disclose: value,
      improve: value,
      all: value,
    });
  };

  const handleChange = (key: keyof typeof checked) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    const newChecked = { ...checked, [key]: value };
    newChecked.all = newChecked.collect && newChecked.disclose && newChecked.improve;
    setChecked(newChecked);
  };

  const canSubmit = checked.collect && checked.disclose && checked.improve;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (canSubmit) onAccept();
  };

  return (
    <form className="consent-form text-black" onSubmit={handleSubmit}>
      <div className="consent-icon" aria-hidden>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#b3e0ff"/><path d="M16 24l6 6 10-10" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h2 className="consent-title">ขอความยินยอมในการใช้ข้อมูลส่วนบุคคล</h2>
      <div className="consent-desc">
        <b>เรียน ท่านผู้รับบริการ</b><br/>
        เพื่อให้สอดคล้องกับพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ทางคลินิกมีความจำเป็นต้องขอความยินยอมจากท่านในการเก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน เพื่อวัตถุประสงค์ในการให้บริการทางการแพทย์ การวินิจฉัยโรค การติดตามการรักษา และการประสานงานกับหน่วยงานที่เกี่ยวข้อง โดยข้อมูลที่คลินิกจะดำเนินการ ได้แก่:
        <ul className="consent-list">
          <li>ชื่อ-นามสกุล</li>
          <li>เลขบัตรประจำตัวประชาชน</li>
          <li>ข้อมูลการติดต่อ (เบอร์โทร, ที่อยู่, อีเมล)</li>
          <li>ข้อมูลสุขภาพและประวัติการรักษา</li>
        </ul>
        <span className="consent-highlight">โปรดยืนยันความยินยอมของท่าน:</span>
      </div>
      <div className="consent-checkboxes">
        <label><input type="checkbox" checked={checked.collect} onChange={handleChange('collect')} /> ข้าพเจ้ายินยอมให้คลินิกเก็บและใช้ข้อมูลส่วนบุคคลตามวัตถุประสงค์ข้างต้น</label>
        <label><input type="checkbox" checked={checked.disclose} onChange={handleChange('disclose')} /> ข้าพเจ้ายินยอมให้คลินิกเปิดเผยข้อมูลให้บุคคลหรือหน่วยงานที่เกี่ยวข้อง เช่น โรงพยาบาล บริษัทประกัน ฯลฯ</label>
        <label><input type="checkbox" checked={checked.improve} onChange={handleChange('improve')} /> ข้าพเจ้ายินยอมให้คลินิกใช้ข้อมูลในการปรับปรุงคุณภาพบริการ (โดยไม่สามารถระบุตัวตนได้)</label>
        <label><input type="checkbox" checked={checked.all} onChange={handleAll} /> ยินยอมทั้งหมด</label>
      </div>
      {triedSubmit && !canSubmit && (
        <div className="consent-error">กรุณากดยอมรับทุกข้อก่อนดำเนินการต่อ</div>
      )}
      <button className="action-btn white consent-btn" type="submit" disabled={!canSubmit}>ยินยอม</button>
    </form>
  );
} 