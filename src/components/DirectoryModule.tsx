import React, { useState } from 'react';
import { DirectoryItem } from '../types';
import { HelpCircle, Phone, Search, MapPin, ExternalLink, ShieldAlert, Sparkles, Heart } from 'lucide-react';

interface DirectoryModuleProps {
  directoryItems: DirectoryItem[];
}

export default function DirectoryModule({ directoryItems }: DirectoryModuleProps) {
  const [filterCat, setFilterCat] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = directoryItems.filter(item => {
    const matchesCat = filterCat === 'Semua' || item.category === filterCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="directory-module-container" className="space-y-6">
      
      {/* Banner design */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Direktori Sekitar Kawasan</h2>
          <p className="text-xs text-indigo-200 mt-1 lines-clamp-2 max-w-xl font-medium">
            Membangun hubungan sosial rukun dengan tetangga dan wilayah administrasi sekitar perumahan. Cari klinik terdekat, tempat ibadah, laundry, bengkel ruko depan, atau nomor darurat ambulans perumahan.
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-white/10 shrink-0 text-xs">
          🚨 Nomor Pos Satpam Utama: <strong className="font-mono text-amber-300">021-8872-4321</strong>
        </div>
      </div>

      {/* SEARCH AND DIRECTORY FILTER */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Cari binatu terdekat, klinik 24 jam, bengkel motor atau mushola..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-9 outline-none focus:border-indigo-500 font-medium"
          />
        </div>
        
        <div className="flex gap-2 min-w-[160px]">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-bold text-gray-700 outline-none"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Klinik">💊 Klinik & medis</option>
            <option value="Bengkel">⚙ Bengkel Motor/Mobil</option>
            <option value="Laundry">🧺 Cucian & Laundry</option>
            <option value="Tempat Ibadah">🕌 Masjid & Mushola</option>
            <option value="UMKM Sekitar">🏡 UMKM Eksternal</option>
          </select>
        </div>
      </div>

      {/* GRID LAYOUT FOR DIRECTORY ASSETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          let catBg = 'bg-stone-50 text-stone-700 border-stone-200';
          if (item.category === 'Klinik') catBg = 'bg-rose-50 text-rose-700 border-rose-100';
          if (item.category === 'Tempat Ibadah') catBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
          if (item.category === 'Laundry') catBg = 'bg-sky-50 text-sky-700 border-sky-100';

          return (
            <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-52 hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${catBg}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    📍 {item.distance}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-gray-800 leading-tight tracking-tight pt-1">
                  {item.name}
                </h4>

                <p className="text-[11px] text-gray-400 font-serif leading-normal line-clamp-2">
                  {item.address}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs">
                <span className="text-[10px] text-gray-500 font-bold">
                  Jam Buka: {item.hours}
                </span>

                {item.phone !== '-' ? (
                  <a 
                    href={`tel:${item.phone}`} 
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-extrabold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Hubungi
                  </a>
                ) : (
                  <span className="text-[10px] text-gray-400 italic">No phone info</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK EMERGENCY SERVICES NUMBERS */}
      <div className="bg-rose-50 border border-rose-150 rounded-2xl p-5 space-y-4">
        <div>
          <h4 className="font-extrabold text-rose-900 text-sm flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" /> Nomor Panggilan Hubungan Darurat Kawasan
          </h4>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">Segera hubungi tim siaga berikut bila terjadi kebakaran, gangguan rukun tetangga, perampokan atau medis.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white border border-rose-100 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold">POS SECURITY TIM A</span>
            <p className="font-mono text-xs font-black text-rose-700">0812-4321-9976</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold">DAMKAR KECAMATAN</span>
            <p className="font-mono text-xs font-black text-rose-700">021-8292881</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold">AMBULANCE MEDIS</span>
            <p className="font-mono text-xs font-black text-rose-700">021-118 / 119</p>
          </div>
          <div className="bg-white border border-rose-100 rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 font-bold">POLSEK SEKTOR BARAT</span>
            <p className="font-mono text-xs font-black text-rose-700">021-8872-9900</p>
          </div>
        </div>
      </div>

    </div>
  );
}
