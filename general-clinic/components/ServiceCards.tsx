import React from 'react';

const services = [
  { text: 'ตรวจ\nวินิจฉัยและ\nรักษาโรค\nทั่วไป' },
  { text: 'ให้คำปรึกษา\nทางการแพทย์\nเบื้องต้น' },
  { text: 'จ่ายยาและ\nแนะนำการใช้ยา\nอย่างเหมาะสม' },
];

export default function ServiceCards() {
  return (
    <section className="service-cards-container">
      {services.map((service, idx) => (
        <div className="service-bubble" key={idx}>
          {service.text.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      ))}
    </section>
  );
} 