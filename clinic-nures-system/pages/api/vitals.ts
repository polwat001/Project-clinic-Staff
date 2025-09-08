import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    hn,
    full_name,   // ✅ เปลี่ยนชื่อ
    sys, dia, hr, rr, temp_c, spo2,
    weight_kg, height_cm, bmi,
    drinking, smoking,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO public.vitals 
        (hn, full_name, sys, dia, hr, rr, temp_c, spo2, weight_kg, height_cm, bmi, drinking, smoking)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [hn ?? null, full_name ?? null, sys, dia, hr, rr, temp_c, spo2, weight_kg, height_cm, bmi, drinking, smoking]
    );

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("DB Insert error:", err);
    res.status(500).json({ error: err.message });
  }
}
