import React, { useState } from 'react';
import { Payment, UserRole, Resident } from '../types';
import { CreditCard, DollarSign, Calendar, Eye, Download, Check, AlertCircle, RefreshCw, Send, Plus, CheckCircle2, QrCode } from 'lucide-react';

interface FinanceModuleProps {
  role: UserRole;
  payments: Payment[];
  residents: Resident[];
  onAddPayment: (payment: Payment) => void;
  onPayBill: (id: string, paymentMethod: string) => void;
  onApprovePayment: (id: string) => void;
}

export default function FinanceModule({
  role,
  payments,
  residents,
  onAddPayment,
  onPayBill,
  onApprovePayment,
}: FinanceModuleProps) {
  const [filterMonth, setFilterMonth] = useState('Semua');
  const [filterType, setFilterType] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  
  // Custom Invoice Modal
  const [viewingInvoice, setViewingInvoice] = useState<Payment | null>(null);
  const [payingBill, setPayingBill] = useState<Payment | null>(null);
  const [simulatedVa, setSimulatedVa] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Bill Generation Modal for RT-RW/Admin
  const [showGenerateBill, setShowGenerateBill] = useState(false);
  const [newBillType, setNewBillType] = useState<'IPL' | 'Air' | 'Sampah' | 'Keamanan' | 'Event'>('IPL');
  const [newBillAmount, setNewBillAmount] = useState<number>(250000);
  const [newBillMonth, setNewBillMonth] = useState('Mei 2026');
  const [newBillDueDate, setNewBillDueDate] = useState('2026-06-10');

  const handleGenerateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillAmount || !newBillMonth || !newBillDueDate) return;

    // We generate a bill for EVERY resident registered!
    residents.forEach(res => {
      onAddPayment({
        id: `pay-${Date.now()}-${res.id}`,
        residentId: res.id,
        residentName: res.name,
        houseId: res.houseId,
        type: newBillType,
        amount: newBillAmount,
        month: newBillMonth,
        status: 'Belum Bayar',
        dueDate: newBillDueDate
      });
    });

    setShowGenerateBill(false);
    alert(`Berhasil membuat tagihan ${newBillType} bulan ${newBillMonth} untuk semua ${residents.length} warga!`);
  };

  const startPaymentFlow = (bill: Payment) => {
    setPayingBill(bill);
    setPaymentSuccess(false);
    // Generate a beautiful mock VA code
    const randDigits = Math.floor(10000000 + Math.random() * 90000000);
    setSimulatedVa(`9888-${bill.houseId.replace('-', '')}-${randDigits}`);
  };

  const confirmPaidSimulation = (method: string) => {
    if (!payingBill) return;
    onPayBill(payingBill.id, method);
    setPaymentSuccess(true);
    setTimeout(() => {
      setPayingBill(null);
      setPaymentSuccess(false);
    }, 2000);
  };

  // Filter Payments
  const filteredPayments = payments.filter(pay => {
    const matchMonth = filterMonth === 'Semua' || pay.month === filterMonth;
    const matchType = filterType === 'Semua' || pay.type === filterType;
    const matchStatus = filterStatus === 'Semua' || pay.status === filterStatus;
    
    // Non-admins/non-staff can only see their own family payments!
    // To make demo easy, let's assume the current active non-admin resident is "res-01" (Budi Santoso)
    if (role === 'Warga') {
      return matchMonth && matchType && matchStatus && pay.residentId === 'res-01';
    }
    return matchMonth && matchType && matchStatus;
  });

  const getStatusBadge = (status: 'Lunas' | 'Belum Bayar' | 'Pending') => {
    switch (status) {
      case 'Lunas':
        return <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-2 py-0.5 font-bold">Lunas</span>;
      case 'Pending':
        return <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-100 rounded-lg px-2 py-0.5 font-bold animate-pulse">Pending Review</span>;
      case 'Belum Bayar':
        return <span className="text-[11px] bg-rose-50 text-rose-700 border border-rose-100 rounded-lg px-2 py-0.5 font-bold">Belum Bayar</span>;
    }
  };

  return (
    <div id="finance-module-container" className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Sistem Keuangan & Iuran Blok</h2>
          <p className="text-xs text-gray-500">Akses pelunasan pembayaran IPL, iuran sampah, air pam, keamanan malam, dan penagihan berkala</p>
        </div>
        
        {(role === 'Super Admin' || role === 'RT/RW') && (
          <button 
            id="btn-open-bill-generation"
            onClick={() => setShowGenerateBill(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-xl shadow-xs"
          >
            <Send className="w-4 h-4" />
            Terbitkan Tagihan Massal Warga
          </button>
        )}
      </div>

      {/* FILTER BUTTONS */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-1.5 min-w-[140px]">
          <span className="text-xs text-gray-500 font-bold">Bulan:</span>
          <select 
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 outline-none text-gray-700 font-medium"
          >
            <option value="Semua">Semua Bulan</option>
            <option value="Mei 2026">Mei 2026</option>
            <option value="April 2026">April 2026</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 min-w-[140px]">
          <span className="text-xs text-gray-500 font-bold">Iuran:</span>
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 outline-none text-gray-700 font-medium"
          >
            <option value="Semua">Semua Tipe</option>
            <option value="IPL">IPL (Kebersihan/Lingk)</option>
            <option value="Air">Air Bersih (PAM)</option>
            <option value="Sampah">Iuran Sampah</option>
            <option value="Keamanan">Ronda & Keamanan</option>
            <option value="Event">Iuran Event</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 min-w-[140px]">
          <span className="text-xs text-gray-500 font-bold">Status:</span>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 flex-1 outline-none text-gray-700 font-medium"
          >
            <option value="Semua">Semua Status</option>
            <option value="Lunas">Lunas</option>
            <option value="Belum Bayar">Belum Bayar</option>
            <option value="Pending">Pending Review</option>
          </select>
        </div>

        {role === 'Warga' && (
          <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-xs leading-relaxed max-w-sm ml-auto text-blue-700">
            🔔 Menampilkan tagihan terdaftar atas nama: <strong className="font-extrabold text-blue-800">Budi Santoso (A-01)</strong>
          </div>
        )}
      </div>

      {/* FINANCE LISTINGS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-4">ID Rumah & Penghuni</th>
                <th className="p-4">Jenis Tagihan</th>
                <th className="p-4">Besaran Tagihan</th>
                <th className="p-4">Periode & Tempo</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Metode / Tgl Bayar</th>
                <th className="p-4 text-center">Opsi Layanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-400">
                    Tidak ada transaksi keuangan terdata atau cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(pay => {
                  return (
                    <tr key={pay.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <span className="font-bold text-gray-800 text-sm">{pay.houseId}</span>
                          <span className="text-gray-400 text-[10px] block font-semibold">{pay.residentName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          pay.type === 'IPL' 
                            ? 'bg-blue-100 text-blue-800' 
                            : pay.type === 'Air' 
                              ? 'bg-sky-100 text-sky-800' 
                              : pay.type === 'Sampah' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                          Iuran {pay.type}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-gray-800">
                        Rp {pay.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 space-y-0.5">
                        <span className="block font-medium text-gray-600">{pay.month}</span>
                        <span className="block text-[10px] text-gray-400">Tempo: {pay.dueDate}</span>
                      </td>
                      <td className="p-4 text-center">
                        {getStatusBadge(pay.status)}
                      </td>
                      <td className="p-4 text-center">
                        {pay.status === 'Lunas' ? (
                          <div className="space-y-0.5">
                            <span className="block font-semibold text-gray-800 text-[10px]">{pay.paymentMethod || 'Tunai/Kasir'}</span>
                            <span className="block text-[10px] text-gray-400">{pay.paidDate || '-'}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {pay.status === 'Belum Bayar' && (role === 'Warga' || role === 'Super Admin') && (
                            <button 
                              onClick={() => startPaymentFlow(pay)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-[10px] font-bold shrink-0"
                            >
                              Bayar Sekarang
                            </button>
                          )}

                          {pay.status === 'Pending' && (role === 'Super Admin' || role === 'RT/RW') && (
                            <button 
                              onClick={() => onApprovePayment(pay.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-[10px] font-bold"
                            >
                              Acc Bayar
                            </button>
                          )}

                          {pay.status === 'Lunas' && (
                            <button 
                              onClick={() => setViewingInvoice(pay)}
                              className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Kuitansi / Invoice
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDER INVOICE MODAL */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-lg overflow-hidden shadow-2xl relative">
            
            <div className="bg-teal-700 text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-teal-200 font-mono text-[9px] font-bold tracking-widest block">BUKTI BAYAR DIGITAL SUCCESS</span>
                <h4 className="text-lg font-black tracking-tight">KUITANSI PEMBAYARAN</h4>
                <p className="text-xs font-mono opacity-80">No: INV-{viewingInvoice.id}</p>
              </div>
              <Check className="w-10 h-10 bg-white/10 text-white p-2 rounded-full font-bold" />
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border-y border-gray-100 p-3 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400 block">Nama Warga:</span>
                  <span className="font-bold text-gray-800">{viewingInvoice.residentName}</span>
                </div>
                <div>
                  <span className="text-gray-450 block">No Rumah:</span>
                  <span className="font-bold text-gray-800">{viewingInvoice.houseId}</span>
                </div>
                <div>
                  <span className="text-gray-450 block">Tanggal Lunas:</span>
                  <span className="font-bold text-gray-800">{viewingInvoice.paidDate || 'Baru Saja'}</span>
                </div>
                <div>
                  <span className="text-gray-450 block">Metode Bayar:</span>
                  <span className="font-bold text-gray-800">{viewingInvoice.paymentMethod || 'Online Transfer'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 block">Rincian Pembayaran</span>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Pembayaran Iuran Bulanan {viewingInvoice.type} - {viewingInvoice.month}</span>
                  <span className="font-extrabold text-gray-800">Rp {viewingInvoice.amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 pt-2 font-bold text-teal-800">
                  <span>TOTAL LUNAS</span>
                  <span className="text-sm">Rp {viewingInvoice.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
              <button 
                onClick={() => {
                  alert("Menyimpan PDF Invoice perumahan SmartLiving...");
                }}
                className="flex items-center gap-1 px-3.5 py-2 border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 rounded-xl text-xs active:scale-95"
              >
                <Download className="w-4 h-4" /> Simpan PDF
              </button>
              <button 
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 active:scale-95"
              >
                Tutup Bukti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL WITH BANK ACC & QRIS GENERATOR */}
      {payingBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            
            <div className="bg-blue-600 text-white p-5">
              <h4 className="font-bold text-base">Portal Multi-Integrasi Tagihan Mandiri</h4>
              <p className="text-[11px] text-blue-100">Lakukan pembayaran iuran {payingBill.type} ({payingBill.month})</p>
            </div>

            <div className="p-6 space-y-4">
              {paymentSuccess ? (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h5 className="font-black text-lg text-emerald-800">Pembayaran Terkirim!</h5>
                  <p className="text-xs text-gray-500">Sistem memproses callback sukses otomatis. Status akan segera diupdate menjadi Lunas oleh admin keuangan.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-400">Total Tagihan</span>
                      <p className="text-xl font-black text-blue-700">Rp {payingBill.amount.toLocaleString('id-ID')}</p>
                    </div>
                    <span className="font-mono bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      {payingBill.month}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-gray-500 block">Pilih Metode Pembayaran Simulasi:</span>
                    
                    {/* Method 1: Virtual Account */}
                    <div className="border border-blue-100 rounded-xl p-3 bg-blue-50/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                          <CreditCard className="w-4 h-4 text-blue-600" /> Virtual Account Bank BCA
                        </span>
                        <button 
                          onClick={() => confirmPaidSimulation('Virtual Account BCA')}
                          className="px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md"
                        >
                          Bayar via VA
                        </button>
                      </div>
                      <div className="p-2 bg-gray-100 font-mono text-center rounded text-xs select-all text-gray-650 tracking-wider">
                        {simulatedVa}
                      </div>
                      <p className="text-[10px] text-gray-400">Salin nomor VA di atas lalu simulasi bayar lewat ATM/M-Banking BCA</p>
                    </div>

                    {/* Method 2: QRIS */}
                    <div className="border border-green-100 rounded-xl p-3 bg-green-50/20 flex gap-3 items-center">
                      <div className="p-1 bg-white border border-gray-200 rounded shrink-0">
                        {/* Interactive simulation QR */}
                        <QrCode className="w-16 h-16 text-emerald-600" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <span className="text-xs font-bold text-gray-800 block">QRIS Multi Payment (Ovo/Gopay/Shopee)</span>
                        <p className="text-[10px] text-gray-400">Dukung Pembayaran QRIS instan otomatis terdeteksi realtime.</p>
                        <button 
                          onClick={() => confirmPaidSimulation('QRIS Instan')}
                          className="w-full text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[10px] active:scale-95 transition-transform"
                        >
                          Klik Simulasi Scan QRIS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!paymentSuccess && (
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setPayingBill(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BILL GENERATION MODAL */}
      {showGenerateBill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Terbitkan Tagihan Massal Warga</h3>
              <p className="text-xs text-gray-500">Sistem akan mengenerate tagihan ini otomatis untuk semua rumah / kepala keluarga terdaftar</p>
            </div>
            
            <form onSubmit={handleGenerateBill} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Iuran Bulanan</label>
                <select 
                  value={newBillType}
                  onChange={e => setNewBillType(e.target.value as any)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                >
                  <option value="IPL">IPL (Iuran Pengelola Lingkungan)</option>
                  <option value="Air">Air PAM / Keperluan Rumah tangga</option>
                  <option value="Sampah">Iuran Pengelolaan Sampah Kompleks</option>
                  <option value="Keamanan">Iuran Keamanan & Siskamling</option>
                  <option value="Event">Iuran Sosial / Event Warga perumahan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Besar Tagihan (Rupiah)</label>
                <input 
                  type="number" 
                  value={newBillAmount}
                  onChange={e => setNewBillAmount(Number(e.target.value))}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Periode Bulan Penagihan</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Juni 2026"
                  value={newBillMonth}
                  onChange={e => setNewBillMonth(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Batas Akhir (Tanggal Jatuh Tempo)</label>
                <input 
                  type="date" 
                  value={newBillDueDate}
                  onChange={e => setNewBillDueDate(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowGenerateBill(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Proses Terbitkan ke {residents.length} Kak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
