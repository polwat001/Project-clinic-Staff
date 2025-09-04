import Link from 'next/link';
import React from 'react';

export default function ActionButtons() {
  return (
    <div className="action-buttons-grid">
      <Link href="/booking"passHref legacyBehavior>
        <button className="action-btn blue">จองเวลานัด</button>
      </Link>
      <Link href="/check-appointment/consent"passHref legacyBehavior>
        <button className="action-btn green">เช็คเวลาหมอนัด</button>
      </Link>
      <Link href="/check-history/consent"passHref legacyBehavior>
        <button className="action-btn yellow">เช็คประวัติรักษา</button>
      </Link>
      <Link href="/check-booking/consent"passHref legacyBehavior>
        <button className="action-btn pink">เช็คเวลาที่จอง</button>
      </Link>
    </div>
  );
}
