'use client';

import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function BookingSuccess() {
  return (
    <main className="min-h-screen bg-[#e6f6ff] flex flex-col items-center justify-center px-4 py-10">
      {/* Heading */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#3b3b8f]">จองเรียบร้อย</h1>
        <CheckCircle className="w-24 h-24 md:w-32 md:h-32 text-green-500 mx-auto mt-6" />
      </section>

      {/* Info Box */}
      <section className="w-full max-w-2xl flex flex-col md:flex-row justify-center items-center gap-6 bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col items-center text-center">
          <p className="text-lg font-semibold text-[#3b3b8f] mb-2">สอบถามข้อมูลเพิ่มเติม</p>
          <p className="text-blue-600 text-lg font-bold">📞 +123-456-7890</p>
          <p className="text-gray-600">@REALLYGREATSITE</p>
        </div>
        <div className="w-full md:w-48">
          <Image
            src="/doctor.png" // เปลี่ยนเป็น /map.png ได้
            alt="Contact Map"
            width={200}
            height={200}
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      </section>
    </main>
  );
}
