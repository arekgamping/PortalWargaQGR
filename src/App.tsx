import React, { useState } from 'react';
import { initialHouses, initialResidents, initialPayments, initialVisitors, initialComplaints, initialProducts, initialOrders, initialForumThreads, initialPollings, initialFacilities, initialBookings, initialDirectoryItems, initialEmergencyNotices, initialGateLogs } from './mockData';
import { House, Resident, Payment, Visitor, Complaint, Product, Order, ForumThread, Polling, Facility, Booking, DirectoryItem, EmergencyNotice, GateLog, UserRole } from './types';
import RoleSelector from './components/RoleSelector';
import DashboardKawasan from './components/DashboardKawasan';
import ResidentModule from './components/ResidentModule';
import FinanceModule from './components/FinanceModule';
import SecurityModule from './components/SecurityModule';
import ComplaintModule from './components/ComplaintModule';
import CommunityModule from './components/CommunityModule';
import MarketplaceModule from './components/MarketplaceModule';
import FacilityModule from './components/FacilityModule';
import DirectoryModule from './components/DirectoryModule';

import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  AlertOctagon, 
  MessageSquare, 
  Store, 
  CalendarRange, 
  Compass, 
  Bell, 
  Heart, 
  AlertTriangle,
  LogOut,
  XCircle,
  Home
} from 'lucide-react';

export default function App() {
  const [role, setRole] = useState<UserRole>('Super Admin');
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  // Unified State Engine
  const [houses, setHouses] = useState<House[]>(initialHouses);
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(initialForumThreads);
  const [pollings, setPollings] = useState<Polling[]>(initialPollings);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [emergencyNotices, setEmergencyNotices] = useState<EmergencyNotice[]>(initialEmergencyNotices);
  const [gateLogs, setGateLogs] = useState<GateLog[]>(initialGateLogs);

  // Global active banner for emergency panic
  const [activePanicMessage, setActivePanicMessage] = useState<string | null>(null);

  // HANDLER FUNCTIONS
  const handleUpdateHouseStatus = (houseId: string, status: 'Terisi' | 'Kosong' | 'Renovasi') => {
    setHouses(prev => prev.map(h => h.id === houseId ? { ...h, status } : h));
  };

  const handleAddNotice = (notice: EmergencyNotice) => {
    setEmergencyNotices(prev => [notice, ...prev]);
  };

  const handleAddResident = (newRes: Resident) => {
    setResidents(prev => [newRes, ...prev]);
    // Also update house status automatic
    handleUpdateHouseStatus(newRes.houseId, 'Terisi');
  };

  const handleDeleteResident = (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus warga ini dari database perumahan?")) {
      setResidents(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleUpdateResident = (updatedRes: Resident) => {
    setResidents(prev => prev.map(r => r.id === updatedRes.id ? updatedRes : r));
  };

  const handleAddPayment = (newPay: Payment) => {
    setPayments(prev => [newPay, ...prev]);
  };

  const handlePayBill = (id: string, paymentMethod: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: 'Pending', // Sent to pending review of admin 
      paymentMethod,
      paidDate: new Date().toISOString().split('T')[0]
    } : p));
  };

  const handleApprovePayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Lunas' } : p));
  };

  const handleAddVisitor = (newVis: Visitor) => {
    setVisitors(prev => [newVis, ...prev]);
  };

  const handleUpdateVisitorStatus = (id: string, status: 'Checked In' | 'Checked Out') => {
    setVisitors(prev => prev.map(v => v.id === id ? { 
      ...v, 
      status, 
      checkInTime: status === 'Checked In' ? new Date().toLocaleString() : v.checkInTime,
      checkOutTime: status === 'Checked Out' ? new Date().toLocaleString() : v.checkOutTime
    } : v));
  };

  const handleAddGateLog = (log: GateLog) => {
    setGateLogs(prev => [log, ...prev]);
  };

  const handleTriggerPanic = (alertMessage: string) => {
    setActivePanicMessage(alertMessage);
  };

  const handleAddComplaint = (newComp: Complaint) => {
    setComplaints(prev => [newComp, ...prev]);
  };

  const handleAssignTechnician = (id: string, technicianName: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, assignedTechnician: technicianName } : c));
  };

  const handleUpdateProgress = (id: string, note: string, author: string, status?: 'Diproses' | 'Selesai') => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const nextUpdates = [
          ...c.progressUpdates,
          { date: new Date().toLocaleString(), note, author }
        ];
        return { 
          ...c, 
          progressUpdates: nextUpdates, 
          status: status || c.status 
        };
      }
      return c;
    }));
  };

  const handleRateComplaint = (id: string, rating: number, comment: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, rating, reviewComment: comment } : c));
  };

  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProductStatus = (id: string, status: 'Active' | 'Nonaktif') => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (id: string, status: 'Diproses' | 'Selesai' | 'Dibatalkan') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleAddThread = (newThr: ForumThread) => {
    setForumThreads(prev => [newThr, ...prev]);
  };

  const handleLikeThread = (id: string) => {
    setForumThreads(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  };

  const handleAddComment = (threadId: string, content: string, author: string, roleName: string) => {
    setForumThreads(prev => prev.map(t => t.id === threadId ? {
      ...t,
      comments: [
        ...t.comments,
        {
          id: `comm-${Date.now()}`,
          authorName: author,
          authorRole: roleName,
          content,
          date: 'Sekarang'
        }
      ]
    } : t));
  };

  const handleAddPolling = (newPoll: Polling) => {
    setPollings(prev => [newPoll, ...prev]);
  };

  const handleVotePolling = (pollingId: string, optionId: string) => {
    setPollings(prev => prev.map(p => {
      if (p.id === pollingId) {
        // Increment option vote count, record vote for res-01 (Budi)
        const updatedOptions = p.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt);
        return {
          ...p,
          options: updatedOptions,
          votesCount: { ...p.votesCount, 'res-01': optionId },
          totalVotes: p.totalVotes + 1
        };
      }
      return p;
    }));
  };

  const handleAddBooking = (newBook: Booking) => {
    setBookings(prev => [newBook, ...prev]);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Disetujui' | 'Ditolak') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };


  // Side Nav Menu list with role checking
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: <LayoutDashboard className="w-4 h-4" />, minRole: 'Guest' },
    { id: 'warga', label: 'Manajemen Warga', icon: <Users className="w-4 h-4" />, minRole: 'Warga' },
    { id: 'keuangan', label: 'Iuran & Pembayaran', icon: <CreditCard className="w-4 h-4" />, minRole: 'Warga' },
    { id: 'keamanan', label: 'Pos Security & Tamu', icon: <ShieldCheck className="w-4 h-4" />, minRole: 'Warga' },
    { id: 'komplain', label: 'Komplain & Maintenance', icon: <AlertOctagon className="w-4 h-4" />, minRole: 'Warga' },
    { id: 'forum', label: 'Forum Komunitas', icon: <MessageSquare className="w-4 h-4" />, minRole: 'Guest' },
    { id: 'marketplace', label: 'Pasar Warga (UMKM)', icon: <Store className="w-4 h-4" />, minRole: 'Guest' },
    { id: 'booking', label: 'Booking Fasum', icon: <CalendarRange className="w-4 h-4" />, minRole: 'Warga' },
    { id: 'direktori', label: 'Direktori Kawasan', icon: <Compass className="w-4 h-4" />, minRole: 'Guest' }
  ];

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    // If the active module isn't authorized for this new role, kick back to dashboard!
    const activeItem = navigationItems.find(item => item.id === activeModule);
    if (activeItem && newRole === 'Guest' && activeItem.minRole !== 'Guest') {
      setActiveModule('dashboard');
    }
  };

  return (
    <div id="main-app" className="bg-gray-100 min-h-screen text-gray-800 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-800">
      
      {/* PANIC MESSAGE EMERGENCY TOP BANNER FLOATING IF ACTIVE */}
      {activePanicMessage && (
        <div className="bg-rose-600 text-white font-black text-xs md:text-sm p-4 text-center tracking-wide flex items-center justify-center gap-3 animate-pulse border-b border-rose-800 shadow-md">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{activePanicMessage}</span>
          <button 
            onClick={() => setActivePanicMessage(null)}
            className="ml-4 px-2 py-1 bg-rose-800 hover:bg-rose-900 rounded text-[10px] uppercase font-bold"
          >
            Tutup Notif
          </button>
        </div>
      )}

      {/* PRIMARY HEADER BAR */}
      <header className="bg-white border-b border-gray-200 py-3.5 px-6 shrink-0 sticky top-0 z-40 bg-opacity-95 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-gray-900">SmartLiving</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest font-extrabold pb-0.5">RESIDENCE PLATFORM</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-xs font-extrabold text-gray-800">Budi Santoso</p>
            <p className="text-[10px] text-gray-400 font-bold">Kapling A-01 (RT 01 / RW 03)</p>
          </div>
          
          <div className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-xl transition-all cursor-pointer relative shrink-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT BODY */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col gap-6">
        
        {/* INJECT DEMO CONTROL PANEL */}
        <RoleSelector currentRole={role} onRoleChange={handleRoleChange} />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* NAVIGATION MENU COLUMN BOX */}
          <nav className="w-full lg:w-64 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2 shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 block font-black mb-1.5 px-2">
              Menu Ekosistem
            </span>

            {navigationItems.map(item => {
              // Lock / check for authorization
              const isLocked = item.minRole !== 'Guest' && role === 'Guest';
              const isActive = activeModule === item.id;

              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  disabled={isLocked}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between p-2.5 text-xs font-bold rounded-xl transition-all ${
                    isActive 
                      ? 'bg-blue-605 bg-blue-600 text-white shadow-md' 
                      : isLocked 
                        ? 'opacity-40 cursor-not-allowed bg-transparent text-gray-400 hover:bg-transparent'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {isLocked && (
                    <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
                      Lock
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* DYNAMIC CONTENT LOAD AREA WITH TAB CONTROL SWITCHES */}
          <div className="flex-1 w-full bg-light rounded-none min-h-[480px]">
            {activeModule === 'dashboard' && (
              <DashboardKawasan 
                role={role}
                houses={houses}
                residentsCount={residents.length}
                payments={payments}
                complaints={complaints}
                visitors={visitors}
                emergencyNotices={emergencyNotices}
                onAddNotice={handleAddNotice}
                onUpdateHouseStatus={handleUpdateHouseStatus}
              />
            )}

            {activeModule === 'warga' && (
              <ResidentModule 
                role={role}
                residents={residents}
                houses={houses}
                onAddResident={handleAddResident}
                onDeleteResident={handleDeleteResident}
                onUpdateResident={handleUpdateResident}
              />
            )}

            {activeModule === 'keuangan' && (
              <FinanceModule 
                role={role}
                payments={payments}
                residents={residents}
                onAddPayment={handleAddPayment}
                onPayBill={handlePayBill}
                onApprovePayment={handleApprovePayment}
              />
            )}

            {activeModule === 'keamanan' && (
              <SecurityModule 
                role={role}
                visitors={visitors}
                houses={houses}
                gateLogs={gateLogs}
                onAddVisitor={handleAddVisitor}
                onUpdateVisitorStatus={handleUpdateVisitorStatus}
                onTriggerPanic={handleTriggerPanic}
                onAddGateLog={handleAddGateLog}
              />
            )}

            {activeModule === 'komplain' && (
              <ComplaintModule 
                role={role}
                complaints={complaints}
                houses={houses}
                onAddComplaint={handleAddComplaint}
                onAssignTechnician={handleAssignTechnician}
                onUpdateProgress={handleUpdateProgress}
                onRateComplaint={handleRateComplaint}
              />
            )}

            {activeModule === 'forum' && (
              <CommunityModule 
                role={role}
                threads={forumThreads}
                pollings={pollings}
                onAddThread={handleAddThread}
                onLikeThread={handleLikeThread}
                onVotePolling={handleVotePolling}
                onAddComment={handleAddComment}
                onAddPolling={handleAddPolling}
              />
            )}

            {activeModule === 'marketplace' && (
              <MarketplaceModule 
                role={role}
                products={products}
                orders={orders}
                onAddProduct={handleAddProduct}
                onUpdateProductStatus={handleUpdateProductStatus}
                onPlaceOrder={handlePlaceOrder}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {activeModule === 'booking' && (
              <FacilityModule 
                role={role}
                facilities={initialFacilities}
                bookings={bookings}
                houses={houses}
                onAddBooking={handleAddBooking}
                onUpdateBookingStatus={handleUpdateBookingStatus}
              />
            )}

            {activeModule === 'direktori' && (
              <DirectoryModule 
                directoryItems={initialDirectoryItems}
              />
            )}
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6 text-center text-xs text-gray-500 font-medium shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 SmartLiving Residence Platform. Integrasi Kehidupan Kawasan Perumahan Modern.</p>
          <div className="flex gap-4 text-gray-400">
            <a href="#tos" className="hover:text-gray-600 font-bold">Syarat & Ketentuan</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-gray-600 font-bold">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
