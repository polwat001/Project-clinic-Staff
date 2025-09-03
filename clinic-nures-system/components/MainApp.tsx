"use client";

import React, { useState } from "react";
import DoctorConsole from "./DoctorConsole";
import NurseConsole from "./NurseConsole";
import { supabase } from "../lib/supabaseClient";

// ฟอร์มลงทะเบียนเจ้าพนักงาน
function RegisterStaffForm({ onBack, onRegister }: { onBack: () => void; onRegister: (user: { username: string; password: string; role: string }) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("doctor");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    // ตรวจสอบว่ามี username ซ้ำหรือไม่
    const { data: exist } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .single();
    if (exist) {
      setError("ชื่อผู้ใช้นี้มีอยู่แล้ว");
      return;
    }
    const { error } = await supabase
      .from("users")
      .insert([{ username, password, role }]);
    if (error) {
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
    } else {
      setSuccess(true);
      setTimeout(() => {
        onRegister({ username, password, role });
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-screen h-screen flex flex-col justify-center items-center p-8 bg-white shadow-lg border border-blue-200">
        <div className="flex flex-col items-center mb-6">
          <img src="/globe.svg" alt="logo" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold text-blue-700 mb-2">ลงทะเบียนเจ้าพนักงาน</h2>
          <p className="text-gray-500 text-sm">กรุณากรอกข้อมูลเจ้าพนักงาน</p>
        </div>
        <input
          className="mb-3 w-80 border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="mb-3 w-80 border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select
          className="mb-3 w-80 border border-blue-300 px-3 py-2 rounded text-black"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="doctor">หมอ</option>
          <option value="nurse">พยาบาล</option>
        </select>
        <button
          className="w-80 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition mb-2"
          onClick={handleRegister}
        >
          ลงทะเบียน
        </button>
        <button
          className="w-80 bg-gray-300 hover:bg-gray-400 text-black py-2 rounded font-semibold transition"
          onClick={onBack}
        >
          กลับสู่หน้าเข้าสู่ระบบ
        </button>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mt-4 text-center">ลงทะเบียนสำเร็จ!</div>}
      </div>
    </div>
  );
}

// ฟอร์มเข้าสู่ระบบและกำหนด role
function LoginForm({ setUser, onRegisterStaff }: { setUser: (u: { username: string; role: string }) => void; onRegisterStaff: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { data, error: loginError } = await supabase
      .from("users")
      .select("username, role, password")
      .eq("username", username)
      .single();

    if (data && data.password === password) {
      setUser({ username: data.username, role: data.role });
    } else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-screen h-screen flex flex-col justify-center items-center p-8 bg-white shadow-lg border border-blue-200">
        <div className="flex flex-col items-center mb-6">
          <img src="/globe.svg" alt="logo" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold text-blue-700 mb-2">เข้าสู่ระบบคลินิก</h2>
          <p className="text-gray-500 text-sm">กรุณากรอกชื่อผู้ใช้และรหัสผ่าน</p>
        </div>
        <input
          className="mb-3 w-80 border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="ชื่อผู้ใช้"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="mb-3 w-80 border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-80 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
          onClick={handleLogin}
        >
          เข้าสู่ระบบ
        </button>
        <button
          className="w-80 bg-green-500 hover:bg-green-600 text-white py-2 rounded font-semibold transition mt-2"
          onClick={onRegisterStaff}
        >
          ลงทะเบียนเจ้าพนักงาน
        </button>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      </div>
    </div>
  );
}

// Entry point ของระบบ
export default function MainApp() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterStaff = () => {
    setShowRegister(false);
  };

  if (showRegister) {
    return (
      <RegisterStaffForm
        onBack={() => setShowRegister(false)}
        onRegister={handleRegisterStaff}
      />
    );
  }

  if (!user) {
    return (
      <LoginForm
        setUser={setUser}
        onRegisterStaff={() => setShowRegister(true)}
      />
    );
  }

  if (user.role === "doctor") {
    return <DoctorConsole />;
  }

  if (user.role === "nurse") {
    return <NurseConsole />;
  }

  return <div className="text-center mt-20 text-red-600">ไม่สามารถเข้าสู่ระบบได้</div>;
}