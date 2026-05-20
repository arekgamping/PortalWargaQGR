import React, { useState } from 'react';
import { Product, Order, UserRole, House } from '../types';
import { ShoppingBag, Plus, Sparkles, Filter, Check, Clock, Search, Tag, Users, Package, ShoppingCart, ShieldAlert } from 'lucide-react';

interface MarketplaceModuleProps {
  role: UserRole;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onUpdateProductStatus: (id: string, status: 'Active' | 'Nonaktif') => void;
  onPlaceOrder: (order: Order) => void;
  onUpdateOrderStatus: (id: string, status: 'Diproses' | 'Selesai' | 'Dibatalkan') => void;
}

export default function MarketplaceModule({
  role,
  products,
  orders,
  onAddProduct,
  onUpdateProductStatus,
  onPlaceOrder,
  onUpdateOrderStatus,
}: MarketplaceModuleProps) {
  const [activeTab, setActiveTab] = useState<'katalog' | 'toko-saya' | 'pesanan-saya' | 'admin-review'>('katalog');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart / Buy process
  const [buyingProduct, setBuyingProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState('Budi Santoso');
  const [buyerPhone, setBuyerPhone] = useState('081234567890');
  const [buyerHouseId, setBuyerHouseId] = useState('A-01');

  // Seller: Add Product
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(15000);
  const [newProdCategory, setNewProdCategory] = useState<'Makanan' | 'Minuman' | 'Jasa Rumah Tangga' | 'Kebutuhan Harian' | 'Lainnya'>('Makanan');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdDesc) return;

    // By default, since the user is simulating Warga/UMKM role, they are Budi Santoso on default seller
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sellerId: 'res-01',
      sellerName: 'Budi Santoso (Dapur Pak Budi)',
      sellerPhone: '081234567890',
      houseId: 'A-01',
      name: newProdName,
      price: newProdPrice,
      category: newProdCategory,
      description: newProdDesc,
      imageUrl: newProdImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      status: role === 'Super Admin' || role === 'RT/RW' ? 'Active' : 'Review' // Goes into review queue for Admin to make it Active!
    };

    onAddProduct(newProduct);
    
    setNewProdName('');
    setNewProdPrice(15000);
    setNewProdDesc('');
    setNewProdImage('');
    setShowAddProduct(false);

    if (role === 'Warga' || role === 'UMKM') {
      alert("Produk BERHASIL diunggah! Berada dalam status 'Review' oleh Admin sebelum tampil di katalog warga.");
    } else {
      alert("Produk aktif dipasang di katalog!");
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingProduct) return;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      productId: buyingProduct.id,
      productName: buyingProduct.name,
      price: buyingProduct.price,
      quantity: orderQuantity,
      totalPrice: buyingProduct.price * orderQuantity,
      buyerName,
      buyerPhone,
      buyerHouseId,
      sellerId: buyingProduct.sellerId,
      sellerName: buyingProduct.sellerName,
      status: 'Pending',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onPlaceOrder(newOrder);
    setBuyingProduct(null);
    setOrderQuantity(1);
    alert(`Pesanan Sukses Dibuat! Penjual (${buyingProduct.sellerName}) akan menghubungi Anda via Whatsapp.`);
  };

  // Filter products by category & status
  const visibleProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && p.status === 'Active';
  });

  return (
    <div id="marketplace-module-container" className="space-y-6">
      
      {/* Header and navigation tabs */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-150 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pasar Digital Warga (UMKM)</h2>
          <p className="text-xs text-gray-500">Mendorong roda perekonomian mikro internal kompleks perumahan SmartLiving</p>
        </div>

        {/* Tabs for different workflows */}
        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => setActiveTab('katalog')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'katalog' ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            🛒 Katalog Belanja
          </button>
          
          {(role === 'Warga' || role === 'UMKM' || role === 'Super Admin') && (
            <>
              <button 
                onClick={() => setActiveTab('toko-saya')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'toko-saya' ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                🏠 Toko Saya (Penjual)
              </button>
              <button 
                onClick={() => setActiveTab('pesanan-saya')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'pesanan-saya' ? 'bg-blue-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                📦 Kelola Transaksi ({orders.length})
              </button>
            </>
          )}

          {(role === 'Super Admin' || role === 'RT/RW') && (
            <button 
              onClick={() => setActiveTab('admin-review')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'admin-review' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
            >
              🛠 Review Antrean ({products.filter(p => p.status === 'Review').length})
            </button>
          )}
        </div>
      </div>

      {/* variable state logic is in React */}

      {/* --- KATALOG TAB --- */}
      {activeTab === 'katalog' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest bg-emerald-500 border border-emerald-400 font-bold px-2 py-0.5 rounded uppercase">PROMO UMKM LOKAL</span>
              <h4 className="font-extrabold text-lg mt-1 tracking-tight">Belanja Hemat & Gratis Ongkir Antar Kapling!</h4>
              <p className="text-xs text-emerald-100 mt-1">Dukung pelaku usaha tetangga perumahan dengan memesan langsung di platform SmartLiving.</p>
            </div>
            {(role === 'Warga' || role === 'UMKM') && (
              <button 
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shrink-0"
              >
                + Buka Lapak & Jual Produk
              </button>
            )}
          </div>

          {/* Sarch and Category filtering */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Cari makanan hangat, kopi susu, atau jasa setrika baju..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 pl-9 outline-none focus:border-emerald-500"
              />
            </div>
            
            <div className="flex gap-2 min-w-[160px]">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5 font-bold text-gray-700 outline-none"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Makanan">Makanan Warga</option>
                <option value="Minuman">Minuman Segar</option>
                <option value="Jasa Rumah Tangga">Jasi / Servis Rumah</option>
                <option value="Kebutuhan Harian">Kebutuhan Harian</option>
              </select>
            </div>
          </div>

          {/* Grid layout products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleProducts.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-400">
                Belum ada produk atau jasa aktif yang dipublikasikan di kategori ini.
              </div>
            ) : (
              visibleProducts.map(prod => (
                <div key={prod.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col h-full justify-between">
                  <div className="relative h-44 bg-gray-100 w-full shrink-0">
                    <img 
                      referrerPolicy="no-referrer"
                      src={prod.imageUrl} 
                      alt={prod.name} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute left-2.5 top-2.5 bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                      {prod.category}
                    </span>
                    <span className="absolute right-2.5 top-2.5 bg-slate-900/80 text-white text-[9px] font-mono px-2 py-0.5 rounded border border-white/10 font-bold">
                      {prod.houseId}
                    </span>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-extrabold text-sm text-gray-800 tracking-tight leading-snug line-clamp-1">{prod.name}</h5>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed font-medium">{prod.description}</p>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-gray-400">Harga Warga:</span>
                        <span className="text-base font-black text-emerald-700">Rp {prod.price.toLocaleString('id-ID')}</span>
                      </div>
                      
                      <div className="border-t border-gray-100 my-2 pt-2 text-[10px] text-gray-500 font-semibold flex justify-between">
                        <span>Lapak: {prod.sellerName}</span>
                      </div>

                      <button 
                        onClick={() => setBuyingProduct(prod)}
                        className="w-full text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs active:scale-95 transition-transform"
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TOKO SAYA TAB --- */}
      {activeTab === 'toko-saya' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 border border-gray-150 p-4 rounded-xl">
            <div>
              <h4 className="font-bold text-gray-800">Manajemen Toko Saya</h4>
              <p className="text-xs text-gray-550">Atur katalog produk jualan Anda yang dipromosikan ke seluruh warga.</p>
            </div>
            <button 
              onClick={() => setShowAddProduct(true)}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              + Unggah Produk Baru
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs">
            <span className="bg-gray-50 border-b border-gray-100 p-3 block font-bold text-xs text-gray-400 uppercase">
              Daftar Unggahan Produk / Jasa Anda
            </span>
            <div className="divide-y divide-gray-150 text-xs">
              {products.filter(p => p.sellerId === 'res-01').map(prod => (
                <div key={prod.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex gap-3 items-center">
                    <img referrerPolicy="no-referrer" src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                    <div>
                      <h5 className="font-extrabold text-sm text-gray-800">{prod.name}</h5>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">{prod.category}</span>
                      <span className="text-[11px] text-gray-400 ml-2">Rp {prod.price.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      prod.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : prod.status === 'Review' 
                          ? 'bg-amber-100 text-amber-800 animate-pulse' 
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {prod.status === 'Active' ? 'Aktif Tayang' : prod.status === 'Review' ? 'Menunggu Peninjauan Admin' : 'Nonaktif'}
                    </span>

                    {prod.status === 'Active' ? (
                      <button 
                        onClick={() => onUpdateProductStatus(prod.id, 'Nonaktif')}
                        className="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-[10px] rounded"
                      >
                        Sembunyikan
                      </button>
                    ) : prod.status === 'Nonaktif' ? (
                      <button 
                        onClick={() => onUpdateProductStatus(prod.id, 'Active')}
                        className="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-[10px] rounded"
                      >
                        Aktifkan
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- KELOLA TRANSAKSI TAB --- */}
      {activeTab === 'pesanan-saya' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs">
            <span className="bg-gray-50 border-b border-gray-100 p-3 block font-bold text-xs text-gray-400 uppercase">
              Pesanan / Orderan Masuk Untuk Lapak Anda
            </span>
            <div className="divide-y divide-gray-150 text-xs">
              {orders.filter(o => o.sellerId === 'res-01').length === 0 ? (
                <p className="p-8 text-center text-gray-400">Belum ada pesanan masuk dari warga.</p>
              ) : (
                orders.filter(o => o.sellerId === 'res-01').map(ord => (
                  <div key={ord.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">{ord.productName}</span>
                        <span className="text-[11px] font-bold text-blue-650">x{ord.quantity}</span>
                      </div>
                      <p className="text-xs text-gray-500">Pemesan: <strong className="font-bold text-gray-700">{ord.buyerName} ({ord.buyerHouseId})</strong> | HP: {ord.buyerPhone}</p>
                      <p className="text-[11px] text-gray-400">Waktu Order: {ord.date} | Total Bayar: <strong className="font-bold text-emerald-700">Rp {ord.totalPrice.toLocaleString('id-ID')}</strong></p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        ord.status === 'Pending' 
                          ? 'bg-amber-150 text-amber-800' 
                          : ord.status === 'Diproses' 
                            ? 'bg-blue-100 text-blue-800 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.status}
                      </span>

                      {ord.status === 'Pending' && (
                        <button 
                          onClick={() => onUpdateOrderStatus(ord.id, 'Diproses')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px]"
                        >
                          Terima & Proses
                        </button>
                      )}

                      {ord.status === 'Diproses' && (
                        <button 
                          onClick={() => onUpdateOrderStatus(ord.id, 'Selesai')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                        >
                          Tandai Selesai
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-xs">
            <span className="bg-gray-50 border-b border-gray-100 p-3 block font-bold text-xs text-gray-400 uppercase">
              Riwayat Belanja Saya (Sebagai Pembeli)
            </span>
            <div className="divide-y divide-gray-150 text-xs">
              {orders.filter(o => o.buyerName === 'Siti Aminah' || o.buyerName === 'Budi Santoso').map(ord => (
                <div key={ord.id} className="p-4 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="font-bold text-gray-800">{ord.productName} (x{ord.quantity})</p>
                    <p className="text-[11px] text-gray-400">Lapak Penjual: {ord.sellerName}</p>
                    <p className="text-[11.5px] font-mono text-emerald-800">Total: Rp {ord.totalPrice.toLocaleString('id-ID')}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-full font-bold">
                    ✓ {ord.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ADMIN REVIEW TAB --- */}
      {activeTab === 'admin-review' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 leading-relaxed font-semibold">
              Warga yang mempublikasikan produk UMKM baru harus divalidasi oleh RT/RW atau Keamanan sebelum masuk tayang katalog publik, guna menghindari penipuan atau barang dilarang.
            </p>
          </div>

          <div className="bg-white border border-gray-150 rounded-xl overflow-hidden">
            <span className="bg-gray-50 p-3 border-b border-gray-150 block font-bold text-xs text-gray-400 uppercase">
              Antrean Peninjauan Jualan Warga ({products.filter(p => p.status === 'Review').length})
            </span>
            <div className="divide-y divide-gray-100 text-xs">
              {products.filter(p => p.status === 'Review').length === 0 ? (
                <p className="p-8 text-center text-gray-400">Tidak ada produk baru menunggu review.</p>
              ) : (
                products.filter(p => p.status === 'Review').map(prod => (
                  <div key={prod.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex gap-3 items-center">
                      <img referrerPolicy="no-referrer" src={prod.imageUrl} alt={prod.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0" />
                      <div>
                        <h5 className="font-extrabold text-sm text-gray-800">{prod.name}</h5>
                        <p className="text-gray-500 font-medium text-[11px]">Kategori: {prod.category} | Penjual: {prod.sellerName} ({prod.houseId})</p>
                        <p className="text-[11px] text-gray-400 italic line-clamp-1">{prod.description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateProductStatus(prod.id, 'Active')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                      >
                        Setujui Tayang
                      </button>
                      <button 
                        onClick={() => {
                          alert("Aset ditolak untuk ditayangkan.");
                        }}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- RENDER CHECKOUT DIALOG MODAL --- */}
      {buyingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            
            <div className="bg-emerald-600 text-white p-5">
              <span className="text-emerald-200 font-mono text-[9px] tracking-widest block font-bold uppercase">PROSES PEMESANAN</span>
              <h4 className="font-extrabold text-base">{buyingProduct.name}</h4>
              <p className="text-[11px] text-emerald-100">Lapak Jualan: {buyingProduct.sellerName}</p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 text-xs">
              <div className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-150">
                <img referrerPolicy="no-referrer" src={buyingProduct.imageUrl} alt={buyingProduct.name} className="w-14 h-14 object-cover rounded-md bg-white border border-gray-200" />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-gray-800">{buyingProduct.name}</h5>
                  <p className="text-[11px] text-gray-400">Harga Per Unit: Rp {buyingProduct.price.toLocaleString('id-ID')}</p>
                  <p className="font-extrabold text-emerald-700">Subtotal: Rp {(buyingProduct.price * orderQuantity).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-650 mb-1">Jumlah Porsi / Satuan Jasa *</label>
                <div className="flex gap-2 items-center">
                  <button 
                    type="button" 
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="w-8 h-8 rounded-lg bg-gray-200 font-bold text-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-gray-800 text-sm px-4">{orderQuantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="w-8 h-8 rounded-lg bg-gray-200 font-bold text-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-3">
                <span className="text-xs font-bold text-gray-500 block">Identitas Pembeli (Untuk Pengantaran)</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-0.5">Nama Anda *</label>
                    <input 
                      type="text" 
                      value={buyerName} 
                      onChange={e => setBuyerName(e.target.value)}
                      className="w-full border p-2 rounded text-xs" required 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-600 mb-0.5">Kapling Rumah *</label>
                    <input 
                      type="text" 
                      value={buyerHouseId} 
                      onChange={e => setBuyerHouseId(e.target.value)}
                      className="w-full border p-2 rounded text-xs" required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-600 mb-0.5">No. Whatsapp (Untuk Konfirmasi Lapak) *</label>
                  <input 
                    type="tel" 
                    value={buyerPhone} 
                    onChange={e => setBuyerPhone(e.target.value)}
                    className="w-full border p-2 rounded text-xs" required 
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setBuyingProduct(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Konfirmasi Beli & WA Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD PRODUCT MODAL FOR SELLER --- */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Buka Lapak UMKM Warga</h3>
              <p className="text-xs text-gray-500">Isi detail jajanan, menu masakan atau jasa rumah tangga Anda yang ingin dipromosikan.</p>
            </div>
            
            <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Jualan / Produk / Jasa *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Ketoprak Jakarta Cihuy" 
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Harga Warga (Rupiah) *</label>
                  <input 
                    type="number" 
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(Number(e.target.value))}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Kategori Jualan</label>
                  <select 
                    value={newProdCategory}
                    onChange={e => setNewProdCategory(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Jasa Rumah Tangga">Jasa Rumah Tangga</option>
                    <option value="Kebutuhan Harian">Kebutuhan Harian</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Link URL Foto Produk (Opsional)</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/your-food-image" 
                  value={newProdImage}
                  onChange={e => setNewProdImage(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Deskripsi Lengkap Jualan *</label>
                <textarea 
                  placeholder="Tuliskan varian rasa, porsi jualan, jam mulai masak atau jangkauan jasa anda..." 
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 h-20 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Ajukan untuk Review Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
