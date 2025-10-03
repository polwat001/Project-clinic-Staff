# วิธีติดตั้งโปรแกรมที่จำเป็นสำหรับระบบ

1. ติดตั้ง Node.js (ถ้ายังไม่มี)
- ดาวน์โหลดจาก https://nodejs.org/ และติดตั้ง

2. ติดตั้ง Next.js และแพ็กเกจที่จำเป็น (ในโฟลเดอร์โปรเจกต์)
```sh
npm install
```

3. หากยังไม่มี ให้ติดตั้ง Next.js CLI ทั่วไป (global)
```sh
npm install -g next
```

4. ติดตั้งแพ็กเกจอื่นๆ ที่อาจจำเป็น (ถ้ายังไม่มี)
```sh
npm install react react-dom @supabase/supabase-js
```

5. รันเซิร์ฟเวอร์สำหรับพัฒนา
```sh
npm run dev
```

**หมายเหตุ:**  
- หากใช้ `yarn` สามารถใช้ `yarn install` และ `yarn dev` แทนได้
- หากยังรัน `next` ไม่ได้ ให้ปิด/เปิด terminal ใหม่ หรือเพิ่ม Node.js ลงใน PATH
