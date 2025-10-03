This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# วิธีติดตั้งโปรแกรมที่จำเป็นสำหรับระบบ

1. ติดตั้ง Node.js (ถ้ายังไม่มี)
   - ดาวน์โหลดจาก https://nodejs.org/ และติดตั้งให้เรียบร้อย

2. ติดตั้ง pnpm (แนะนำ) หรือ npm/yarn
   ```sh
   npm install -g pnpm
   ```

3. ติดตั้งแพ็กเกจที่จำเป็นในโปรเจกต์
   ```sh
   pnpm install
   # หรือถ้าใช้ npm
   npm install
   # หรือถ้าใช้ yarn
   yarn install
   ```

4. ติดตั้ง Next.js (ถ้ายังไม่มีใน package.json)
   ```sh
   pnpm add next react react-dom
   # หรือ
   npm install next react react-dom
   # หรือ
   yarn add next react react-dom
   ```

5. ติดตั้ง Supabase client (ถ้ายังไม่มีใน package.json)
   ```sh
   pnpm add @supabase/supabase-js
   # หรือ
   npm install @supabase/supabase-js
   # หรือ
   yarn add @supabase/supabase-js
   ```

6. ติดตั้งไลบรารีอื่นๆ ที่ใช้ในโปรเจกต์ (ถ้ายังไม่มี)
   ```sh
   pnpm add lucide-react
   # หรือ
   npm install lucide-react
   # หรือ
   yarn add lucide-react
   ```

7