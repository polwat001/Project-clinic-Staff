import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const {
    hn, name, sys, dia, hr, rr, temp_c, spo2, weight_kg, height_cm, bmi, drinking, smoking,
  } = req.body;

  await pool.query(
    `INSERT INTO public.vitals 
      (hn, name, sys, dia, hr, rr, temp_c, spo2, weight_kg, height_cm, bmi, drinking, smoking)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
    [hn, name, sys, dia, hr, rr, temp_c, spo2, weight_kg, height_cm, bmi, drinking, smoking]
  );
  res.status(200).json({ ok: true });
}