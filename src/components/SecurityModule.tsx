import React, { useState } from 'react';
import { Visitor, House, UserRole, GateLog } from '../types';
import { Shield, Eye, Plus, Check, Search, Calendar, Phone, Car, Compass, AlertTriangle, Monitor, Cpu, Trash, Key, Activity } from 'lucide-react';

interface SecurityModuleProps {
  role: UserRole;
  visitors: Visitor[];
  houses: House[];
  gateLogs: GateLog[];
  onAddVisitor: (visitor: Visitor) => void;
  onUpdateVisitorStatus: (id: string, status: 'Checked In' | 'Checked Out') => void;
  onTriggerPanic: (alertMessage: string) => void;
  onAddGateLog: (log: GateLog) => void;
}

export default function SecurityModule({
  role,
  visitors,
  houses,
  gateLogs,
  onAddVisitor,
  onUpdateVisitorStatus,
  onTriggerPanic,
  onAddGateLog,
}: SecurityModuleProps) {
  const [showAddInvite, setShowAddInvite] = useState(false);
  const [showScanSimulator, setShowScanSimulator] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Forms
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [hostHouseId, setHostHouseId] = useState('');

  // Scan Code State
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<Visitor | null>(null);

  // Live Panic state
  const [panicLoading, setPanicLoading] = useState(false);

  const handlePanicTrigger = () => {
    setPanicLoading(true);
    setTimeout(() => {
      onTriggerPanic(`🚨 PANIC BUTTON AKTIF! Laporan darurat diaktifkan dari koordinat Pos Security Blok B.`);
      setPanicLoading(false);
      alert("Peringatan tombol darurat telah dikirim ke semua admin & gawai warga SmartLiving!");
    }, 1200);
  };

  const handleAddInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone || !vehiclePlate || !expectedDate || !hostHouseId) return;

    // Find host name
    const h = houses.find(hs => hs.id === hostHouseId);
    const hostName = h ? h.ownerName : 'Budi Santoso';

    const newVisitor: Visitor = {
      id: `vis-${Date.now()}`,
      hostHouseId,
      hostName,
      visitorName,
      phone: visitorPhone,
      vehiclePlate: vehiclePlate.toUpperCase(),
      purpose: purpose || 'Silaturahmi',
      expectedDate,
      qrCodeUrl: `SMARTLIVING_VIS_${Math.floor(100 + Math.random() * 900)}_PASS`,
      status: 'Approved'
    };

    onAddVisitor(newVisitor);
    
    // Clear
    setVisitorName('');
    setVisitorPhone('');
    setVehiclePlate('');
    setPurpose('');
    setExpectedDate('');
    setHostHouseId('');
    setShowAddInvite(false);

    alert(`Undangan Tamu Digital BERHASIL dibuat! Berikan Kode QR (${newVisitor.qrCodeUrl}) kepada tamu Anda.`);
  };

  // Scan simulator
  const handleTestScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode) return;

    const matchedVis = visitors.find(v => v.qrCodeUrl.toLowerCase() === scannedCode.trim().toLowerCase());
    if (matchedVis) {
      setScanResult(matchedVis);
    } else {
      setScanResult(null);
      alert("Maaf, Kode QR tamu tidak terdaftar di sistem perumahan SmartLiving!");
    }
  };

  const executeCheckIn = (v: Visitor) => {
    onUpdateVisitorStatus(v.id, 'Checked In');
    onAddGateLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'In',
      visitorName: v.visitorName,
      vehiclePlate: v.vehiclePlate,
      gateName: 'Pos Gerbang Barat'
    });
    setScanResult(null);
    setScannedCode('');
    setShowScanSimulator(false);
    alert(`Sukses! Tamu ${v.visitorName} diizinkan masuk dan tercatat di gerbang.`);
  };

  const executeCheckOut = (v: Visitor) => {
    onUpdateVisitorStatus(v.id, 'Checked Out');
    onAddGateLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      type: 'Out',
      visitorName: v.visitorName,
      vehiclePlate: v.vehiclePlate,
      gateName: 'Pos Gerbang Barat'
    });
    setScanResult(null);
    setScannedCode('');
    setShowScanSimulator(false);
    alert(`Sukses! Tamu ${v.visitorName} tercatat keluar dari wilayah kompleks.`);
  };

  // Filter visitor list
  const filteredVisitors = visitors.filter(vis => 
    vis.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vis.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vis.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vis.hostHouseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="security-module-container" className="space-y-6">
      
      {/* Top Banner & Security Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="bg-rose-600 text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded border border-rose-500 w-fit block font-bold">
              SECURITY MONITOR DECK
            </span>
            <h3 className="text-xl font-bold tracking-tight">Pusat Validasi Gerbang & Smart Gatekeeper</h3>
            <p className="text-xs text-slate-350 leading-relaxed">
              Konfigurasi pintu gerbang perumahan, pencatatan otomatis tamu yang diundang lewat kode QR, dan audit log pelat nopol kendaraan warga / tamu secara berkala.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-6">
            <button 
              id="btn-trigger-panic"
              onClick={handlePanicTrigger}
              disabled={panicLoading}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-950/50 active:scale-95 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              {panicLoading ? 'MENYIARKAN ALARM...' : 'TOMBOL DARURAT WIDGET (PANIC)'}
            </button>

            <button 
              id="btn-open-scanner"
              onClick={() => { setShowScanSimulator(!showScanSimulator); setScanResult(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-blue-950/20 active:scale-95 transition-all"
            >
              <Monitor className="w-4 h-4" />
              SIMULATOR SCAN QR CODE SECURITY
            </button>

            {(role === 'Warga' || role === 'Super Admin') && (
              <button 
                id="btn-open-invite"
                onClick={() => setShowAddInvite(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-medium border border-slate-600 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                Undang Tamu Baru (Pre-Approval)
              </button>
            )}
          </div>
        </div>

        {/* CCTV LIVE FEEDS SIMULATION */}
        <div className="bg-slate-950 text-emerald-400 rounded-2xl p-4 border border-slate-800 shadow-inner flex flex-col justify-between h-56 lg:h-auto">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px] font-mono font-bold tracking-tight">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" /> LIVE CAMERA FEED</span>
            <span>CAM_01_DEPAN</span>
          </div>
          
          <div className="relative bg-slate-900 border border-slate-800 rounded-lg flex-1 my-3 overflow-hidden flex items-center justify-center">
            {/* Visual simulation overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950 opacity-40"></div>
            <div className="absolute left-2 top-2 font-mono text-[9px] text-gray-400 space-y-0.5">
              <p>REC 2026-05-20</p>
              <p>11:43:33 UTC</p>
            </div>
            
            <div className="absolute right-2 bottom-2 bg-red-650 px-1 py-0.5 rounded text-[8px] text-white font-mono uppercase animate-pulse">
              LIVE GATE
            </div>

            {/* Simulated green guides */}
            <div className="border border-emerald-500/30 w-12 h-12 absolute left-1/3 top-1/3"></div>
            <div className="border border-emerald-500/30 w-12 h-12 absolute right-1/4 bottom-1/3"></div>

            <p className="text-[10px] font-mono text-emerald-500 select-none text-center px-4">
              [Simulasi AI Kamera: Mendeteksi Plat B 1234 SNT - Gerbang Lancar]
            </p>
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>FPS: 30.0</span>
            <span>Kualitas: 1080P</span>
          </div>
        </div>
      </div>

      {/* SCAN QR SIMULATOR WIDGET AREA */}
      {showScanSimulator && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-inner space-y-4">
          <div className="flex justify-between items-center border-b border-blue-200/50 pb-2">
            <h4 className="text-xs font-black text-blue-800 tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" /> Simulator Pos Security & Scanner Gerbang Utama
            </h4>
            <button 
              onClick={() => setShowScanSimulator(false)}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold"
            >
              Tutup Scanner
            </button>
          </div>

          <form onSubmit={handleTestScan} className="flex gap-2 max-w-lg">
            <input 
              type="text" 
              placeholder="Ketik/Paste Kode QR Tamu (Contoh: SMARTLIVING_VIS_01_CONFIRMED)" 
              value={scannedCode}
              onChange={e => setScannedCode(e.target.value)}
              className="flex-1 text-xs font-mono font-medium p-2.5 bg-white border border-blue-200 focus:ring-1 focus:ring-blue-500 rounded-xl outline-none"
              required
            />
            <button 
              type="submit" 
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Scan Kode QR
            </button>
          </form>

          {scanResult ? (
            <div className="bg-white border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-mono font-bold px-2 py-0.5 rounded uppercase">
                  ✓ KODE QR VALID
                </span>
                <h5 className="font-extrabold text-sm text-gray-800">Tamu: {scanResult.visitorName}</h5>
                <p className="text-xs text-gray-500">Tujuan: Menghubungi <strong className="font-bold">{scanResult.hostName} ({scanResult.hostHouseId})</strong></p>
                <p className="text-xs text-gray-400">Keperluan: {scanResult.purpose} | Pelat Kendaraan: <strong className="font-bold text-gray-700">{scanResult.vehiclePlate}</strong></p>
              </div>

              <div className="flex gap-2 shrink-0">
                {scanResult.status === 'Approved' && (
                  <button 
                    onClick={() => executeCheckIn(scanResult)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black active:scale-95 transition-transform"
                  >
                    Check In (Tamu Masuk)
                  </button>
                )}

                {scanResult.status === 'Checked In' && (
                  <button 
                    onClick={() => executeCheckOut(scanResult)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-black active:scale-95 transition-transform"
                  >
                    Check Out (Tamu Keluar)
                  </button>
                )}

                {scanResult.status === 'Checked Out' && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-3 py-2 rounded-lg font-bold">
                    Tamu Sudah Selesai Bertamu
                  </span>
                )}
              </div>
            </div>
          ) : scannedCode && (
            <p className="text-xs text-gray-400">Silahkan ketik kode QR yang valid lalu klik Scan untuk memvalidasi identitas tamu di pos security.</p>
          )}
        </div>
      )}

      {/* VIEW VISITOR PRE-APPROVAL LIST & GATE VEHICLE REKAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visitor log tracking column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800">Daftar Pre-Approval & Undangan Tamu</h4>
              <p className="text-[11px] text-gray-400">Sistem reservasi kedatangan warga sebelum tamu tiba di kompleks</p>
            </div>
            <input 
              type="text" 
              placeholder="Cari undangan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="text-xs border border-gray-200 p-2 rounded-lg max-w-[180px] outline-none"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700 font-medium">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-400 uppercase text-[10px]">
                    <th className="p-3">Nama Tamu & Nopol</th>
                    <th className="p-3">Penghuni / Rumah</th>
                    <th className="p-3">Tanggal Datang</th>
                    <th className="p-3">Kode QR Pass</th>
                    <th className="p-3 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredVisitors.map(vis => (
                    <tr key={vis.id} className="hover:bg-gray-50/20">
                      <td className="p-3">
                        <div>
                          <p className="font-extrabold text-blue-900">{vis.visitorName}</p>
                          <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-bold uppercase mt-0.5 inline-block">
                            {vis.vehiclePlate}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-gray-800">{vis.hostName}</p>
                        <p className="text-[10px] text-gray-400">Blok {vis.hostHouseId}</p>
                      </td>
                      <td className="p-3 font-mono text-gray-505">
                        {vis.expectedDate}
                      </td>
                      <td className="p-3 font-mono text-blue-700 font-bold select-all">
                        {vis.qrCodeUrl}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          vis.status === 'Approved' 
                            ? 'bg-blue-50 text-blue-700' 
                            : vis.status === 'Checked In' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                          {vis.status === 'Approved' ? 'Dipesan' : vis.status === 'Checked In' ? 'Ada di Dalam' : 'Selesai'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Gate logs and access record */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800">Gate Access & Audit Log</h4>
            <p className="text-[11px] text-gray-400">Rekap kendaraan masuk keluar gerbang secara real-time</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm h-[320px] overflow-y-auto space-y-3">
            {gateLogs.map(log => (
              <div key={log.id} className="text-xs p-3 rounded-lg bg-gray-50 border border-gray-100 flex gap-2 justify-between items-start">
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">{log.visitorName}</p>
                  <p className="text-[10px] font-mono text-gray-400">{log.timestamp}</p>
                  <span className="inline-block text-[9px] bg-white border border-gray-200 text-gray-600 px-1 rounded font-bold">{log.vehiclePlate}</span>
                </div>
                
                <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded ${
                  log.type === 'In' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {log.type === 'In' ? 'MASUK' : 'KELUAR'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CREATE VISITOR INV FORM MODAL */}
      {showAddInvite && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Undang Tamu Baru</h3>
              <p className="text-xs text-gray-500">Buat QR code pass berlakunya tamu untuk tervalidasi di pos security otomatis.</p>
            </div>
            
            <form onSubmit={handleAddInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Tamu *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Adi Saputra (Kurir/Teman)" 
                  value={visitorName}
                  onChange={e => setVisitorName(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">No. HP Tamu / Driver *</label>
                <input 
                  type="tel" 
                  placeholder="Contoh: 081234567890" 
                  value={visitorPhone}
                  onChange={e => setVisitorPhone(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">No. Pelat Nopol Kendaraan Tamu *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: B 4321 SNT" 
                  value={vehiclePlate}
                  onChange={e => setVehiclePlate(e.target.value)}
                  className="w-full text-xs font-mono font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Keperluan Berkunjung / Pesan Tamu</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Antar makanan / silaturahmi keluarga" 
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tanggal Kunjungan *</label>
                  <input 
                    type="date" 
                    value={expectedDate}
                    onChange={e => setExpectedDate(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Rumah Anda *</label>
                  <select
                    value={hostHouseId}
                    onChange={e => setHostHouseId(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2 outline-none text-gray-700"
                    required
                  >
                    <option value="">-- Pilih --</option>
                    {houses.map(h => (
                      <option key={h.id} value={h.id}>{h.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddInvite(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Terbitkan QR Code Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
