import React, { useState } from 'react';
import { Facility, Booking, UserRole, House } from '../types';
import { Calendar, Info, Clock, Check, Plus, DollarSign, Users, Eye, Trash, HelpCircle, ShieldAlert } from 'lucide-react';

interface FacilityModuleProps {
  role: UserRole;
  facilities: Facility[];
  bookings: Booking[];
  houses: House[];
  onAddBooking: (booking: Booking) => void;
  onUpdateBookingStatus: (id: string, status: 'Disetujui' | 'Ditolak') => void;
}

export default function FacilityModule({
  role,
  facilities,
  bookings,
  houses,
  onAddBooking,
  onUpdateBookingStatus,
}: FacilityModuleProps) {
  const [showAddBooking, setShowAddBooking] = useState(false);

  // Form states
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [bookerName, setBookerName] = useState('Budi Santoso');
  const [houseId, setHouseId] = useState('A-01');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');

  const selectedFacility = facilities.find(f => f.id === selectedFacilityId);
  
  // Calculate duration & cost
  const getSimulatedTotalCost = () => {
    if (!selectedFacility) return 0;
    const startHour = parseInt(startTime.split(':')[0]) || 0;
    const endHour = parseInt(endTime.split(':')[0]) || 0;
    const hours = Math.max(1, endHour - startHour);
    return hours * selectedFacility.costPerHour;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityId || !bookingDate || !startTime || !endTime) return;

    const cost = getSimulatedTotalCost();

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      facilityId: selectedFacilityId,
      facilityName: selectedFacility?.name || 'Fasilitas Perumahan',
      bookerName,
      houseId,
      date: bookingDate,
      startTime,
      endTime,
      status: role === 'Super Admin' || role === 'RT/RW' ? 'Disetujui' : 'Pending',
      totalCost: cost
    };

    onAddBooking(newBooking);
    
    // Clear
    setSelectedFacilityId('');
    setBookingDate('');
    setShowAddBooking(false);

    alert(`Pemesanan Fasilitas BERHASIL diajukan! ${role === 'Warga' ? 'Menunggu persetujuan admin pengurus sebelum dikonfirmasi.' : 'Berhasil disetujui otomatis sebagai Admin.'}`);
  };

  // Filter booking list for the layout
  const visibleBookings = bookings.filter(b => {
    if (role === 'Warga') {
      return b.bookerName === 'Budi Santoso';
    }
    return true;
  });

  return (
    <div id="facility-module-container" className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Booking Fasilitas Umum Kompleks</h2>
          <p className="text-xs text-gray-500">Reservasi terpadu pemakaian gedung serbaguna, lapangan futsal/basket, serta clubhouse private warga</p>
        </div>

        <button 
          id="btn-open-booking"
          onClick={() => setShowAddBooking(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Ajukan Booking Baru
        </button>
      </div>

      {/* DETAILED FACILITY CATALOG SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilities.map(fac => (
          <div key={fac.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="relative h-40 bg-gray-50 shrink-0">
              <img referrerPolicy="no-referrer" src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover" />
              <span className="absolute right-3.5 top-3 bg-slate-900/80 text-white font-black text-[9px] px-2.5 py-1 rounded-full border border-white/10 uppercase">
                Rp {fac.costPerHour.toLocaleString('id-ID')} / Jam
              </span>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-gray-800 leading-tight">{fac.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1 lines-clamp-3 leading-relaxed font-medium">{fac.description}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Kapasitas: {fac.capacity} Orang</span>
                <button 
                  onClick={() => { setSelectedFacilityId(fac.id); setShowAddBooking(true); }}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-[10px] font-extrabold"
                >
                  Pilih & Booking
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RESERVATIONS STATUS LISTS AND CALENDAR BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Booking history and request review list */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800">Daftar Jadwal Reservasi Fasilitas</h4>
            <p className="text-xs text-gray-400">Pengecekan slot jam terisi agar tidak bentrok dengan rangkaian event warga lain</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-gray-700 border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[9px] font-bold tracking-wider">
                    <th className="p-3">Fasilitas Di-Booking</th>
                    <th className="p-3">Pemesan / Unit</th>
                    <th className="p-3">Tanggal & Waktu</th>
                    <th className="p-3">Total Biaya</th>
                    <th className="p-3 text-center">Status</th>
                    {(role === 'Super Admin' || role === 'RT/RW') && <th className="p-3 text-center">Aksi Pengurus</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {visibleBookings.map(book => (
                    <tr key={book.id} className="hover:bg-gray-50/20">
                      <td className="p-3">
                        <span className="font-bold text-gray-800">{book.facilityName}</span>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-gray-700">{book.bookerName}</p>
                        <p className="text-[10px] text-gray-400">{book.houseId}</p>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gray-650">
                        <p>{book.date}</p>
                        <p className="text-[10px] text-gray-400">{book.startTime} - {book.endTime}</p>
                      </td>
                      <td className="p-3 font-bold text-gray-800">
                        Rp {book.totalCost.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          book.status === 'Disetujui' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : book.status === 'Pending' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' 
                              : 'bg-rose-50 text-rose-705 border border-rose-100'
                        }`}>
                          {book.status === 'Disetujui' ? 'Diterima' : book.status === 'Pending' ? 'Menunggu Acc' : 'Ditolak'}
                        </span>
                      </td>
                      {(role === 'Super Admin' || role === 'RT/RW') && (
                        <td className="p-3">
                          {book.status === 'Pending' ? (
                            <div className="flex gap-1 justify-center">
                              <button 
                                onClick={() => onUpdateBookingStatus(book.id, 'Disetujui')}
                                className="px-1.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[9px] font-bold"
                              >
                                Acc
                              </button>
                              <button 
                                onClick={() => onUpdateBookingStatus(book.id, 'Ditolak')}
                                className="px-1.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[9px] font-bold"
                              >
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 block text-center">-</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Visual Simulated Facility Calendar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-155 shadow-sm space-y-3">
          <span className="text-xs font-black text-blue-700 uppercase tracking-widest block">Simulasi Kalender Mei 2026</span>
          
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] border-b pb-2">
            <span className="text-rose-500">S</span>
            <span>M</span>
            <span>S</span>
            <span>R</span>
            <span>K</span>
            <span>J</span>
            <span className="text-blue-500">S</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs text-gray-500">
            {/* Calendar pre-offset for May 2026 */}
            <span className="text-gray-300">26</span>
            <span className="text-gray-300">27</span>
            <span className="text-gray-300">28</span>
            <span className="text-gray-300">29</span>
            <span className="text-gray-300">30</span>
            <span className="text-gray-800 font-bold bg-gray-10s0 text-[11px]">1</span>
            <span className="text-gray-800 bg-gray-10s0 text-[11px]">2</span>
            
            {Array.from({ length: 18 }).map((_, idx) => (
              <span key={idx} className="p-1 select-none text-gray-700">{idx + 3}</span>
            ))}
            
            <span className="p-1 select-none text-white font-black bg-blue-600 rounded-md">21</span>
            <span className="p-1 select-none text-gray-700">22</span>
            <span className="p-1 select-none text-gray-700">23</span>
            <span className="p-1 select-none bg-emerald-500 text-white font-black rounded-md">24</span>
            <span className="p-1 select-none text-gray-700">25</span>
            <span className="p-1 select-none text-gray-700">26</span>
            <span className="p-1 select-none text-gray-700">27</span>
          </div>

          <div className="pt-2 text-[10px] space-y-1 text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-blue-600 block shrink-0"></span>
              <span>Hari Ini: Pemesanan Lapangan Futsal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 block shrink-0"></span>
              <span>Hari Utama: Pesta Balai Warga (Pak Agus Salim)</span>
            </div>
          </div>
        </div>

      </div>

      {/* --- RECONSTRUCT ADD BOOKING DIALOG FORM --- */}
      {showAddBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Ajukan Penggunaan Fasilitas</h3>
              <p className="text-xs text-gray-500">Gunakan kalender reservasi dengan memasukkan rincian jam pemakaian</p>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Pilih Fasilitas Umum *</label>
                <select
                  value={selectedFacilityId}
                  onChange={e => setSelectedFacilityId(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none text-gray-750" required
                >
                  <option value="">-- Pilih Fasilitas --</option>
                  {facilities.map(f => (
                    <option key={f.id} value={f.id}>{f.name} (Rp {f.costPerHour.toLocaleString('id-ID')}/jam)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nama Pemesan *</label>
                  <input 
                    type="text" 
                    value={bookerName}
                    onChange={e => setBookerName(e.target.value)}
                    className="w-full border p-2.5 rounded text-xs" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Unit Rumah *</label>
                  <select
                    value={houseId}
                    onChange={e => setHouseId(e.target.value)}
                    className="w-full border p-2.5 rounded text-xs text-gray-750" required
                  >
                    {houses.map(h => (
                      <option key={h.id} value={h.id}>{h.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Pilih Tanggal Acara *</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  className="w-full text-xs border p-2.5 rounded-lg text-gray-700 font-mono outline-none" required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Jam Mulai *</label>
                  <select 
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full border p-2 rounded text-xs text-gray-700"
                  >
                    <option value="08:00">08:00 WIB</option>
                    <option value="09:00">09:00 WIB</option>
                    <option value="10:00">10:00 WIB</option>
                    <option value="13:00">13:00 WIB</option>
                    <option value="15:00">15:00 WIB</option>
                    <option value="19:00">19:00 WIB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Jam Selesai *</label>
                  <select 
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full border p-2 rounded text-xs text-gray-700"
                  >
                    <option value="10:00">10:00 WIB</option>
                    <option value="12:00">12:00 WIB</option>
                    <option value="15:00">15:00 WIB</option>
                    <option value="17:00">17:00 WIB</option>
                    <option value="21:00">21:00 WIB</option>
                    <option value="22:00">22:00 WIB</option>
                  </select>
                </div>
              </div>

              {selectedFacility && (
                <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <span className="text-sky-700 font-bold block">Biaya Sewa Simulasi</span>
                    <p className="text-gray-400">Dihitung per jam penggunaan</p>
                  </div>
                  <strong className="text-sky-900 text-sm font-black">
                    Rp {getSimulatedTotalCost().toLocaleString('id-ID')}
                  </strong>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddBooking(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Ajukan Jadwal Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
