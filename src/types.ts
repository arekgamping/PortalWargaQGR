export type UserRole = 'Super Admin' | 'RT/RW' | 'Security' | 'Teknisi' | 'Warga' | 'UMKM' | 'Guest';

export interface Resident {
  id: string;
  name: string;
  houseId: string;
  nik: string;
  kkNumber: string;
  phone: string;
  email: string;
  role: 'Kepala Keluarga' | 'Anggota Keluarga';
  status: 'Permanent' | 'Kontrak';
  vehicles: Vehicle[];
  pets: Pet[];
  
  // New KK components from the image
  relationship?: 'Kepala Keluarga' | 'Suami' | 'Istri' | 'Anak' | 'Orang Tua' | 'Mertua' | 'Lainnya';
  marriageStatus?: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  fatherName?: string;
  motherName?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: 'Laki-laki' | 'Perempuan';
  religion?: 'Islam' | 'Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Khonghucu';
  education?: 'SD' | 'SMP' | 'SMA/SMK' | 'Diploma' | 'S1' | 'S2' | 'S3' | 'Tidak/Belum Sekolah';
  job?: string;
  rt?: string;
  rw?: string;
}

export interface House {
  id: string; // e.g. "A-12"
  block: string;
  number: string;
  status: 'Terisi' | 'Kosong' | 'Renovasi';
  ownerName: string;
  type: string; // e.g. "Tipe 45", "Tipe 70"
}

export interface Vehicle {
  type: 'Mobil' | 'Motor' | 'Sepeda';
  brand: string;
  plateNumber: string;
}

export interface Pet {
  type: string; // e.g. "Anjing", "Kucing"
  name: string;
  note: string;
}

export interface Payment {
  id: string;
  residentId: string;
  residentName: string;
  houseId: string;
  type: 'IPL' | 'Air' | 'Sampah' | 'Keamanan' | 'Event';
  amount: number;
  month: string; // e.g. "Mei 2026"
  status: 'Lunas' | 'Belum Bayar' | 'Pending';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface Visitor {
  id: string;
  hostHouseId: string;
  hostName: string;
  visitorName: string;
  phone: string;
  vehiclePlate: string;
  purpose: string;
  expectedDate: string;
  qrCodeUrl: string;
  status: 'Pending' | 'Approved' | 'Checked In' | 'Checked Out';
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Complaint {
  id: string;
  reporterName: string;
  houseId: string;
  title: string;
  category: 'Lampu Jalan' | 'Kebocoran' | 'Sampah' | 'Keamanan' | 'Fasilitas Umum' | 'Lainnya';
  description: string;
  date: string;
  status: 'Baru' | 'Diproses' | 'Selesai';
  imageUrl?: string;
  assignedTechnician?: string;
  progressUpdates: { date: string; note: string; author: string }[];
  rating?: number;
  reviewComment?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  houseId: string;
  name: string;
  price: number;
  category: 'Makanan' | 'Minuman' | 'Jasa Rumah Tangga' | 'Kebutuhan Harian' | 'Lainnya';
  description: string;
  imageUrl: string;
  status: 'Review' | 'Active' | 'Nonaktif';
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  buyerName: string;
  buyerPhone: string;
  buyerHouseId: string;
  sellerId: string;
  sellerName: string;
  status: 'Pending' | 'Diproses' | 'Selesai' | 'Dibatalkan';
  date: string;
}

export interface ForumThread {
  id: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  category: 'Diskusi' | 'Pengumuman' | 'Kehilangan' | 'Donasi' | 'Sosial';
  date: string;
  likes: number;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  date: string;
}

export interface Polling {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  votesCount: Record<string, string>; // userId -> optionId
  totalVotes: number;
  dueDate: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  costPerHour: number;
}

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  bookerName: string;
  houseId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  totalCost: number;
}

export interface DirectoryItem {
  id: string;
  name: string;
  category: 'Klinik' | 'Bengkel' | 'Laundry' | 'Tempat Ibadah' | 'UMKM Sekitar';
  phone: string;
  address: string;
  distance: string;
  hours: string;
}

export interface EmergencyNotice {
  id: string;
  title: string;
  content: string;
  type: 'Bahaya' | 'Informasi' | 'Pekerjaan';
  date: string;
}

export interface GateLog {
  id: string;
  timestamp: string;
  type: 'In' | 'Out';
  visitorName: string;
  vehiclePlate: string;
  gateName: string;
}
