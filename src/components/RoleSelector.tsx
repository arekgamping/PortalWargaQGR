import React from 'react';
import { UserRole } from '../types';
import { User, Shield, Key, Eye, HelpCircle, HardHat, Store, Settings } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const rolesList: { role: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { role: 'Super Admin', label: 'Super Admin', icon: <Settings className="w-4 h-4" />, color: 'bg-rose-500 text-white border-rose-600', desc: 'Akses penuh seluruh fitur admin, approve iuran, review produk, assign teknisi, ubah denah, dsb.' },
    { role: 'RT/RW', label: 'Pengurus RT/RW', icon: <Shield className="w-4 h-4" />, color: 'bg-indigo-505 bg-indigo-600 text-white border-indigo-700', desc: 'Atur database KK warga, buat tagihan iuran massal bulanan, rilis pengumuman RW.' },
    { role: 'Security', label: 'Pos Security', icon: <Shield className="w-4 h-4 text-emerald-300" />, color: 'bg-slate-900 text-emerald-400 border-emerald-900', desc: 'Simulasi scan QR tamu, validasi plat kendaraan gerbang, monitor CCTV, live alarm panic.' },
    { role: 'Teknisi', label: 'Teknisi Kawasan', icon: <HardHat className="w-4 h-4" />, color: 'bg-amber-500 text-stone-900 border-amber-600', desc: 'Konfirmasi pengerjaan fisik komplain warga (lampu jalan, pipa bocor), submit log kemajuan.' },
    { role: 'Warga', label: 'Warga (Budi)', icon: <User className="w-4 h-4" />, color: 'bg-blue-600 text-white border-blue-700', desc: 'Akses warga: urus tamu, bayar iuran (simulasi QRIS/VA), belanja UMKM tetangga, buat tiket aduan.' },
    { role: 'UMKM', label: 'UMKM Seller', icon: <Store className="w-4 h-4" />, color: 'bg-teal-600 text-white border-teal-700', desc: 'Kelola jualan piringan nasi kebuli / kopi susu literan, unggah barang dagang baru, terima pesanan.' },
    { role: 'Guest', label: 'Warga Sekitar', icon: <Eye className="w-4 h-4" />, color: 'bg-stone-500 text-white border-stone-600', desc: 'Akses publik luar perumahan: lihat papan pengumuman, periksa direktori tempat ibadah / klinik medis terdekat.' }
  ];

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <Key className="w-5 h-5 text-blue-600 shrink-0" />
          <h4 className="font-extrabold text-sm text-gray-800 tracking-tight">KONTROL PERSPEKTIF DEMO (SWITCH ROLE)</h4>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Aktif: <strong>{currentRole}</strong>
        </span>
      </div>
      
      <p className="text-xs text-gray-550 leading-relaxed font-semibold">
        Sistem perumahan SmartLiving merujuk pada hak akses role-based (RBAC). Klik salah satu tombol role di bawah ini untuk mensimulasikan alur kerja spesifik dari sudut pandang peran tersebut:
      </p>

      {/* Grid of buttons and roles description */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1.5">
        {rolesList.map(item => {
          const isActive = currentRole === item.role;
          return (
            <button
              id={`role-btn-${item.role.replace(/\s+/g, '-').toLowerCase()}`}
              key={item.role}
              onClick={() => onRoleChange(item.role)}
              title={item.desc}
              className={`flex items-center justify-center gap-1.5 p-2 text-[11px] font-extrabold border rounded-xl transition-all duration-150 ${
                isActive 
                  ? `${item.color} ring-2 ring-offset-2 ring-indigo-500 shadow-md transform scale-[1.03]` 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="bg-indigo-50/50 p-2.5 rounded-xl text-[11px] border border-indigo-100 text-indigo-800 font-medium">
        💡 <strong>Hak Akses Saat Ini ({currentRole}):</strong> {rolesList.find(r => r.role === currentRole)?.desc}
      </div>
    </div>
  );
}
