import React, { useState } from 'react';
import { House, Payment, Complaint, Visitor, EmergencyNotice, UserRole } from '../types';
import { Home, Users, DollarSign, Shield, ClipboardList, PenTool as Tool, Sparkles, MessageSquare, Plus, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface DashboardKawasanProps {
  role: UserRole;
  houses: House[];
  residentsCount: number;
  payments: Payment[];
  complaints: Complaint[];
  visitors: Visitor[];
  emergencyNotices: EmergencyNotice[];
  onAddNotice: (notice: EmergencyNotice) => void;
  onUpdateHouseStatus: (houseId: string, status: 'Terisi' | 'Kosong' | 'Renovasi') => void;
}

export default function DashboardKawasan({
  role,
  houses,
  residentsCount,
  payments,
  complaints,
  visitors,
  emergencyNotices,
  onAddNotice,
  onUpdateHouseStatus,
}: DashboardKawasanProps) {
  const [selectedBlock, setSelectedBlock] = useState<string>('Semua');
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeType, setNewNoticeType] = useState<'Bahaya' | 'Informasi' | 'Pekerjaan'>('Informasi');

  // Stats Calculations
  const totalHouses = houses.length;
  const occupiedHouses = houses.filter(h => h.status === 'Terisi').length;
  const emptyHouses = houses.filter(h => h.status === 'Kosong').length;
  const renovationHouses = houses.filter(h => h.status === 'Renovasi').length;

  const totalIuranAmount = payments.reduce((sum, p) => p.status === 'Lunas' ? sum + p.amount : sum, 0);
  const totalUnpaidAmount = payments.reduce((sum, p) => p.status === 'Belum Bayar' ? sum + p.amount : sum, 0);
  
  const pendingComplaints = complaints.filter(c => c.status !== 'Selesai').length;
  const completedComplaints = complaints.filter(c => c.status === 'Selesai').length;
  
  const activeVisitors = visitors.filter(v => v.status === 'Checked In').length;

  // Filtered Houses
  const filteredHouses = houses.filter(h => selectedBlock === 'Semua' || h.block === selectedBlock);

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;
    
    onAddNotice({
      id: `em-${Date.now()}`,
      title: newNoticeTitle,
      content: newNoticeContent,
      type: newNoticeType,
      date: new Date().toISOString().split('T')[0]
    });

    setNewNoticeTitle('');
    setNewNoticeContent('');
    setShowAddNotice(false);
  };

  return (
    <div id="dashboard-kawasan-container" className="space-y-6">
      
      {/* Welcome banner depending on role */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-6">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="bg-blue-500/30 text-xs px-3 py-1 rounded-full w-fit mb-3 font-mono tracking-wider uppercase border border-white/20">
            {role === 'Guest' ? 'Akses Publik' : `Dashboard ${role}`}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">SmartLiving Residence</h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base leading-relaxed">
            Selamat datang di sistem manajemen digital terintegrasi perumahan modern. Di sini Anda dapat memantau keamanan, iuran warganet, mengurus tamu, membuat laporan fasilitas, serta berinteraksi via forum UMKM.
          </p>
        </div>
      </div>

      {/* EMERGENCY AND RECENT NOTICES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-gray-800">Pengumuman & Info Darurat Redaksi</h2>
            </div>
            {(role === 'Super Admin' || role === 'RT/RW') && (
              <button 
                id="btn-add-notice"
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Pengumuman
              </button>
            )}
          </div>

          {showAddNotice && (
            <form onSubmit={handleAddNoticeSubmit} className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Judul Info</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Fogging Demam Berdarah" 
                    value={newNoticeTitle}
                    onChange={e => setNewNoticeTitle(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Jenis Kategori</label>
                  <select 
                    value={newNoticeType}
                    onChange={e => setNewNoticeType(e.target.value as any)}
                    className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="Informasi">Informasi (Biru)</option>
                    <option value="Pekerjaan">Pekerjaan/Fisik (Kuning)</option>
                    <option value="Bahaya">Bahaya/Urgent (Merah)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Isi Pengumuman</label>
                <textarea 
                  placeholder="Detail lokasi, waktu kejadian, dan arahan bagi warga..."
                  value={newNoticeContent}
                  onChange={e => setNewNoticeContent(e.target.value)}
                  className="w-full text-xs bg-white border border-gray-300 rounded-lg p-2 h-20 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAddNotice(false)}
                  className="px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg active:scale-95"
                >
                  Terbitkan
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {emergencyNotices.map(notice => (
              <div 
                key={notice.id} 
                className={`p-4 rounded-xl border flex gap-3 transition-all ${
                  notice.type === 'Bahaya' 
                    ? 'bg-rose-50 border-rose-100 text-rose-900 shadow-sm shadow-rose-100' 
                    : notice.type === 'Pekerjaan' 
                      ? 'bg-amber-50 border-amber-100 text-amber-900' 
                      : 'bg-indigo-50/50 border-indigo-100 text-indigo-900'
                }`}
              >
                <div className="mt-0.5">
                  {notice.type === 'Bahaya' ? (
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  ) : notice.type === 'Pekerjaan' ? (
                    <Tool className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm tracking-tight">{notice.title}</h4>
                    <span className="text-[10px] bg-white/60 font-mono px-2 py-0.5 rounded border border-gray-200/50">
                      {notice.date}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed font-sans">{notice.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATS COUNT GRID SIDE */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Data Warga Terdata</p>
              <h3 className="text-2xl font-black text-gray-800">{residentsCount} <span className="text-sm font-normal text-gray-500">Jiwa</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Komplain Menunggu</p>
              <h3 className="text-2xl font-black text-gray-800">{pendingComplaints} <span className="text-sm font-normal text-gray-500">Tiket</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Tamu Sedang Berkunjung</p>
              <h3 className="text-2xl font-black text-gray-800">{activeVisitors} <span className="text-sm font-normal text-gray-500">Orang</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED STATISTICS BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupied house */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium block">Rumah Terisi</span>
            <span className="text-xl font-bold text-gray-800">{occupiedHouses} / {totalHouses}</span>
            <span className="text-[10px] text-teal-600 font-medium block">
              {Math.round((occupiedHouses / totalHouses) * 100)}% Rasio Kepadatan
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <Home className="w-5 h-5" />
          </div>
        </div>

        {/* Empty house */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium block">Rumah Kosong</span>
            <span className="text-xl font-bold text-gray-800">{emptyHouses}</span>
            <span className="text-[10px] text-gray-500 font-medium block">Tersedia untuk penghuni baru</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center">
            <Home className="w-5 h-5 opacity-60" />
          </div>
        </div>

        {/* Paid Iuran */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium block">Iuran Terbayar (Mei)</span>
            <span className="text-xl font-bold text-gray-800">Rp {totalIuranAmount.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Kas Aman Termonitor
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Unpaid Iuran */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium block">Tagihan Tertunggak</span>
            <span className="text-xl font-bold text-rose-600">Rp {totalUnpaidAmount.toLocaleString('id-ID')}</span>
            <span className="text-[10px] text-rose-500 font-medium block">Perlu reminder otomatis</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* INTERACTIVE HOUSE GRID SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">Visualisasi Denah & Status Kapling Rumah</h3>
            <p className="text-xs text-gray-400">Peta interaktif status kapling komplek perumahan SmartLiving Residence</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Semua', 'Blok A', 'Blok B', 'Blok C'].map(block => (
              <button
                key={block}
                onClick={() => setSelectedBlock(block)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                  selectedBlock === block 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {block}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 block"></span>
            <span className="text-gray-600 font-medium">Terisi ({occupiedHouses})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-gray-350 block"></span>
            <span className="text-gray-600 font-medium">Kosong ({emptyHouses})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 block"></span>
            <span className="text-gray-600 font-medium">Renovasi ({renovationHouses})</span>
          </div>
        </div>

        {/* Grid map of houses */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 pt-2">
          {filteredHouses.map(house => {
            let statusColorBg = 'bg-stone-100 border-stone-200 text-stone-700';
            let dotColor = 'bg-stone-400';
            if (house.status === 'Terisi') {
              statusColorBg = 'bg-emerald-50 border-emerald-100 text-emerald-800';
              dotColor = 'bg-emerald-500';
            } else if (house.status === 'Renovasi') {
              statusColorBg = 'bg-amber-50 border-amber-100 text-amber-800';
              dotColor = 'bg-amber-500';
            } else if (house.status === 'Kosong') {
              statusColorBg = 'bg-gray-100 border-gray-200 text-gray-500';
              dotColor = 'bg-gray-400';
            }

            return (
              <div 
                key={house.id} 
                className={`relative rounded-xl p-3 border ${statusColorBg} flex flex-col justify-between h-28 shadow-xs transition-transform transform hover:scale-[1.02]`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-lg text-gray-800 tracking-tight">{house.id}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] text-gray-400 font-mono tracking-tight font-medium truncate">
                    {house.type}
                  </p>
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {house.status === 'Terisi' ? house.ownerName : '(Belum terisi)'}
                  </p>
                </div>

                {/* If role is Admin, allow changing house status instantly on denah */}
                {(role === 'Super Admin' || role === 'RT/RW') && (
                  <div className="absolute inset-0 bg-white/95 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 border border-blue-200">
                    <span className="text-[10px] text-gray-500 font-bold mb-0.5">Edit Status {house.id}</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onUpdateHouseStatus(house.id, 'Terisi')}
                        className="px-1.5 py-1 text-[9px] bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700"
                      >
                        Terisi
                      </button>
                      <button 
                        onClick={() => onUpdateHouseStatus(house.id, 'Kosong')}
                        className="px-1.5 py-1 text-[9px] bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700"
                      >
                        Kosong
                      </button>
                      <button 
                        onClick={() => onUpdateHouseStatus(house.id, 'Renovasi')}
                        className="px-1.5 py-1 text-[9px] bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700"
                      >
                        Renov
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
