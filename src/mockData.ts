import { Resident, House, Payment, Visitor, Complaint, Product, Order, ForumThread, Polling, Facility, Booking, DirectoryItem, EmergencyNotice, GateLog } from './types';

export const initialHouses: House[] = [
  { id: 'A-01', block: 'Blok A', number: '01', status: 'Terisi', ownerName: 'Budi Santoso', type: 'Tipe 70 (Emerald)' },
  { id: 'A-02', block: 'Blok A', number: '02', status: 'Terisi', ownerName: 'Siti Aminah', type: 'Tipe 70 (Emerald)' },
  { id: 'A-03', block: 'Blok A', number: '03', status: 'Kosong', ownerName: '-', type: 'Tipe 45 (Sapphire)' },
  { id: 'A-04', block: 'Blok A', number: '04', status: 'Terisi', ownerName: 'Rian Hidayat', type: 'Tipe 45 (Sapphire)' },
  { id: 'A-05', block: 'Blok A', number: '05', status: 'Renovasi', ownerName: 'Taufik Hidayat', type: 'Tipe 90 (Diamond)' },
  
  { id: 'B-01', block: 'Blok B', number: '01', status: 'Terisi', ownerName: 'Hendry Wijaya', type: 'Tipe 45 (Sapphire)' },
  { id: 'B-02', block: 'Blok B', number: '02', status: 'Terisi', ownerName: 'Linda Permata', type: 'Tipe 45 (Sapphire)' },
  { id: 'B-03', block: 'Blok B', number: '03', status: 'Kosong', ownerName: '-', type: 'Tipe 45 (Sapphire)' },
  { id: 'B-04', block: 'Blok B', number: '04', status: 'Terisi', ownerName: 'Agus Salim', type: 'Tipe 70 (Emerald)' },
  { id: 'B-05', block: 'Blok B', number: '05', status: 'Terisi', ownerName: 'Dewi Kartika', type: 'Tipe 70 (Emerald)' },

  { id: 'C-01', block: 'Blok C', number: '01', status: 'Terisi', ownerName: 'Prasetyo Utomo', type: 'Tipe 36 (Ruby)' },
  { id: 'C-02', block: 'Blok C', number: '02', status: 'Terisi', ownerName: 'Yusuf Mansur', type: 'Tipe 36 (Ruby)' },
  { id: 'C-03', block: 'Blok C', number: '03', status: 'Terisi', ownerName: 'Amara Lopez', type: 'Tipe 45 (Sapphire)' },
  { id: 'C-04', block: 'Blok C', number: '04', status: 'Kosong', ownerName: '-', type: 'Tipe 36 (Ruby)' },
];

export const initialResidents: Resident[] = [
  {
    id: 'res-01',
    name: 'Budi Santoso',
    houseId: 'A-01',
    nik: '3273012345678001',
    kkNumber: '3273019876543210',
    phone: '081234567890',
    email: 'budi.santoso@gmail.com',
    role: 'Kepala Keluarga',
    status: 'Permanent',
    vehicles: [
      { type: 'Mobil', brand: 'Toyota Avanza White', plateNumber: 'B 1234 SNT' },
      { type: 'Motor', brand: 'Honda Vario Black', plateNumber: 'B 5678 SNH' }
    ],
    pets: [
      { type: 'Kucing', name: 'Milo', note: 'Kucing persia warna abu-abu' }
    ],
    relationship: 'Kepala Keluarga',
    marriageStatus: 'Kawin',
    fatherName: 'Suparno',
    motherName: 'Sumiati',
    birthPlace: 'Bandung',
    birthDate: '1980-05-12',
    gender: 'Laki-laki',
    religion: 'Islam',
    education: 'S1',
    job: 'Wiraswasta',
    rt: '01',
    rw: '03'
  },
  {
    id: 'res-02',
    name: 'Siti Aminah',
    houseId: 'A-02',
    nik: '3273012345678002',
    kkNumber: '3273019876543211',
    phone: '081398765432',
    email: 'siti.aminah@gmail.com',
    role: 'Kepala Keluarga',
    status: 'Permanent',
    vehicles: [
      { type: 'Mobil', brand: 'Honda HRV Grey', plateNumber: 'B 2345 AMN' }
    ],
    pets: [],
    relationship: 'Kepala Keluarga',
    marriageStatus: 'Kawin',
    fatherName: 'Muhidin',
    motherName: 'Aisyah',
    birthPlace: 'Jakarta',
    birthDate: '1983-11-20',
    gender: 'Perempuan',
    religion: 'Islam',
    education: 'S1',
    job: 'Ibu Rumah Tangga',
    rt: '01',
    rw: '03'
  },
  {
    id: 'res-03',
    name: 'Rian Hidayat',
    houseId: 'A-04',
    nik: '3273012345678003',
    kkNumber: '3273019876543212',
    phone: '085712345678',
    email: 'rian.hid@gmail.com',
    role: 'Kepala Keluarga',
    status: 'Kontrak',
    vehicles: [
      { type: 'Motor', brand: 'Yamaha NMAX Blue', plateNumber: 'D 3456 RIY' }
    ],
    pets: [
      { type: 'Anjing', name: 'Rocky', note: 'Golden Retriever ramah' }
    ],
    relationship: 'Kepala Keluarga',
    marriageStatus: 'Kawin',
    fatherName: 'Dahlan',
    motherName: 'Rina',
    birthPlace: 'Surabaya',
    birthDate: '1990-02-15',
    gender: 'Laki-laki',
    religion: 'Islam',
    education: 'SMA/SMK',
    job: 'Karyawan Swasta',
    rt: '01',
    rw: '03'
  },
  {
    id: 'res-04',
    name: 'Hendry Wijaya',
    houseId: 'B-01',
    nik: '3273012345678004',
    kkNumber: '3273019876543213',
    phone: '081223344556',
    email: 'hendry.wijaya@gmail.com',
    role: 'Kepala Keluarga',
    status: 'Permanent',
    vehicles: [
      { type: 'Mobil', brand: 'Mitsubishi Xpander Black', plateNumber: 'B 9012 HDY' }
    ],
    pets: [],
    relationship: 'Kepala Keluarga',
    marriageStatus: 'Kawin',
    fatherName: 'Suryono',
    motherName: 'Kartini',
    birthPlace: 'Tangerang',
    birthDate: '1975-08-22',
    gender: 'Laki-laki',
    religion: 'Islam',
    education: 'Diploma',
    job: 'PNS',
    rt: '02',
    rw: '03'
  },
  {
    id: 'res-05',
    name: 'Linda Permata',
    houseId: 'B-02',
    nik: '3273012345678005',
    kkNumber: '3273019876543214',
    phone: '081988887777',
    email: 'linda.permata@gmail.com',
    role: 'Kepala Keluarga',
    status: 'Permanent',
    vehicles: [],
    pets: [],
    relationship: 'Kepala Keluarga',
    marriageStatus: 'Belum Kawin',
    fatherName: 'Gunawan',
    motherName: 'Endang',
    birthPlace: 'Semarang',
    birthDate: '1994-04-30',
    gender: 'Perempuan',
    religion: 'Protestan',
    education: 'S1',
    job: 'Arsitek',
    rt: '02',
    rw: '03'
  },
  {
    id: 'res-06',
    name: 'Agus Salim',
    houseId: 'B-04',
    nik: '3273012345678006',
    kkNumber: '3273019876543215',
    phone: '087812123434',
    email: 'agus.salim@gmail.com',
    role: 'Kepala Keluarga',
    status: 'Permanent',
    vehicles: [
      { type: 'Mobil', brand: 'Toyota Fortuner White', plateNumber: 'B 17 AGS' },
      { type: 'Motor', brand: 'Vespa Sprint Yellow', plateNumber: 'B 1717 VSP' }
    ],
    pets: [],
    relationship: 'Kepala Keluarga',
    marriageStatus: 'Kawin',
    fatherName: 'Mulyadi',
    motherName: 'Sri',
    birthPlace: 'Yogyakarta',
    birthDate: '1978-10-05',
    gender: 'Laki-laki',
    religion: 'Islam',
    education: 'S2',
    job: 'Dosen',
    rt: '02',
    rw: '03'
  },
  {
    id: 'res-07',
    name: 'Ahmad Faisal',
    houseId: 'A-01',
    nik: '3273012345678009',
    kkNumber: '3273019876543210',
    phone: '081299991111',
    email: 'ahmad.faisal@gmail.com',
    role: 'Anggota Keluarga',
    status: 'Permanent',
    vehicles: [
      { type: 'Sepeda', brand: 'Polygon Mountain Bike', plateNumber: '-' }
    ],
    pets: [],
    relationship: 'Anak',
    marriageStatus: 'Belum Kawin',
    fatherName: 'Budi Santoso',
    motherName: 'Sumiati',
    birthPlace: 'Bandung',
    birthDate: '2010-07-24',
    gender: 'Laki-laki',
    religion: 'Islam',
    education: 'SMP',
    job: 'Pelajar',
    rt: '01',
    rw: '03'
  }
];

export const initialPayments: Payment[] = [
  // Mei 2026
  { id: 'pay-01', residentId: 'res-01', residentName: 'Budi Santoso', houseId: 'A-01', type: 'IPL', amount: 350000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-05', paymentMethod: 'Virtual Account BCA' },
  { id: 'pay-02', residentId: 'res-01', residentName: 'Budi Santoso', houseId: 'A-01', type: 'Air', amount: 125000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-05', paymentMethod: 'Virtual Account BCA' },
  { id: 'pay-03', residentId: 'res-01', residentName: 'Budi Santoso', houseId: 'A-01', type: 'Sampah', amount: 50000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-05', paymentMethod: 'Virtual Account BCA' },
  
  { id: 'pay-04', residentId: 'res-02', residentName: 'Siti Aminah', houseId: 'A-02', type: 'IPL', amount: 350000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-09', paymentMethod: 'QRIS Gopay' },
  { id: 'pay-05', residentId: 'res-02', residentName: 'Siti Aminah', houseId: 'A-02', type: 'Air', amount: 180000, month: 'Mei 2026', status: 'Belum Bayar', dueDate: '2026-05-10' },
  
  { id: 'pay-06', residentId: 'res-03', residentName: 'Rian Hidayat', houseId: 'A-04', type: 'IPL', amount: 250000, month: 'Mei 2026', status: 'Pending', dueDate: '2026-05-10', paymentMethod: 'Virtual Account Mandiri' },
  { id: 'pay-07', residentId: 'res-03', residentName: 'Rian Hidayat', houseId: 'A-04', type: 'Air', amount: 95000, month: 'Mei 2026', status: 'Pending', dueDate: '2026-05-10', paymentMethod: 'Virtual Account Mandiri' },
  
  { id: 'pay-08', residentId: 'res-04', residentName: 'Hendry Wijaya', houseId: 'B-01', type: 'IPL', amount: 250000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-02', paymentMethod: 'QRIS ShopeePay' },
  { id: 'pay-09', residentId: 'res-04', residentName: 'Hendry Wijaya', houseId: 'B-01', type: 'Air', amount: 154000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-02', paymentMethod: 'QRIS ShopeePay' },

  { id: 'pay-10', residentId: 'res-05', residentName: 'Linda Permata', houseId: 'B-02', type: 'IPL', amount: 250000, month: 'Mei 2026', status: 'Belum Bayar', dueDate: '2026-05-10' },
  { id: 'pay-11', residentId: 'res-06', residentName: 'Agus Salim', houseId: 'B-04', type: 'IPL', amount: 350000, month: 'Mei 2026', status: 'Lunas', dueDate: '2026-05-10', paidDate: '2026-05-04', paymentMethod: 'Virtual Account BCA' }
];

export const initialVisitors: Visitor[] = [
  {
    id: 'vis-01',
    hostHouseId: 'A-01',
    hostName: 'Budi Santoso',
    visitorName: 'Rudi Hermawan',
    phone: '081244455566',
    vehiclePlate: 'F 4567 JK',
    purpose: 'Keluarga berkunjung silaturahmi',
    expectedDate: '2026-05-20',
    qrCodeUrl: 'SMARTLIVING_VIS_01_CONFIRMED',
    status: 'Approved'
  },
  {
    id: 'vis-02',
    hostHouseId: 'B-04',
    hostName: 'Agus Salim',
    visitorName: 'Teknisi Biznet (Adi & Tim)',
    phone: '085522331100',
    vehiclePlate: 'B 9976 SJD',
    purpose: 'Instalasi internet wifi baru',
    expectedDate: '2026-05-20',
    qrCodeUrl: 'SMARTLIVING_VIS_02_CHECKED_IN',
    status: 'Checked In',
    checkInTime: '2026-05-20 08:15'
  },
  {
    id: 'vis-03',
    hostHouseId: 'B-02',
    hostName: 'Linda Permata',
    visitorName: 'Kurir Paket Shopee',
    phone: '082155443322',
    vehiclePlate: 'B 3321 PX',
    purpose: 'Mengantar paket baju',
    expectedDate: '2026-05-19',
    qrCodeUrl: 'SMARTLIVING_VIS_03_COMPLETED',
    status: 'Checked Out',
    checkInTime: '2026-05-19 14:20',
    checkOutTime: '2026-05-19 14:25'
  }
];

export const initialComplaints: Complaint[] = [
  {
    id: 'comp-01',
    reporterName: 'Siti Aminah',
    houseId: 'A-02',
    title: 'Lampu Jalan Mati Depan Rumah',
    category: 'Lampu Jalan',
    description: 'Lampu jalan tiang nomor 14 berkedip terus dan semalam mati total, sangat gelap di sekitar Blok A-02.',
    date: '2026-05-18',
    status: 'Diproses',
    imageUrl: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=400',
    assignedTechnician: 'Darno (Kelistrikan Kawasan)',
    progressUpdates: [
      { date: '2026-05-18 09:00', note: 'Tiket keluhan diterima dan divalidasi oleh Admin.', author: 'Admin' },
      { date: '2026-05-19 10:30', note: 'Ditugaskan ke Teknisi Darno. Sedang mempersiapkan bohlam LED pengganti.', author: 'Admin' }
    ]
  },
  {
    id: 'comp-02',
    reporterName: 'Budi Santoso',
    houseId: 'A-01',
    title: 'Pipa Air PAM Kompleks Merembes',
    category: 'Kebocoran',
    description: 'Ada air merembes terus dari saluran taman luar, membuat rumput becek dan genangan air.',
    date: '2026-05-15',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400',
    assignedTechnician: 'Wawan (Seksi Air & Pipa)',
    progressUpdates: [
      { date: '2026-05-15 14:00', note: 'Laporan kebocoran didaftarkan.', author: 'Admin' },
      { date: '2026-05-16 08:00', note: 'Teknisi Wawan menuju lokasi untuk penggantian pipa PVC 2 inch.', author: 'Wawan' },
      { date: '2026-05-16 11:30', note: 'Perbaikan selesai dilakukan. Koneksi pipa kuat dan becek telah dibersihkan.', author: 'Wawan' }
    ],
    rating: 5,
    reviewComment: 'Penanganan cepat dan teknisinya ramah! Terima kasih airnya tidak bocor lagi.'
  },
  {
    id: 'comp-03',
    reporterName: 'Rian Hidayat',
    houseId: 'A-04',
    title: 'Penumpukan Sampah Taman Blok A',
    category: 'Sampah',
    description: 'Petugas sampah perumahan belum mengangkut sampah taman selama 3 hari berturut-turut, bau mulai menyengat.',
    date: '2026-05-19',
    status: 'Baru',
    progressUpdates: [
      { date: '2026-05-19 16:45', note: 'Keluhan dilaporkan oleh warga.', author: 'Rian Hidayat' }
    ]
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-01',
    sellerId: 'res-01',
    sellerName: 'Budi Santoso (Dapur Pak Budi)',
    sellerPhone: '081234567890',
    houseId: 'A-01',
    name: 'Nasi Kebuli Ayam Rempah',
    price: 35000,
    category: 'Makanan',
    description: 'Nasi Kebuli hangat dengan porsi melimpah, ayam bakar rempah khas arab, lengkap dengan acar nanas dan sambal. Masak setiap hari sabtu & minggu pagi.',
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=400',
    status: 'Active'
  },
  {
    id: 'prod-02',
    sellerId: 'res-02',
    sellerName: 'Siti Aminah (Camilan Sehat)',
    sellerPhone: '081398765432',
    houseId: 'A-02',
    name: 'Puding Mangga Chia Seed',
    price: 15000,
    category: 'Makanan',
    description: 'Puding menyegarkan dari daging buah mangga harum manis murni, tanpa pengawet, ditaburi chia seed kaya serat. Dingin dan sehat.',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400',
    status: 'Active'
  },
  {
    id: 'prod-03',
    sellerId: 'res-05',
    sellerName: 'Linda Kitchen',
    sellerPhone: '081988887777',
    houseId: 'B-02',
    name: 'Jasa Setrika Wangi Kilat',
    price: 7000,
    category: 'Jasa Rumah Tangga',
    description: 'Jasa setrika baju per kg. Higienis, wangi downy tahan lama, disetrika rapi dan dilipat profesional. Bisa antar jemput khusus penghuni perumahan gratis.',
    imageUrl: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&q=80&w=400',
    status: 'Active'
  },
  {
    id: 'prod-04',
    sellerId: 'res-06',
    sellerName: 'Garasi Agus Salim',
    sellerPhone: '087812123434',
    houseId: 'B-04',
    name: 'Kopi Susu Gula Aren Literan',
    price: 65000,
    category: 'Minuman',
    description: 'Kopi arabica 100% ditambah krimer premium serta gula aren organik asli Jawa Barat. Kemasan botol 1 Liter, tahan 5 hari di kulkas.',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400',
    status: 'Active'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-01',
    productId: 'prod-01',
    productName: 'Nasi Kebuli Ayam Rempah',
    price: 35000,
    quantity: 2,
    totalPrice: 70000,
    buyerName: 'Siti Aminah',
    buyerPhone: '081398765432',
    buyerHouseId: 'A-02',
    sellerId: 'res-01',
    sellerName: 'Budi Santoso (Dapur Pak Budi)',
    status: 'Selesai',
    date: '2026-05-18 12:30'
  },
  {
    id: 'ord-02',
    productId: 'prod-03',
    productName: 'Jasa Setrika Wangi Kilat',
    price: 7000,
    quantity: 5,
    totalPrice: 35000,
    buyerName: 'Agus Salim',
    buyerPhone: '087812123434',
    buyerHouseId: 'B-04',
    sellerId: 'res-05',
    sellerName: 'Linda Kitchen',
    status: 'Diproses',
    date: '2026-05-20 09:10'
  }
];

export const initialForumThreads: ForumThread[] = [
  {
    id: 'thr-01',
    authorName: 'Ketua RW (Ir. H. Slamet Mulya)',
    authorRole: 'RT/RW',
    title: 'Kerja Bakti Akbar Menyambut Hari Lingkungan Hidup',
    content: 'Dihimbau kepada seluruh warga Blok A, B, dan C SmartLiving Residence untuk hadir dalam acara Kerja Bakti Akbar pada hari Ahad, 24 Mei 2026 pukul 07:00 WIB. Kita akan membersihkan saluran got utama, mencat pembatas jalan, dan menata tanaman taman depan. Jangan lupa membawa cangkul, sabit, atau sekop masing-masing. Konsumsi tumpeng makan siang ditanggung bersama kas sosial.',
    category: 'Pengumuman',
    date: '2026-05-19',
    likes: 12,
    comments: [
      { id: 'comm-11', authorName: 'Budi Santoso', authorRole: 'Warga', content: 'Siap hadir Pak RW! Saya bawakan sound system portable untuk memeriahkan suasana.', date: '2026-05-19 18:30' },
      { id: 'comm-12', authorName: 'Siti Aminah', authorRole: 'Warga', content: 'Insyaallah nanti dari Ibu-ibu PKK akan bantu siapkan gorengan dan teh hangat di posko.', date: '2026-05-19 19:15' }
    ]
  },
  {
    id: 'thr-02',
    authorName: 'Rian Hidayat',
    authorRole: 'Warga',
    title: 'INFO KEHILANGAN: Kucing Persia Putih (Mochi)',
    content: 'Tolong infonya warga sekalian, kucing kami si Mochi terlepas dari pagar kemarin malam sekitar jam 21:00 WIB. Ciri-ciri: bulu putih bersih lebat, mata biru bulat, memakai kalung lonceng warna merah muda bertuliskan nomor hp saya. Terakhir terlihat ke arah taman depan Balai Warga. Bagi yang menemukan atau melihat harap hubungi kami di Blok A-04, ada imbalan sepantasnya.',
    category: 'Kehilangan',
    date: '2026-05-20',
    likes: 5,
    comments: [
      { id: 'comm-21', authorName: 'Security Danang', authorRole: 'Security', content: 'Tadi menjelang subuh sempat melihat kucing putih mirip mochi di bawah kolong ruko depan dekat pos gerbang utama, nanti kami bantu pantau lewat kamera CCTV pos gerbang Mas Rian.', date: '2026-05-20 07:44' }
    ]
  },
  {
    id: 'thr-03',
    authorName: 'Dewi Kartika',
    authorRole: 'Warga',
    title: 'Donasi Sosial untuk Anak Yatim Piatu Yayasan Al-Fitrah',
    content: 'Mari salurkan sedekah dan donasi terbaik bapak ibu warga perumahan untuk anak-anak yatim piatu di Yayasan Al-Fitrah berupa sembako, buku bacaan layak pakai, pakaian anak, maupun dana segar. Pengumpulan bisa dikoordinasi di rumah kami Blok B-05 paling lambat hari Jum\'at depan.',
    category: 'Donasi',
    date: '2026-05-17',
    likes: 18,
    comments: []
  }
];

export const initialPollings: Polling[] = [
  {
    id: 'poll-01',
    question: 'Lokasi Terbaik untuk Pemasangan Canopy Fasilitas Playground Anak?',
    options: [
      { id: 'opt-1', text: 'Taman Blok A (Dekat Mushola)', votes: 14 },
      { id: 'opt-2', text: 'Taman Blok B (Tengah Kompleks)', votes: 23 },
      { id: 'opt-3', text: 'Area Samping Clubhouse', votes: 8 }
    ],
    votesCount: {
      'res-01': 'opt-2',
      'res-02': 'opt-2',
      'res-04': 'opt-2',
      'res-05': 'opt-1',
      'res-06': 'opt-2'
    },
    totalVotes: 45,
    dueDate: '2026-05-25'
  }
];

export const initialFacilities: Facility[] = [
  { id: 'fac-01', name: 'Balai Pertemuan Warga', description: 'Gedung serbaguna berukuran 12x18m dilengkapi soundsystem, 4 AC standing, panggung lipat, toilet bersih, serta 100 kursi futura. Cocok untuk acara resepsi, syukuran, atau musyawarah warga.', capacity: 150, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400', costPerHour: 150000 },
  { id: 'fac-02', name: 'Lapangan Futsal & Basket', description: 'Lapangan outdoor beralaskan beton halus berkombinasi dengan gawang futsal serta ring basket adjustable. Dilengkapi lampu sorot malam berkekuatan tinggi.', capacity: 30, imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=400', costPerHour: 50000 },
  { id: 'fac-03', name: 'Ruang Rapat VIP Clubhouse', description: 'Ruang AC private berkapasitas 15 orang, whiteboard kaca magnetis, TV LED Smart 55" untuk presentasi screen sharing, serta free flow air mineral.', capacity: 15, imageUrl: 'https://images.unsplash.com/photo-1431540015161-0ae868a2040b?auto=format&fit=crop&q=80&w=400', costPerHour: 75000 }
];

export const initialBookings: Booking[] = [
  { id: 'book-01', facilityId: 'fac-01', facilityName: 'Balai Pertemuan Warga', bookerName: 'Agus Salim', houseId: 'B-04', date: '2026-05-24', startTime: '10:00', endTime: '15:00', status: 'Disetujui', totalCost: 750000 },
  { id: 'book-02', facilityId: 'fac-02', facilityName: 'Lapangan Futsal & Basket', bookerName: 'Rian Hidayat', houseId: 'A-04', date: '2026-05-21', startTime: '19:00', endTime: '21:00', status: 'Pending', totalCost: 100000 }
];

export const initialDirectoryItems: DirectoryItem[] = [
  { id: 'dir-01', name: 'Klinik Medika Sehat 24 Jam', category: 'Klinik', phone: '(021) 8872-1234', address: 'Jl. Raya Sentosa No. 10 (200m di luar gerbang utama)', distance: '200m', hours: '24 Jam Non-Stop' },
  { id: 'dir-02', name: 'Bengkel Motor Setia Jaya', category: 'Bengkel', phone: '0812-8888-2231', address: 'Ruko Niaga Blok R3 No. 5 (Samping Indomaret gerbang)', distance: '50m', hours: '08:00 - 17:00' },
  { id: 'dir-03', name: 'Laundry Kiloan Bersih Rapi', category: 'Laundry', phone: '0856-1122-3344', address: 'Kavling sekitar RT 04, No. 8', distance: '150m', hours: '07:30 - 20:00' },
  { id: 'dir-04', name: 'Mesjid Jami\' Al-Muhajirin', category: 'Tempat Ibadah', phone: '-', address: 'Area Samping Fasum Taman Barat, Kawasan Perumahan', distance: '0m (Internal)', hours: 'Setiap Waktu Solat' },
  { id: 'dir-05', name: 'Supermarket Sembako FreshMart', category: 'UMKM Sekitar', phone: '021-8290123', address: 'Jl. Melati Blok G-12 (Warga Perumahan)', distance: '100m', hours: '06:00 - 21:00' }
];

export const initialEmergencyNotices: EmergencyNotice[] = [
  { id: 'em-01', title: 'Pemeliharaan Trafo Gardu PLN', content: 'Akan dilakukan pemeliharaan tegangan tinggi pada Trafo B gardu utama perumahan yang berakibat pemadaman listrik berkala hari Kamis, 21 Mei 2026 pukul 13:00 - 15:30 WIB. Mohon siapkan cadangan kelistrikan masing-masing.', type: 'Pekerjaan', date: '2026-05-20' },
  { id: 'em-02', title: 'Waspada Kejahatan Curanmor Malam Hari', content: 'Sehubungan dengan dilaporkannya aktivitas mencurigakan di luar jalan utama tadi malam, dihimbau warga mengunci ganda pintu pagar, menambah gembok pengaman kendaraan, dan tidak meninggalkan kunci kontak terpaut pada motor.', type: 'Bahaya', date: '2026-05-19' }
];

export const initialGateLogs: GateLog[] = [
  { id: 'log-01', timestamp: '2026-05-20 11:35:10', type: 'In', visitorName: 'Tamu Rudi Hermawan', vehiclePlate: 'F 4567 JK', gateName: 'Gerbang Utama Barat' },
  { id: 'log-02', timestamp: '2026-05-20 11:24:05', type: 'In', visitorName: 'GrabFood (Roni)', vehiclePlate: 'B 6101 PLM', gateName: 'Gerbang Utama Barat' },
  { id: 'log-03', timestamp: '2026-05-20 11:15:33', type: 'Out', visitorName: 'Kurir J&T (Banu)', vehiclePlate: 'B 4110 SSH', gateName: 'Gerbang Utama Barat' },
  { id: 'log-04', timestamp: '2026-05-20 10:48:12', type: 'Out', visitorName: 'Penghuni Budi Santoso', vehiclePlate: 'B 1234 SNT', gateName: 'Gerbang Utama Barat' }
];
