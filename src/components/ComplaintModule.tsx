import React, { useState } from 'react';
import { Complaint, UserRole, House } from '../types';
import { ClipboardList, Plus, AlertTriangle, Check, Search, Star, MessageSquare, Users, ShieldAlert } from 'lucide-react';

interface ComplaintModuleProps {
  role: UserRole;
  complaints: Complaint[];
  houses: House[];
  onAddComplaint: (complaint: Complaint) => void;
  onAssignTechnician: (id: string, technicianName: string) => void;
  onUpdateProgress: (id: string, note: string, author: string, status?: 'Diproses' | 'Selesai') => void;
  onRateComplaint: (id: string, rating: number, comment: string) => void;
}

export default function ComplaintModule({
  role,
  complaints,
  houses,
  onAddComplaint,
  onAssignTechnician,
  onUpdateProgress,
  onRateComplaint,
}: ComplaintModuleProps) {
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  
  // Submit Complaint Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [reporterName, setReporterName] = useState('Budi Santoso');
  const [houseId, setHouseId] = useState('A-01');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Lampu Jalan' | 'Kebocoran' | 'Sampah' | 'Keamanan' | 'Fasilitas Umum' | 'Lainnya'>('Lampu Jalan');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Assign Technician State
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);
  const [techName, setTechName] = useState('');

  // Update Status Log State
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [logNote, setLogNote] = useState('');
  const [nextStatus, setNextStatus] = useState<'Diproses' | 'Selesai'>('Diproses');

  // Rating State
  const [ratingTicketId, setRatingTicketId] = useState<string | null>(null);
  const [selectedStars, setSelectedStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !houseId) return;

    const newTicket: Complaint = {
      id: `comp-${Date.now()}`,
      reporterName,
      houseId,
      title,
      category,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'Baru',
      imageUrl: imageUrl || undefined,
      progressUpdates: [
        { date: new Date().toLocaleString(), note: 'Tiket berhasil dibuka oleh pelapor.', author: reporterName }
      ]
    };

    onAddComplaint(newTicket);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setShowAddForm(false);
    alert("Keluhan Anda BERHASIL didaftarkan! Teknis keamanan / sipil akan segera meninjau tiket ke lokasi.");
  };

  const handleTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningTicketId || !techName) return;

    onAssignTechnician(assigningTicketId, techName);
    onUpdateProgress(assigningTicketId, `Ditugaskan ke teknisi khusus: ${techName}`, 'Admin', 'Diproses');
    
    setAssigningTicketId(null);
    setTechName('');
    alert("Berhasil mengassign teknisi!");
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingTicketId || !logNote) return;

    // Author of progress is current role/representative
    const updaterName = role === 'Teknisi' ? 'Teknisi Lapangan' : 'Admin';
    onUpdateProgress(updatingTicketId, logNote, updaterName, nextStatus);

    setUpdatingTicketId(null);
    setLogNote('');
    alert("Log rincian progres perbaikan sukses ditambahkan!");
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingTicketId) return;

    onRateComplaint(ratingTicketId, selectedStars, reviewComment);
    setRatingTicketId(null);
    setSelectedStars(5);
    setReviewComment('');
    alert("Terima kasih atas penilaian & masukan berharga Anda!");
  };

  // Filter complaints list
  const filteredComplaints = complaints.filter(comp => {
    const matchCat = filterCategory === 'Semua' || comp.category === filterCategory;
    const matchStat = filterStatus === 'Semua' || comp.status === filterStatus;
    
    // Non-staff can only see complaints they filed!
    // To make demo easy, let's filter: Budi Santoso or Siti Aminah or Rian Hidayat see theirs.
    // If Guest, see all (just for demo)
    if (role === 'Warga') {
      return matchCat && matchStat && (comp.reporterName === 'Budi Santoso' || comp.reporterName === 'Ahmad Faisal');
    }
    return matchCat && matchStat;
  });

  return (
    <div id="complaint-module-container" className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Sistem Laporan & Maintenance Tiket</h2>
          <p className="text-xs text-gray-500">Aduan fasilitas jalan berlubang, lampu penerangan padam, pipa bocor, atau kelalaian sampah</p>
        </div>

        {(role === 'Warga' || role === 'Super Admin') && (
          <button 
            id="btn-open-complaint"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Buat Laporan / Komplain Baru
          </button>
        )}
      </div>

      {/* FILTER BUTTONS */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-1.5 min-w-[140px]">
          <span className="text-xs text-gray-500 font-bold">Kategori:</span>
          <select 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 outline-none text-gray-700 font-medium"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Lampu Jalan">Lampu Jalan</option>
            <option value="Kebocoran">Pipa & Kebocoran</option>
            <option value="Sampah">Sampah & Kebersihan</option>
            <option value="Keamanan">Isu Keamanan</option>
            <option value="Fasilitas Umum">Fasilitas Umum</option>
            <option value="Lainnya">Lain-lain</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 min-w-[145px]">
          <span className="text-xs text-gray-500 font-bold">Status:</span>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 outline-none text-gray-700 font-medium"
          >
            <option value="Semua">Semua Status</option>
            <option value="Baru">Baru Masuk</option>
            <option value="Diproses">Sedang Dikerjakan</option>
            <option value="Selesai">Selesai Diperbaiki</option>
          </select>
        </div>

        {role === 'Warga' && (
          <div className="bg-rose-50 border border-rose-100 p-2 text-xs ml-auto text-rose-700 rounded-lg">
            🔍 Menampilkan keluhan terkirim khusus dari rumah Anda (A-01)
          </div>
        )}
      </div>

      {/* COMPLAINTS MASTER CARDS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredComplaints.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400">
            Tidak ada tiket komplain aktif yang dilaporkan di area peninjauan ini.
          </div>
        ) : (
          filteredComplaints.map(comp => (
            <div key={comp.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-rose-500 font-extrabold">
                      TID-{comp.id} | {comp.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-gray-800 leading-tight">{comp.title}</h4>
                  </div>
                  
                  <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold border ${
                    comp.status === 'Baru' 
                      ? 'bg-rose-50 border-rose-100 text-rose-700 animate-pulse' 
                      : comp.status === 'Diproses' 
                        ? 'bg-amber-50 border-amber-100 text-amber-700 animate-pulse' 
                        : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  }`}>
                    {comp.status === 'Baru' ? 'Baru Terdaftar' : comp.status === 'Diproses' ? 'Dalam Pengerjaan' : 'Perbaikan Selesai'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <span>Oleh: <strong className="font-bold text-gray-700">{comp.reporterName} ({comp.houseId})</strong></span>
                  <span>•</span>
                  <span>Tanggal: {comp.date}</span>
                </div>

                <p className="text-xs text-gray-650 leading-relaxed font-medium bg-gray-50/50 p-3 rounded-lg border border-gray-100">{comp.description}</p>

                {comp.imageUrl && (
                  <div className="relative h-28 w-full rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    <img referrerPolicy="no-referrer" src={comp.imageUrl} alt="Bukti aduan warga" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Log of Updates */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Update Progres Lapangan</span>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-[11px] space-y-1.5 font-medium divide-y divide-gray-150">
                    {comp.progressUpdates.map((up, idx) => (
                      <div key={idx} className="pt-1 first:pt-0">
                        <span className="text-[10px] text-gray-400 font-mono italic block">{up.date} - Update {up.author}</span>
                        <p className="text-gray-700 mt-0.5">{up.note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {comp.assignedTechnician && (
                  <div className="pt-1.5">
                    <span className="text-[11px] text-gray-500 font-semibold block">
                      Petugas Ditugaskan: <strong className="text-blue-700 font-bold">{comp.assignedTechnician}</strong>
                    </span>
                  </div>
                )}

                {/* Star rating if exists */}
                {comp.rating && (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg space-y-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      <span className="text-xs font-extrabold text-emerald-800">Penilaian Warga: {comp.rating} / 5</span>
                    </div>
                    {comp.reviewComment && (
                      <p className="text-[11px] font-medium text-emerald-700 italic">"{comp.reviewComment}"</p>
                    )}
                  </div>
                )}
              </div>

              {/* ACTION COMMAND CONTROLS FOR ADMIN OR TECHNICIAN */}
              <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2 justify-end">
                {comp.status === 'Baru' && (role === 'Super Admin' || role === 'RT/RW') && (
                  <button 
                    onClick={() => { setAssigningTicketId(comp.id); }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Tugaskan Teknisi
                  </button>
                )}

                {comp.status === 'Diproses' && (role === 'Teknisi' || role === 'Super Admin' || role === 'RT/RW') && (
                  <button 
                    onClick={() => { setUpdatingTicketId(comp.id); setNextStatus('Selesai'); }}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Update Progres / Selesaikan
                  </button>
                )}

                {comp.status === 'Selesai' && !comp.rating && (role === 'Warga' || role === 'Super Admin') && (
                  <button 
                    onClick={() => { setRatingTicketId(comp.id); setSelectedStars(5); }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Beri Ulasan Perbaikan
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RENDER ASSIGN TECHNICIAN POPUP */}
      {assigningTicketId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-150">
              <h4 className="font-bold text-gray-800">Tugaskan Seksi Perbaikan / Teknisi</h4>
              <p className="text-xs text-gray-500">Pilih petugas khusus untuk membenahi keluhan warga berikut</p>
            </div>

            <form onSubmit={handleTechSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Petugas / Teknisi</label>
                <select 
                  value={techName}
                  onChange={e => setTechName(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none font-semibold text-gray-700"
                  required
                >
                  <option value="">-- Pilih Teknisi Kawasan --</option>
                  <option value="Darno (Kelistrikan Kawasan)">Pak Darno (Seksi Listrik)</option>
                  <option value="Wawan (Seksi Air & Pipa)">Wawan (Seksi Pipa & Saluran Air)</option>
                  <option value="Soleh (Keamanan & Ronda)">Pak Soleh (Logistik Keamanan)</option>
                  <option value="Saman (Tim Kebersihan)">Saman (Tim Kebersihan Umum)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setAssigningTicketId(null)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
                >
                  Tugaskan & Kirim WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER UPDATE STATUS PROGRESS POPUP */}
      {updatingTicketId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-150">
              <h4 className="font-bold text-gray-800">Update Progres Penyelesaian</h4>
              <p className="text-xs text-gray-500">Tambahkan catatan progres perbaikan fisik di lapangan</p>
            </div>

            <form onSubmit={handleProgressSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Catatan Log Perbaikan *</label>
                <textarea 
                  placeholder="Contoh: Lampu LED 20 watt sudah diganti di tiang lampu nomor 14, sekarang menyala terang kembali..."
                  value={logNote}
                  onChange={e => setLogNote(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 h-24 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Tandai Progres / Status Akhir</label>
                <select 
                  value={nextStatus}
                  onChange={e => setNextStatus(e.target.value as any)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none font-semibold text-gray-700"
                >
                  <option value="Diproses">Masih Diperbaiki (Belum Selesai)</option>
                  <option value="Selesai">Tuntas / Selesai (Tutup Tiket)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setUpdatingTicketId(null)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Submit Log Progres
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINTS RATING FEEDBACK POPUP */}
      {ratingTicketId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h4 className="font-bold text-gray-800">Ulasan & Rating Hasil Perbaikan</h4>
              <p className="text-xs text-gray-500">Berikan feedback tulus atas pengerjaan tim teknologis kawasan</p>
            </div>

            <form onSubmit={handleRatingSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-600">Nilai Bintang Layanan *</label>
                <div className="flex gap-2.5 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => setSelectedStars(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star className={`w-7 h-7 ${star <= selectedStars ? 'text-amber-500 fill-amber-500' : 'text-gray-250'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Komentar / Masukan Anda *</label>
                <textarea 
                  placeholder="Contoh: Sangat responsif, pengerjaan rapi dan cepat, terima kasih!"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 h-20 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setRatingTicketId(null)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Kirim Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COMPLAINT MODAL FORM */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Laporkan Keluhan Kawasan</h3>
              <p className="text-xs text-gray-500">Mohon lengkapi formulir aduan fisik agar segera dijadwalkan perbaikan</p>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nama Pelapor *</label>
                  <input 
                    type="text" 
                    value={reporterName}
                    onChange={e => setReporterName(e.target.value)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">No Unit Rumah *</label>
                  <select
                    value={houseId}
                    onChange={e => setHouseId(e.target.value)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none text-gray-750" required
                  >
                    {houses.map(h => (
                      <option key={h.id} value={h.id}>{h.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Kategori Masalah *</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none font-semibold text-gray-700"
                >
                  <option value="Lampu Jalan">Lampu Jalan (Penerangan Padam)</option>
                  <option value="Kebocoran">Saluran Pipa Air PAM Bocor / Rembes</option>
                  <option value="Sampah">Sampah Menumpuk / Bau Menyengat</option>
                  <option value="Keamanan">Kerawanan / Isu Keamanan Malam</option>
                  <option value="Fasilitas Umum">Kerusakan Taman / Balai Warga / Aspal rusak</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Judul Ringkas Aduan *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Lampu taman depan panggung mati" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Foto Bukti Kerusakan / Genangan (URL URL Opsional)</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/your-leakage-leak" 
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 font-sans">Kronologi Lengkap Kerusakan *</label>
                <textarea 
                  placeholder="Sebutkan detail lokasi spesifik, jam padam / kebocoran berlangsung, serta kerugian dialami agar tim teknis siap sedia..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 h-20 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Daftarkan Komplain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
