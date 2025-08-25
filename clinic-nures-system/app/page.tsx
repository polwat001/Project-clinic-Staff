"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
	const [stats, setStats] = useState({
		todayPatients: 0,
		waitingQueue: 0,
		urgentCases: 0,
	});

	useEffect(() => {
		async function fetchStats() {
			const today = new Date().toISOString().slice(0, 10);
			const { data: patients } = await supabase
				.from("patients")
				.select("id")
				.gte("created_at", today);
			const { data: queue } = await supabase
				.from("queues")
				.select("id")
				.eq("status", "ARRIVED");
			const { data: urgent } = await supabase
				.from("queues")
				.select("id")
				.eq("priority", 1);
			setStats({
				todayPatients: patients?.length ?? 0,
				waitingQueue: queue?.length ?? 0,
				urgentCases: urgent?.length ?? 0,
			});
		}
		fetchStats();
	}, []);

	return (
		<div className="min-h-screen bg-white flex flex-col items-center py-16 font-sans">
			<div className="w-full max-w-5xl">
				<div className="flex justify-between items-center mb-10">
					<h1 className="text-4xl font-bold text-black">
						ระบบคลินิกสำหรับพยาบาล
					</h1>
					<span className="text-[#B4AAAA] text-xl font-bold">
						{new Date().toLocaleString("th-TH")}
					</span>
				</div>
				{/* Dashboard สรุปสถานะ */}
				<div className="grid grid-cols-3 gap-6 mb-12">
					<div className="rounded-[25px] bg-green-50 border-2 border-green-200 px-6 py-6 flex flex-col items-center">
						<div className="text-3xl font-bold text-green-700">
							{stats.todayPatients}
						</div>
						<div className="text-lg text-green-900 mt-2">
							ผู้ป่วยใหม่วันนี้
						</div>
					</div>
					<div className="rounded-[25px] bg-blue-50 border-2 border-blue-200 px-6 py-6 flex flex-col items-center">
						<div className="text-3xl font-bold text-blue-700">
							{stats.waitingQueue}
						</div>
						<div className="text-lg text-blue-900 mt-2">ผู้ป่วยรอคิว</div>
					</div>
					<div className="rounded-[25px] bg-red-50 border-2 border-red-200 px-6 py-6 flex flex-col items-center">
						<div className="text-3xl font-bold text-red-700">
							{stats.urgentCases}
						</div>
						<div className="text-lg text-red-900 mt-2">เคสเร่งด่วน</div>
					</div>
				</div>
				{/* เมนูหลัก */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Link
						href="/register"
						className="rounded-[25px] border-2 bg-green-50 hover:bg-green-100 border-green-200 px-8 py-8 text-2xl font-semibold text-center shadow flex flex-col items-center transition"
					>
						ลงทะเบียนผู้ป่วยใหม่
						<span className="text-base text-[#888] mt-2 font-normal">
							สำหรับกรอกข้อมูลผู้ป่วยใหม่เข้าสู่ระบบ
						</span>
					</Link>
					<Link
						href="/search"
						className="rounded-[25px] border-2 bg-blue-50 hover:bg-blue-100 border-blue-200 px-8 py-8 text-2xl font-semibold text-center shadow flex flex-col items-center transition"
					>
						ค้นหาผู้ป่วย/รับคิว
						<span className="text-base text-[#888] mt-2 font-normal">
							ค้นหาข้อมูลผู้ป่วยเดิมและรับคิว walk-in
						</span>
					</Link>
					<Link
						href="/triage"
						className="rounded-[25px] border-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 px-8 py-8 text-2xl font-semibold text-center shadow flex flex-col items-center transition"
					>
						ตรวจเบื้องต้น/ส่งต่อแพทย์
						<span className="text-base text-[#888] mt-2 font-normal">
							บันทึกอาการนำ สัญญาณชีพ และส่งต่อแพทย์
						</span>
					</Link>
					<Link
						href="/queue"
						className="rounded-[25px] border-2 bg-purple-50 hover:bg-purple-100 border-purple-200 px-8 py-8 text-2xl font-semibold text-center shadow flex flex-col items-center transition"
					>
						จัดการคิวผู้ป่วย
						<span className="text-base text-[#888] mt-2 font-normal">
							ดูและจัดการคิวผู้ป่วยที่รอรับบริการ
						</span>
					</Link>
					<Link
						href="/cases"
						className="rounded-[25px] border-2 bg-gray-50 hover:bg-gray-100 border-gray-200 px-8 py-8 text-2xl font-semibold text-center shadow flex flex-col items-center transition col-span-2"
					>
						ดูประวัติเคสย้อนหลัง
						<span className="text-base text-[#888] mt-2 font-normal">
							ตรวจสอบประวัติการรักษาและเคสย้อนหลัง
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
