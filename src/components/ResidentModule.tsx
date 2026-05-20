import React, { useState } from 'react';
import { Resident, House, UserRole, Vehicle, Pet } from '../types';
import { Users, Plus, Delete, Trash, Download, Filter, Search, User, CreditCard, Car, PawPrint, Eye, MapPin, Check, Edit, Award } from 'lucide-react';

interface ResidentModuleProps {
  role: UserRole;
  residents: Resident[];
  houses: House[];
  onAddResident: (resident: Resident) => void;
  onDeleteResident: (id: string) => void;
  onUpdateResident: (resident: Resident) => void;
}

export default function ResidentModule({
  role,
  residents,
  houses,
  onAddResident,
  onDeleteResident,
  onUpdateResident,
}: ResidentModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingKk, setViewingKk] = useState<Resident | null>(null);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  // Simulated access scope. Initial is 'RW' (entire RW view). For RT leadership simulation, can be changed.
  const [simulatedAccess, setSimulatedAccess] = useState<'RW' | 'RT-01' | 'RT-02' | 'RT-03'>('RW');

  // Advanced Sorting and Filtering state
  const [filterMarriage, setFilterMarriage] = useState<string>('Semua');
  const [filterGender, setFilterGender] = useState<string>('Semua');
  const [filterAgeCategory, setFilterAgeCategory] = useState<string>('Semua');
  const [filterEducation, setFilterEducation] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Form State
  const [name, setName] = useState('');
  const [houseId, setHouseId] = useState('');
  const [nik, setNik] = useState('');
  const [kkNumber, setKkNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [residentRole, setResidentRole] = useState<'Kepala Keluarga' | 'Anggota Keluarga'>('Kepala Keluarga');
  const [status, setStatus] = useState<'Permanent' | 'Kontrak'>('Permanent');
  
  // New KK components from the image
  const [relationship, setRelationship] = useState<'Kepala Keluarga' | 'Suami' | 'Istri' | 'Anak' | 'Orang Tua' | 'Mertua' | 'Lainnya'>('Kepala Keluarga');
  const [marriageStatus, setMarriageStatus] = useState<'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati'>('Belum Kawin');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [religion, setReligion] = useState<'Islam' | 'Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Khonghucu'>('Islam');
  const [education, setEducation] = useState<'SD' | 'SMP' | 'SMA/SMK' | 'Diploma' | 'S1' | 'S2' | 'S3' | 'Tidak/Belum Sekolah'>('S1');
  const [job, setJob] = useState('');
  const [rt, setRt] = useState('01');
  const [rw, setRw] = useState('03');
  
  // Vehicles & Pets inline creators inside form
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicleType, setNewVehicleType] = useState<'Mobil' | 'Motor' | 'Sepeda'>('Mobil');
  const [newVehicleBrand, setNewVehicleBrand] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');

  const [pets, setPets] = useState<Pet[]>([]);
  const [newPetType, setNewPetType] = useState('');
  const [newPetName, setNewPetName] = useState('');
  const [newPetNote, setNewPetNote] = useState('');

  const addVehicleToTempList = () => {
    if (!newVehicleBrand || !newVehiclePlate) return;
    setVehicles([...vehicles, { type: newVehicleType, brand: newVehicleBrand, plateNumber: newVehiclePlate }]);
    setNewVehicleBrand('');
    setNewVehiclePlate('');
  };

  const addPetToTempList = () => {
    if (!newPetType || !newPetName) return;
    setPets([...pets, { type: newPetType, name: newPetName, note: newPetNote }]);
    setNewPetType('');
    setNewPetName('');
    setNewPetNote('');
  };

  const resetForm = () => {
    setName('');
    setHouseId('');
    setNik('');
    setKkNumber('');
    setPhone('');
    setEmail('');
    setResidentRole('Kepala Keluarga');
    setStatus('Permanent');
    setVehicles([]);
    setPets([]);
    
    setRelationship('Kepala Keluarga');
    setMarriageStatus('Belum Kawin');
    setFatherName('');
    setMotherName('');
    setBirthPlace('');
    setBirthDate('');
    setGender('Laki-laki');
    setReligion('Islam');
    setEducation('S1');
    setJob('');
    setRt('01');
    setRw('03');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !houseId || !nik || !kkNumber || !phone) return;

    const newResident: Resident = {
      id: `res-${Date.now()}`,
      name,
      houseId,
      nik,
      kkNumber,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      role: residentRole,
      status,
      vehicles,
      pets,
      relationship,
      marriageStatus,
      fatherName,
      motherName,
      birthPlace,
      birthDate,
      gender,
      religion,
      education,
      job,
      rt,
      rw
    };

    onAddResident(newResident);
    resetForm();
    setShowAddModal(false);
  };

  // Helper to calculate age from birthDate string (Format: YYYY-MM-DD)
  const getAge = (birthDateStr?: string) => {
    if (!birthDateStr) return 35; // default fallback age
    const birthDate = new Date(birthDateStr);
    if (isNaN(birthDate.getTime())) return 35;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Helper to determine Age Group category
  const getAgeCategory = (age: number) => {
    if (age < 12) return 'Anak';
    if (age <= 18) return 'Remaja';
    if (age <= 55) return 'Dewasa';
    return 'Lansia';
  };

  // 1. FILTER OF AUTH/SCOPE ACCESS: RT/RW Role Segregation rules
  // "untuk admin dan RW dapat melihat data satu RW, sedangkan RT hanya dapat melihat data RT masing-masing"
  // Let's filter the allowed raw list of residents depending on the selected simulatedAccess:
  const residentsInAccessScope = residents.filter(res => {
    // If simulatedAccess is RW, they can see everyone (entire RW 03 which spans over RT 01, RT 02, RT 03 etc)
    if (simulatedAccess === 'RW') return true;
    
    // Otherwise, simulate a specific RT division
    const targetRtCode = simulatedAccess === 'RT-01' ? '01' : simulatedAccess === 'RT-02' ? '02' : '03';
    return (res.rt || '01') === targetRtCode;
  });

  // Calculate dynamic demographic stats based exclusively on the current access scope:
  const scopeStats = {
    total: residentsInAccessScope.length,
    // Marital Status counts
    married: residentsInAccessScope.filter(r => (r.marriageStatus || 'Kawin') === 'Kawin').length,
    single: residentsInAccessScope.filter(r => (r.marriageStatus || 'Belum Kawin') === 'Belum Kawin').length,
    divorcedAlive: residentsInAccessScope.filter(r => (r.marriageStatus || 'Kawin') === 'Cerai Hidup').length,
    divorcedDeceased: residentsInAccessScope.filter(r => (r.marriageStatus || 'Kawin') === 'Cerai Mati').length,
    // Gender counts
    male: residentsInAccessScope.filter(r => (r.gender || 'Laki-laki') === 'Laki-laki').length,
    female: residentsInAccessScope.filter(r => (r.gender || 'Laki-laki') === 'Perempuan').length,
    // Age Group counts
    toddlerAndKids: residentsInAccessScope.filter(r => getAge(r.birthDate) < 12).length,
    teenagers: residentsInAccessScope.filter(r => { const a = getAge(r.birthDate); return a >= 12 && a <= 18; }).length,
    adults: residentsInAccessScope.filter(r => { const a = getAge(r.birthDate); return a >= 19 && a <= 55; }).length,
    elderly: residentsInAccessScope.filter(r => getAge(r.birthDate) > 55).length,
    // Education counts
    unschooled: residentsInAccessScope.filter(r => (r.education || 'S1') === 'Tidak/Belum Sekolah').length,
    primary: residentsInAccessScope.filter(r => ['SD', 'SMP'].includes(r.education || 'S1')).length,
    secondary: residentsInAccessScope.filter(r => (r.education || 'S1') === 'SMA/SMK').length,
    diplomaDegree: residentsInAccessScope.filter(r => ['Diploma', 'S1'].includes(r.education || 'S1')).length,
    postgradDegree: residentsInAccessScope.filter(r => ['S2', 'S3'].includes(r.education || 'S1')).length,
  };

  // 2. APPLY COLUMN FILTERING & SORTING ON TOP OF SCOPED RESIDENTS
  const filteredAndSortedResidents = residentsInAccessScope.filter(res => {
    // Search query match (Search in name, NIK, KK, or houseId)
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.nik.includes(searchQuery) || 
                          res.kkNumber.includes(searchQuery) ||
                          res.houseId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // House ID filter match
    const matchesHouse = selectedHouseFilter === 'Semua' || res.houseId === selectedHouseFilter;
    
    // Marital Status filter match
    const matchesMarriage = filterMarriage === 'Semua' || (res.marriageStatus || 'Kawin') === filterMarriage;
    
    // Gender filter match
    const matchesGender = filterGender === 'Semua' || (res.gender || 'Laki-laki') === filterGender;
    
    // Education filter match
    const matchesEducation = filterEducation === 'Semua' || (res.education || 'S1') === filterEducation;

    // Age Category filter match
    const age = getAge(res.birthDate);
    let matchesAge = true;
    if (filterAgeCategory === 'Anak') {
      matchesAge = age < 12;
    } else if (filterAgeCategory === 'Remaja') {
      matchesAge = age >= 12 && age <= 18;
    } else if (filterAgeCategory === 'Dewasa') {
      matchesAge = age >= 19 && age <= 55;
    } else if (filterAgeCategory === 'Lansia') {
      matchesAge = age > 55;
    }

    return matchesSearch && matchesHouse && matchesMarriage && matchesGender && matchesEducation && matchesAge;
  }).sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'age-asc') {
      return getAge(a.birthDate) - getAge(b.birthDate);
    } else if (sortBy === 'age-desc') {
      return getAge(b.birthDate) - getAge(a.birthDate);
    } else if (sortBy === 'house-asc') {
      return a.houseId.localeCompare(b.houseId);
    }
    return 0;
  });

  // Short alias for old name compatibility in table rendering
  const filteredResidents = filteredAndSortedResidents;

  const availableHouses = houses.filter(h => h.status === 'Terisi' || h.status === 'Renovasi');

  // High-fidelity Excel (.xls) exporter
  const exportToExcel = () => {
    const headers = [
      'Nama Lengkap (Sesuai KTP)', 
      'NIK (16 Digit)', 
      'Nomor Kartu Keluarga (KK)', 
      'Hubungan Dalam Keluarga', 
      'Status Perkawinan', 
      'Nama Ayah', 
      'Nama Ibu', 
      'Tempat Lahir', 
      'Tanggal Lahir', 
      'Jenis kelamin', 
      'Agama', 
      'Pendidikan', 
      'Pekerjaan', 
      'RT', 
      'RW', 
      'Nomor Kapling', 
      'Nomor Whatsapp / No. HP', 
      'Status Kepemilikan Rumah', 
      'Aset Kendaraan', 
      'Hewan Peliharaan'
    ];
    
    // Construct real XLS-compatible spreadsheet via HTML XML schema that Excel opens natively
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Database Warga SmartLiving</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; }
          th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px; font-size: 12px; }
          td { border: 1px solid #cbd5e1; padding: 8px; font-size: 11px; color: #1e293b; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          /* CRITICAL: force string format so Excel doesn't translate 16-digit numbers in scientific notation or discard leading zeros */
          .txt-cell { mso-number-format:"\\@"; }
        </style>
      </head>
      <body>
        <h3 style="font-family:'Segoe UI',sans-serif; color:#1e3a8a; margin-bottom:5px;">DATABASE KEPENDUDUKAN & KARTU KELUARGA DIGITAL SMARTLIVING</h3>
        <p style="font-family:'Segoe UI',sans-serif; font-size:11px; margin-top:0; margin-bottom:15px; color:#64748b;">Tanggal Cetak: ${new Date().toLocaleString('id-ID')} | Total Jiwa: ${filteredResidents.length} KK/Warga</p>
        <table>
          <thead>
            <tr>
    `;
    
    headers.forEach(h => {
      html += `<th>${h}</th>`;
    });
    
    html += `
            </tr>
          </thead>
          <tbody>
    `;
    
    filteredResidents.forEach(r => {
      const vehiclesStr = r.vehicles && r.vehicles.length > 0 
        ? r.vehicles.map(v => `${v.type}: ${v.brand} (${v.plateNumber})`).join('; ') 
        : 'Tidak ada';
        
      const petsStr = r.pets && r.pets.length > 0 
        ? r.pets.map(p => `${p.type}: ${p.name} ${p.note ? `(${p.note})` : ''}`).join('; ') 
        : 'Tidak ada';
        
      const statusIndo = r.status === 'Permanent' ? 'Milik Sendiri (Tetap)' : 'Sewa / Kontrak';
      
      html += `
        <tr>
          <td class="font-bold">${r.name}</td>
          <td class="txt-cell">${r.nik}</td>
          <td class="txt-cell">${r.kkNumber}</td>
          <td>${r.relationship || r.role || 'Kepala Keluarga'}</td>
          <td>${r.marriageStatus || 'Kawin'}</td>
          <td>${r.fatherName || '-'}</td>
          <td>${r.motherName || '-'}</td>
          <td>${r.birthPlace || 'Yogyakarta'}</td>
          <td class="txt-cell">${r.birthDate || '1985-05-12'}</td>
          <td>${r.gender || 'Laki-laki'}</td>
          <td>${r.religion || 'Islam'}</td>
          <td>${r.education || 'S1'}</td>
          <td>${r.job || 'Swasta'}</td>
          <td class="text-center font-bold">${r.rt || '01'}</td>
          <td class="text-center font-bold">${r.rw || '03'}</td>
          <td class="text-center font-bold">${r.houseId}</td>
          <td class="txt-cell">${r.phone}</td>
          <td>${statusIndo}</td>
          <td>${vehiclesStr}</td>
          <td>${petsStr}</td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Data_Warga_SmartLiving_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hitung statistik warga secara dinamis per RT dan RW
  const rtStats: { [key: string]: number } = { 'RT 01': 0, 'RT 02': 0, 'RT 03': 0 };
  const rwStats: { [key: string]: number } = { 'RW 03': 0 };

  residents.forEach(res => {
    const block = res.houseId.split('-')[0]?.toUpperCase() || 'A';
    let rtName = 'RT 01';
    let rwName = 'RW 03';

    if (block === 'A') {
      rtName = 'RT 01';
      rwName = 'RW 03';
    } else if (block === 'B') {
      rtName = 'RT 02';
      rwName = 'RW 03';
    } else if (block === 'C') {
      rtName = 'RT 03';
      rwName = 'RW 03';
    } else {
      rtName = `RT ${block}`;
      rwName = 'RW 03'; // default rw
    }

    rtStats[rtName] = (rtStats[rtName] || 0) + 1;
    rwStats[rwName] = (rwStats[rwName] || 0) + 1;
  });

  return (
    <div id="resident-module-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Sistem Manajemen Warga</h2>
          <p className="text-xs text-gray-500">Database administrasi kependudukan terpusat dan Kartu Keluarga Digital</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            id="btn-export-residents"
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors rounded-xl border border-emerald-200 shadow-xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Export XLS (Excel)
          </button>
          
          {(role === 'Super Admin' || role === 'RT/RW' || role === 'Warga') && (
            <button 
              id="btn-open-add-resident"
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Registrasi Warga Baru
            </button>
          )}
        </div>
      </div>

      {/* SIMULATOR OTORISASI PERAN & AKSES WILAYAH */}
      <div id="simulated-role-authority-banner" className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-4.5 shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] bg-blue-500 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Akses Terkontrol</span>
            <span className="text-xs text-blue-200">Peran Aktif: <strong className="text-white text-xs font-bold">{simulatedAccess === 'RW' ? 'Super Admin / Ketua RW 03' : `Ketua ${simulatedAccess.replace('-', ' ')}`}</strong></span>
          </div>
          <h3 className="text-sm font-bold tracking-tight">
            {simulatedAccess === 'RW' 
              ? 'Melihat & Mengelola Data Kependudukan Seluruh RT (Satu Wilayah RW 03)' 
              : `Melihat & Mengelola Data Terbatas Khusus Wilayah ${simulatedAccess.replace('-', ' ')}`}
          </h3>
          <p className="text-[11px] text-slate-350">
            {simulatedAccess === 'RW' 
              ? 'Otoritas Admin & Ketua RW mandatori untuk melacak seluruh data demografi, sensus, status pernikahan dan pemetaan di seluruh RT.' 
              : `Akses dibatasi. Sesuai regulasi privasi, Ketua RT hanya memiliki wewenang untuk memeriksa & menyaring data warga di wilayah RT tersebut.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
          <div className="grid grid-cols-2 sm:flex gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 w-full sm:w-auto">
            <button
              onClick={() => { setSimulatedAccess('RW'); setSelectedHouseFilter('Semua'); }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${simulatedAccess === 'RW' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              RW / Admin
            </button>
            <button
              onClick={() => { setSimulatedAccess('RT-01'); setSelectedHouseFilter('Semua'); }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${simulatedAccess === 'RT-01' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Ketua RT 01
            </button>
            <button
              onClick={() => { setSimulatedAccess('RT-02'); setSelectedHouseFilter('Semua'); }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${simulatedAccess === 'RT-02' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Ketua RT 02
            </button>
            <button
              onClick={() => { setSimulatedAccess('RT-03'); setSelectedHouseFilter('Semua'); }}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${simulatedAccess === 'RT-03' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Ketua RT 03
            </button>
          </div>
        </div>
      </div>

      {/* PANEL ANALISIS DEMOGRAFI DINAMIS */}
      <div id="demographic-insights-dashboard" className="bg-slate-50/50 p-5 rounded-2xl border border-gray-150 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 block"></span>
              Statistik &amp; Demografi Kependudukan ({simulatedAccess === 'RW' ? 'Seluruh RW 03' : simulatedAccess.replace('-', ' ')})
            </h3>
            <p className="text-[11px] text-gray-550">Laporan sensus kependudukan termutakhir berdasarkan filter dan kelahiran warga</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200/60 rounded-full px-2.5 py-1">
              Data Sampel Wilayah: {scopeStats.total} Jiwa
            </span>
          </div>
        </div>

        {scopeStats.total === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs">
            Tidak ada data untuk menghitung statistik demografi karena tidak ada warga terdaftar dalam otoritas wilayah terpilih.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* CARD 1: STATUS PERNIKAHAN */}
            <div className="bg-white p-4 rounded-xl border border-gray-150/80 space-y-3 shadow-3xs">
              <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                <span className="text-xs font-black text-slate-800">Status Pernikahan</span>
                <span className="text-[10px] text-gray-400 font-mono">Sistem KK</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Menikah (Kawin)', count: scopeStats.married, color: 'bg-emerald-500' },
                  { label: 'Belum Menikah', count: scopeStats.single, color: 'bg-blue-500' },
                  { label: 'Cerai Hidup (Janda/Duda)', count: scopeStats.divorcedAlive, color: 'bg-amber-500' },
                  { label: 'Cerai Mati (Janda/Duda)', count: scopeStats.divorcedDeceased, color: 'bg-rose-500' }
                ].map((item, ip) => {
                  const pct = scopeStats.total > 0 ? Math.round((item.count / scopeStats.total) * 100) : 0;
                  return (
                    <div key={ip} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-gray-600 text-[10.5px] truncate max-w-[130px]">{item.label}</span>
                        <span className="font-bold text-gray-800 text-[10.5px] shrink-0">{item.count} org <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 2: STRUKTUR UMUR DEMOGRAFI */}
            <div className="bg-white p-4 rounded-xl border border-gray-150/80 space-y-3 shadow-3xs">
              <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                <span className="text-xs font-black text-slate-800">Struktur Kelompok Umur</span>
                <span className="text-[10px] text-gray-400 font-mono">Usia Sensus</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Balita & Anak (<12 th)', count: scopeStats.toddlerAndKids, color: 'bg-indigo-500' },
                  { label: 'Remaja (12 - 18 th)', count: scopeStats.teenagers, color: 'bg-teal-500' },
                  { label: 'Dewasa (19 - 55 th)', count: scopeStats.adults, color: 'bg-blue-600' },
                  { label: 'Lansia (>55 th)', count: scopeStats.elderly, color: 'bg-orange-500' }
                ].map((item, ip) => {
                  const pct = scopeStats.total > 0 ? Math.round((item.count / scopeStats.total) * 100) : 0;
                  return (
                    <div key={ip} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-gray-600 text-[10.5px]">{item.label}</span>
                        <span className="font-bold text-gray-800 text-[10.5px]">{item.count} org <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CARD 3: PROPORSI GENDER */}
            <div className="bg-white p-4 rounded-xl border border-gray-150/80 space-y-3 shadow-3xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-50 pb-1.5 mb-2.5">
                  <span className="text-xs font-black text-slate-800">Proporsi Gender</span>
                  <span className="text-[10px] text-gray-400 font-mono">Biometris</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-gray-600 text-[10.5px] flex items-center gap-1">
                        <span className="w-2 rounded-full h-2 bg-blue-500 inline-block"></span>
                        Laki-laki
                      </span>
                      <span className="font-bold text-gray-800 text-[10.5px]">{scopeStats.male} org <span className="text-blue-500">({scopeStats.total > 0 ? Math.round((scopeStats.male / scopeStats.total) * 100) : 0}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${scopeStats.total > 0 ? (scopeStats.male / scopeStats.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-gray-600 text-[10.5px] flex items-center gap-1">
                        <span className="w-2 rounded-full h-2 bg-pink-500 inline-block"></span>
                        Perempuan
                      </span>
                      <span className="font-bold text-gray-800 text-[10.5px]">{scopeStats.female} org <span className="text-pink-550">({scopeStats.total > 0 ? Math.round((scopeStats.female / scopeStats.total) * 100) : 0}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${scopeStats.total > 0 ? (scopeStats.female / scopeStats.total) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-1.5 flex items-center justify-between text-[10px] text-gray-500 border border-gray-100 mt-2">
                <span>Rasio Sex:</span>
                <span className="font-bold text-gray-700">
                  {scopeStats.female > 0 ? Math.round((scopeStats.male / scopeStats.female) * 100) : 100} (M per 100 F)
                </span>
              </div>
            </div>

            {/* CARD 4: TINGKAT PENDIDIKAN */}
            <div className="bg-white p-4 rounded-xl border border-gray-150/80 space-y-3 shadow-3xs">
              <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                <span className="text-xs font-black text-slate-800">Jenjang Pendidikan</span>
                <span className="text-[10px] text-gray-400 font-mono">Formal</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'SD / SMP / Belum', count: scopeStats.primary + scopeStats.unschooled, color: 'bg-emerald-450' },
                  { label: 'SMA / SMK Sederajat', count: scopeStats.secondary, color: 'bg-cyan-500' },
                  { label: 'Diploma / Sarjana (S1)', count: scopeStats.diplomaDegree, color: 'bg-blue-500' },
                  { label: 'Pascasarjana (S2/S3)', count: scopeStats.postgradDegree, color: 'bg-purple-600' }
                ].map((item, ip) => {
                  const pct = scopeStats.total > 0 ? Math.round((item.count / scopeStats.total) * 100) : 0;
                  return (
                    <div key={ip} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-semibold text-gray-500 truncate max-w-[125px]">{item.label}</span>
                        <span className="font-bold text-gray-850 shrink-0">{item.count} org <span className="text-gray-400 font-normal">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div className={`h-1 rounded-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-2xs space-y-3.5 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari warga berdasarkan nama, NIK, No. KK atau No. Rumah..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs font-semibold pl-10 pr-4 py-3 bg-gray-50/70 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 rounded-xl outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex gap-2 min-w-[220px]">
            <span className="flex items-center text-xs text-gray-500 font-bold shrink-0 gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-450" /> Rumah:
            </span>
            <select
              value={selectedHouseFilter}
              onChange={e => setSelectedHouseFilter(e.target.value)}
              className="w-full text-xs bg-gray-50/70 border border-gray-200 rounded-xl p-2.5 outline-none font-semibold text-gray-700 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Semua">Semua Kapling Rumah</option>
              {houses.map(h => (
                <option key={h.id} value={h.id}>{h.id} ({h.ownerName})</option>
              ))}
            </select>
          </div>
        </div>

        {/* BARIS KEDUA: MULTI-KOLOM SORTIR & SEGREGASI FISKAL/DEMOGRAFI */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-gray-100 pt-3">
          {/* FILTER STATUS KAWIN */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status Perkawinan</label>
            <select
              value={filterMarriage}
              onChange={e => setFilterMarriage(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-150 rounded-lg p-2 outline-none font-bold text-gray-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="Semua">Semua Status</option>
              <option value="Kawin">Menikah (Kawin)</option>
              <option value="Belum Kawin">Belum Menikah</option>
              <option value="Cerai Hidup">Cerai Hidup (Janda/Duda)</option>
              <option value="Cerai Mati">Cerai Mati (Janda/Duda)</option>
            </select>
          </div>

          {/* FILTER USIA */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Grup Usia</label>
            <select
              value={filterAgeCategory}
              onChange={e => setFilterAgeCategory(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-150 rounded-lg p-2 outline-none font-bold text-gray-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="Semua">Semua Grup Usia</option>
              <option value="Anak">Anak-Anak (&lt; 12 Th)</option>
              <option value="Remaja">Remaja (12 - 18 Th)</option>
              <option value="Dewasa">Dewasa (19 - 55 Th)</option>
              <option value="Lansia">Lansia (&gt; 55 Th)</option>
            </select>
          </div>

          {/* FILTER GENDER */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Jenis Kelamin</label>
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-150 rounded-lg p-2 outline-none font-bold text-gray-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* FILTER PENDIDIKAN */}
          <div className="space-y-1">
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Pendidikan</label>
            <select
              value={filterEducation}
              onChange={e => setFilterEducation(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-150 rounded-lg p-2 outline-none font-bold text-gray-700 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="Semua">Semua Pendidikan</option>
              <option value="Tidak/Belum Sekolah">Belum Sekolah</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA / SMK</option>
              <option value="Diploma">Diploma</option>
              <option value="S1">S1 (Sarjana)</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          {/* SORT ORDER SELECT */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Sortir Kolom</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full text-xs bg-blue-50 border border-blue-100 rounded-lg p-2 outline-none font-extrabold text-blue-800 cursor-pointer focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="name-asc">Nama Abjad (A - Z)</option>
              <option value="name-desc">Nama Abjad (Z - A)</option>
              <option value="age-asc">Usia Terendah (Muda - Tua)</option>
              <option value="age-desc">Usia Tertinggi (Tua - Muda)</option>
              <option value="house-asc">Lokasi Kapling Rumah</option>
            </select>
          </div>
        </div>

        {/* ACTIVE FILTER BADGES FOR SPEEDY RESET */}
        {(filterMarriage !== 'Semua' || filterGender !== 'Semua' || filterAgeCategory !== 'Semua' || filterEducation !== 'Semua' || searchQuery !== '' || selectedHouseFilter !== 'Semua') && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-dashed border-gray-100">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mr-1">Filter Terpasang ({filteredResidents.length} Hasil):</span>
            {searchQuery !== '' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                Kata kunci: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 font-extrabold text-xs">&times;</button>
              </span>
            )}
            {selectedHouseFilter !== 'Semua' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded-md font-bold">
                Kapling: {selectedHouseFilter}
                <button onClick={() => setSelectedHouseFilter('Semua')} className="text-blue-400 hover:text-blue-600 font-extrabold text-xs">&times;</button>
              </span>
            )}
            {filterMarriage !== 'Semua' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 rounded-md font-bold">
                Status: {filterMarriage}
                <button onClick={() => setFilterMarriage('Semua')} className="text-emerald-400 hover:text-emerald-600 font-extrabold text-xs">&times;</button>
              </span>
            )}
            {filterGender !== 'Semua' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-800 border border-rose-150 px-2 py-0.5 rounded-md font-bold">
                Gender: {filterGender}
                <button onClick={() => setFilterGender('Semua')} className="text-rose-400 hover:text-rose-600 font-extrabold text-xs">&times;</button>
              </span>
            )}
            {filterAgeCategory !== 'Semua' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-teal-50 text-teal-800 border border-teal-150 px-2 py-0.5 rounded-md font-bold">
                Usia: {filterAgeCategory}
                <button onClick={() => setFilterAgeCategory('Semua')} className="text-teal-400 hover:text-teal-600 font-extrabold text-xs">&times;</button>
              </span>
            )}
            {filterEducation !== 'Semua' && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-800 border border-purple-150 px-2 py-0.5 rounded-md font-bold">
                Pendidikan: {filterEducation}
                <button onClick={() => setFilterEducation('Semua')} className="text-purple-400 hover:text-purple-600 font-extrabold text-xs">&times;</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterMarriage('Semua');
                setFilterGender('Semua');
                setFilterAgeCategory('Semua');
                setFilterEducation('Semua');
                setSelectedHouseFilter('Semua');
              }}
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer ml-auto"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* RESIDENTS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-4">Nama & NIK</th>
                <th className="p-4">Kapling / No. Rumah</th>
                <th className="p-4">Kontak & Hubungan</th>
                <th className="p-4">Status Tinggal</th>
                <th className="p-4">Aset & Hewan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-400">
                    Tidak ada warga yang terdata atau cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredResidents.map(res => {
                  return (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                            {res.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-gray-800 text-sm">{res.name}</h4>
                            <p className="text-[10px] text-gray-400 font-mono tracking-wider mt-0.5">NIK {res.nik}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-lg border border-blue-100 font-bold">
                          {res.houseId}
                        </span>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <p className="text-gray-800 text-[11px]">{res.phone}</p>
                        <p className="text-gray-400 text-[10px] lowercase truncate max-w-[150px]">{res.email}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${res.role === 'Kepala Keluarga' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-gray-50 text-gray-600'}`}>
                          {res.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold ${
                          res.status === 'Permanent' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {res.status === 'Permanent' ? 'Tetap' : 'Kontrak'}
                        </span>
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <Car className="w-3.5 h-3.5 text-gray-400" />
                          <span>{res.vehicles.length} Kendaraan</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <PawPrint className="w-3.5 h-3.5 text-gray-400" />
                          <span>{res.pets.length} Peliharaan</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setViewingKk(res)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-[10px] font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Kartu Keluarga
                          </button>
                          <button 
                            onClick={() => setEditingResident(res)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-amber-100"
                            title="Edit Data Warga"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {(role === 'Super Admin' || role === 'RT/RW') && (
                            <button 
                              onClick={() => onDeleteResident(res.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash className="w-3.5 h-3.5" />
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

      {/* VIEW KK MODAL */}
      {viewingKk && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-5xl overflow-hidden shadow-2xl relative">
            <div className="bg-blue-850 text-white p-5 space-y-1">
              <span className="text-white/70 font-mono tracking-widest text-[10px] uppercase font-bold block text-center sm:text-left">REPUBLIK INDONESIA</span>
              <h3 className="text-lg font-black tracking-tight uppercase text-center sm:text-left">KARTU KELUARGA DIGITAL</h3>
              <p className="text-xs font-mono text-blue-200 text-center sm:text-left">No. KK: {viewingKk.kkNumber}</p>
            </div>
            
            <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
              {/* KK UPPER METADATA SECTION */}
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block uppercase text-[10px] font-bold">Kepala Keluarga</span>
                  <span className="font-extrabold text-gray-800">{residents.find(r => r.houseId === viewingKk.houseId && (r.relationship === 'Kepala Keluarga' || r.role === 'Kepala Keluarga'))?.name || viewingKk.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px] font-bold">Nomor Kapling</span>
                  <span className="font-extrabold text-gray-800">SmartLiving Kavling {viewingKk.houseId}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px] font-bold">RT / RW</span>
                  <span className="font-extrabold text-gray-850">RT {viewingKk.rt || '01'} / RW {viewingKk.rw || '03'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px] font-bold">Kepemilikan Rumah</span>
                  <span className="font-extrabold text-blue-700">{viewingKk.status === 'Permanent' ? 'Milik Sendiri (Tetap)' : 'Sewa / Kontrak'}</span>
                </div>
              </div>

              {/* DETAILED KK INDIVIDUAL RECORDS TABLE */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                <span className="bg-blue-900 text-white px-3 py-2 block font-extrabold text-[10px] uppercase tracking-wider">
                  Daftar Anggota Keluarga Sesuai Akta Kelahiran &amp; KK
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                        <th className="p-2 border-r border-gray-200 text-center">No.</th>
                        <th className="p-2 border-r border-gray-200">Nama Lengkap &amp; NIK</th>
                        <th className="p-2 border-r border-gray-200">Hubungan Keluarga</th>
                        <th className="p-2 border-r border-gray-200 text-center">Jenis Kelamin</th>
                        <th className="p-2 border-r border-gray-200">Tempat, Tgl Lahir</th>
                        <th className="p-2 border-r border-gray-200">Agama</th>
                        <th className="p-2 border-r border-gray-200 text-center">Pendidikan</th>
                        <th className="p-2 border-r border-gray-200">Pekerjaan</th>
                        <th className="p-2 border-r border-gray-200 text-center">Status Kawin</th>
                        <th className="p-2 border-r border-gray-200">Nama Ayah</th>
                        <th className="p-2">Nama Ibu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 text-gray-700 font-medium bg-white">
                      {residents.filter(r => r.houseId === viewingKk.houseId).map((member, index) => (
                        <tr key={member.id} className="hover:bg-blue-50/20 transition-colors">
                          <td className="p-2 border-r border-gray-150 text-center font-mono text-gray-400">{index + 1}</td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap">
                            <span className="font-bold text-gray-900 block">{member.name}</span>
                            <span className="text-[9px] text-gray-400 font-mono tracking-wider">{member.nik}</span>
                          </td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded font-bold text-[9px] uppercase">
                              {member.relationship || member.role || 'Kepala Keluarga'}
                            </span>
                          </td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap text-center">{member.gender || 'Laki-laki'}</td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap">
                            {member.birthPlace || 'Yogyakarta'}, 
                            <span className="block font-mono text-[9px] text-gray-500">{member.birthDate || '1985-05-12'}</span>
                          </td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap">{member.religion || 'Islam'}</td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap text-center text-gray-600">{member.education || 'S1'}</td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap text-gray-600">{member.job || 'Swasta'}</td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap text-center">{member.marriageStatus || 'Kawin'}</td>
                          <td className="p-2 border-r border-gray-150 whitespace-nowrap text-gray-500">{member.fatherName || '-'}</td>
                          <td className="p-2 whitespace-nowrap text-gray-500">{member.motherName || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assets & Animals section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="border border-gray-150 rounded-xl p-3.5 space-y-2 bg-gray-50/50">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200/60 pb-1.5">
                    <Car className="w-4 h-4 text-emerald-600" /> Aset Kendaraan Terdaftar:
                  </span>
                  {viewingKk.vehicles.length === 0 ? (
                    <p className="text-[11px] text-gray-400">Belum mendaftarkan kendaraan.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {viewingKk.vehicles.map((v, i) => (
                        <div key={i} className="bg-white border border-gray-150 p-2 rounded text-[11px] flex justify-between shadow-2xs">
                          <span className="font-bold text-gray-700">{v.brand} ({v.type})</span>
                          <span className="font-mono bg-blue-50 px-1.5 border border-blue-200 text-blue-700 font-bold rounded">{v.plateNumber}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-gray-150 rounded-xl p-3.5 space-y-2 bg-gray-50/50">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 border-b border-gray-200/60 pb-1.5">
                    <PawPrint className="w-4 h-4 text-amber-600" /> Hewan Peliharaan:
                  </span>
                  {viewingKk.pets.length === 0 ? (
                    <p className="text-[11px] text-gray-400">Tidak ada peliharaan terdaftar.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {viewingKk.pets.map((p, i) => (
                        <div key={i} className="bg-white border border-gray-150 p-2 rounded text-[11px] flex justify-between shadow-2xs">
                          <div>
                            <span className="font-bold text-gray-700">{p.name} </span>
                            <span className="text-gray-400 text-[10px]">({p.type})</span>
                          </div>
                          <span className="text-[10px] text-gray-550 italic truncate max-w-[150px]">{p.note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-2">
              <button 
                onClick={() => {
                  const currentKk = viewingKk;
                  setViewingKk(null);
                  setEditingResident(currentKk);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                Perbarui Data KK
              </button>
              <button 
                onClick={() => setViewingKk(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Tutup Kartu Keluarga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RESIDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Registrasi Warga & Rumah Baru</h3>
              <p className="text-xs text-gray-500">Isi data lengkap kependudukan berikut untuk diajukan ke Admin/RT</p>
            </div>
            
            <form onSubmit={handleAddSubmit} className="max-h-[500px] overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap (Sesuai KTP) *</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Budi Susanto" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Kapling Rumah (Selesai Beli/Sewa) *</label>
                  <select
                    value={houseId}
                    onChange={e => setHouseId(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    required
                  >
                    <option value="">-- Pilih Rumah --</option>
                    {houses.map(h => (
                      <option key={h.id} value={h.id}>{h.id} - {h.type} ({h.status})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Induk Kependudukan (NIK) *</label>
                  <input 
                    type="text" 
                    maxLength={16}
                    placeholder="16 Digit NIK KTP Anda" 
                    value={nik}
                    onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-mono border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Kartu Keluarga (KK) *</label>
                  <input 
                    type="text" 
                    maxLength={16}
                    placeholder="16 Digit Nomor KK Anda" 
                    value={kkNumber}
                    onChange={e => setKkNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-mono border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Whatsapp Aktif *</label>
                  <input 
                    type="tel" 
                    placeholder="Contoh: 081299990000" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Alamat Email (Opsional)</label>
                  <input 
                    type="email" 
                    placeholder="budi@gmail.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-blue-100 rounded-xl p-4 bg-blue-50/10">
                <div className="col-span-2 md:col-span-3">
                  <span className="text-xs font-extrabold text-blue-900 block border-b border-blue-100 pb-1">Detail Hubungan &amp; Kependudukan KK</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Hubungan Keluarga</label>
                  <select
                    value={relationship}
                    onChange={e => {
                      setRelationship(e.target.value as any);
                      if (e.target.value === 'Kepala Keluarga') {
                        setResidentRole('Kepala Keluarga');
                      } else {
                        setResidentRole('Anggota Keluarga');
                      }
                    }}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="Kepala Keluarga">Kepala Keluarga</option>
                    <option value="Suami">Suami</option>
                    <option value="Istri">Istri</option>
                    <option value="Anak">Anak</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Mertua">Mertua</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Status Perkawinan</label>
                  <select
                    value={marriageStatus}
                    onChange={e => setMarriageStatus(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Status Domisili</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="Permanent">Milik Sendiri (Tetap)</option>
                    <option value="Kontrak">Sewa / Kontrak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Agama</label>
                  <select
                    value={religion}
                    onChange={e => setReligion(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Protestan">Protestan</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Pendidikan Terakhir</label>
                  <select
                    value={education}
                    onChange={e => setEducation(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="Diploma">Diploma</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    placeholder="Contoh: Yogyakarta"
                    value={birthPlace}
                    onChange={e => setBirthPlace(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    placeholder="Karyawan Swasta, PNS, dsb"
                    value={job}
                    onChange={e => setJob(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Nama Kandung Ayah</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap ayah kandung"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Nama Kandung Ibu</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap ibu kandung"
                    value={motherName}
                    onChange={e => setMotherName(e.target.value)}
                    className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Wilayah RT</label>
                    <input
                      type="text"
                      placeholder="Contoh: 01"
                      value={rt}
                      onChange={e => setRt(e.target.value)}
                      className="w-full text-xs font-mono font-bold text-center border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">RW</label>
                    <input
                      type="text"
                      value={rw}
                      onChange={e => setRw(e.target.value)}
                      className="w-full text-xs font-mono font-bold text-center border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              {/* Temp vehicle list creation */}
              <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <span className="text-xs font-bold text-gray-700 block">Aset Kendaraan Penghuni (Opsional)</span>
                <div className="grid grid-cols-3 gap-2">
                  <select 
                    value={newVehicleType}
                    onChange={e => setNewVehicleType(e.target.value as any)}
                    className="text-xs bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                  >
                    <option value="Mobil">Mobil</option>
                    <option value="Motor">Motor</option>
                    <option value="Sepeda">Sepeda</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Merk (Contoh: Avanza Hitam)" 
                    value={newVehicleBrand}
                    onChange={e => setNewVehicleBrand(e.target.value)}
                    className="text-xs bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Pelat No (B 1234 XY)" 
                    value={newVehiclePlate}
                    onChange={e => setNewVehiclePlate(e.target.value.toUpperCase())}
                    className="text-xs bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={addVehicleToTempList}
                  className="w-full text-[11px] py-1 bg-white text-blue-600 border border-blue-200 font-bold hover:bg-blue-50 transition-colors rounded-lg"
                >
                  Tambahkan Kendaraan
                </button>
                {vehicles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {vehicles.map((v, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-medium">
                        {v.brand} ({v.plateNumber})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Temp Pet list creation */}
              <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <span className="text-xs font-bold text-gray-700 block">Hewan Peliharaan di Rumah (Opsional)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Jenis (Kucing, Anjing)" 
                    value={newPetType}
                    onChange={e => setNewPetType(e.target.value)}
                    className="text-xs bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Nama Hewan (Milo)" 
                    value={newPetName}
                    onChange={e => setNewPetName(e.target.value)}
                    className="text-xs bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Catatan (Bulunya Putih)" 
                    value={newPetNote}
                    onChange={e => setNewPetNote(e.target.value)}
                    className="text-xs bg-white border border-gray-300 p-1.5 rounded-lg outline-none"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={addPetToTempList}
                  className="w-full text-[11px] py-1 bg-white text-blue-600 border border-blue-200 font-bold hover:bg-blue-50 transition-colors rounded-lg"
                >
                  Tambahkan Peliharaan
                </button>
                {pets.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pets.map((p, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-medium">
                        {p.name} ({p.type})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Konfirmasi Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingResident && (
        <EditResidentModal
          resident={editingResident}
          houses={houses}
          onClose={() => setEditingResident(null)}
          onUpdate={(updated) => {
            onUpdateResident(updated);
            setEditingResident(null);
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// EDIT RESIDENT MODAL COMPONENT (SUB-MODULE)
// ==========================================
interface EditResidentModalProps {
  resident: Resident;
  houses: House[];
  onClose: () => void;
  onUpdate: (updated: Resident) => void;
}

function EditResidentModal({ resident, houses, onClose, onUpdate }: EditResidentModalProps) {
  const [name, setName] = useState(resident.name);
  const [houseId, setHouseId] = useState(resident.houseId);
  const [nik, setNik] = useState(resident.nik);
  const [kkNumber, setKkNumber] = useState(resident.kkNumber);
  const [phone, setPhone] = useState(resident.phone);
  const [email, setEmail] = useState(resident.email || '');
  const [residentRole, setResidentRole] = useState<'Kepala Keluarga' | 'Anggota Keluarga'>(resident.role);
  const [status, setStatus] = useState<'Permanent' | 'Kontrak'>(resident.status);
  
  const [relationship, setRelationship] = useState<'Kepala Keluarga' | 'Suami' | 'Istri' | 'Anak' | 'Orang Tua' | 'Mertua' | 'Lainnya'>(resident.relationship || 'Kepala Keluarga');
  const [marriageStatus, setMarriageStatus] = useState<'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati'>(resident.marriageStatus || 'Kawin');
  const [fatherName, setFatherName] = useState(resident.fatherName || '');
  const [motherName, setMotherName] = useState(resident.motherName || '');
  const [birthPlace, setBirthPlace] = useState(resident.birthPlace || '');
  const [birthDate, setBirthDate] = useState(resident.birthDate || '');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>(resident.gender || 'Laki-laki');
  const [religion, setReligion] = useState<'Islam' | 'Protestan' | 'Katolik' | 'Hindu' | 'Buddha' | 'Khonghucu'>(resident.religion || 'Islam');
  const [education, setEducation] = useState<'SD' | 'SMP' | 'SMA/SMK' | 'Diploma' | 'S1' | 'S2' | 'S3' | 'Tidak/Belum Sekolah'>(resident.education || 'S1');
  const [job, setJob] = useState(resident.job || '');
  const [rt, setRt] = useState(resident.rt || '01');
  const [rw, setRw] = useState(resident.rw || '03');

  const [vehicles, setVehicles] = useState<Vehicle[]>(resident.vehicles || []);
  const [newVehicleType, setNewVehicleType] = useState<'Mobil' | 'Motor' | 'Sepeda'>('Mobil');
  const [newVehicleBrand, setNewVehicleBrand] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');

  const [pets, setPets] = useState<Pet[]>(resident.pets || []);
  const [newPetType, setNewPetType] = useState('');
  const [newPetName, setNewPetName] = useState('');
  const [newPetNote, setNewPetNote] = useState('');

  const addVehicle = () => {
    if (!newVehicleBrand || !newVehiclePlate) return;
    setVehicles([...vehicles, { type: newVehicleType, brand: newVehicleBrand, plateNumber: newVehiclePlate }]);
    setNewVehicleBrand('');
    setNewVehiclePlate('');
  };

  const removeVehicle = (idx: number) => {
    setVehicles(vehicles.filter((_, i) => i !== idx));
  };

  const addPet = () => {
    if (!newPetType || !newPetName) return;
    setPets([...pets, { type: newPetType, name: newPetName, note: newPetNote }]);
    setNewPetType('');
    setNewPetName('');
    setNewPetNote('');
  };

  const removePet = (idx: number) => {
    setPets(pets.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !houseId || !nik || !kkNumber || !phone) return;

    onUpdate({
      ...resident,
      name,
      houseId,
      nik,
      kkNumber,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      role: residentRole,
      status,
      vehicles,
      pets,
      relationship,
      marriageStatus,
      fatherName,
      motherName,
      birthPlace,
      birthDate,
      gender,
      religion,
      education,
      job,
      rt,
      rw
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-2xl overflow-hidden shadow-2xl relative">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-amber-50/50">
          <div>
            <h3 className="text-sm font-black text-amber-95 tracking-tight flex items-center gap-2">
              <Edit className="w-4 h-4 text-amber-600" /> Perbarui Data Warga &amp; KK
            </h3>
            <p className="text-[11px] text-gray-500 font-medium font-semibold text-amber-900">Lengkapi No KK, No WA, kendaraan, status tinggal, dan hewan peliharaan warga</p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg px-2"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="max-h-[500px] overflow-y-auto p-6 space-y-5">
          {/* Section 1: Data Diri */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-850 border-b border-amber-100 pb-1">1. Informasi Identitas Pokok</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-650 mb-1">Nama Lengkap (Sesuai KTP) *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-650 mb-1">Kapling Rumah *</label>
                <select
                  value={houseId}
                  onChange={e => setHouseId(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-750"
                  required
                >
                  {houses.map(h => (
                    <option key={h.id} value={h.id}>{h.id} - {h.type} ({h.status})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-650 mb-1">Nomor Induk Kependudukan (NIK) *</label>
                <input 
                  type="text" 
                  maxLength={16}
                  value={nik}
                  onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-650 mb-1">Nomor Kartu Keluarga (KK) *</label>
                <input 
                  type="text" 
                  maxLength={16}
                  value={kkNumber}
                  onChange={e => setKkNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs font-mono border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kontak & Hubungan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-850 border-b border-amber-100 pb-1">2. Kontak &amp; Status Domisili</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-655 mb-1">Nomor Whatsapp Aktif *</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-655 mb-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-amber-150 rounded-xl p-4 bg-amber-50/10 mt-2">
              <div className="col-span-2 sm:col-span-3">
                <span className="text-xs font-bold text-amber-900 block border-b border-amber-200/55 pb-1">Detail Hubungan &amp; Kependudukan KK</span>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Hubungan Keluarga</label>
                <select
                  value={relationship}
                  onChange={e => {
                    setRelationship(e.target.value as any);
                    if (e.target.value === 'Kepala Keluarga') {
                      setResidentRole('Kepala Keluarga');
                    } else {
                      setResidentRole('Anggota Keluarga');
                    }
                  }}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 bg-white"
                >
                  <option value="Kepala Keluarga">Kepala Keluarga</option>
                  <option value="Suami">Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Mertua">Mertua</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Status Perkawinan</label>
                <select
                  value={marriageStatus}
                  onChange={e => setMarriageStatus(e.target.value as any)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 bg-white"
                >
                  <option value="Belum Kawin">Belum Kawin</option>
                  <option value="Kawin">Kawin</option>
                  <option value="Cerai Hidup">Cerai Hidup</option>
                  <option value="Cerai Mati">Cerai Mati</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Status Kepemilikan Rumah</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 bg-white"
                >
                  <option value="Permanent">Hak Milik Sendiri (Tetap)</option>
                  <option value="Kontrak">Sewa / Kontrak Sementara</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Jenis Kelamin</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Agama</label>
                <select
                  value={religion}
                  onChange={e => setReligion(e.target.value as any)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-750 bg-white"
                >
                  <option value="Islam">Islam</option>
                  <option value="Protestan">Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Pendidikan Terakhir</label>
                <select
                  value={education}
                  onChange={e => setEducation(e.target.value as any)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 text-gray-755 bg-white"
                >
                  <option value="Tidak/Belum Sekolah">Tidak/Belum Sekolah</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="Diploma">Diploma</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={e => setBirthPlace(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={job}
                  onChange={e => setJob(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Nama Kandung Ayah</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={e => setFatherName(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-655 mb-1">Nama Kandung Ibu</label>
                <input
                  type="text"
                  value={motherName}
                  onChange={e => setMotherName(e.target.value)}
                  className="w-full text-xs font-medium border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-655 mb-1">Wilayah RT</label>
                  <input
                    type="text"
                    placeholder="Contoh: 01"
                    value={rt}
                    onChange={e => setRt(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-center border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-655 mb-1">RW</label>
                  <input
                    type="text"
                    value={rw}
                    onChange={e => setRw(e.target.value)}
                    className="w-full text-xs font-mono font-bold text-center border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Kendaraan */}
          <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/20 space-y-3">
            <span className="text-xs font-extrabold text-amber-900 block flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-600" /> Aset Kendaraan Penghuni
            </span>
            <div className="grid grid-cols-3 gap-2">
              <select 
                value={newVehicleType}
                onChange={e => setNewVehicleType(e.target.value as any)}
                className="text-xs bg-white border border-gray-300 p-2 rounded-lg outline-none font-bold text-gray-700"
              >
                <option value="Mobil">Mobil</option>
                <option value="Motor">Motor</option>
                <option value="Sepeda">Sepeda</option>
              </select>
              <input 
                type="text" 
                placeholder="Merk (Contoh: Fortuner Putih)" 
                value={newVehicleBrand}
                onChange={e => setNewVehicleBrand(e.target.value)}
                className="text-xs bg-white border border-gray-300 p-2 rounded-lg outline-none font-medium"
              />
              <input 
                type="text" 
                placeholder="Pelat No (B 1234 XY)" 
                value={newVehiclePlate}
                onChange={e => setNewVehiclePlate(e.target.value.toUpperCase())}
                className="text-xs bg-white border border-gray-300 p-2 rounded-lg outline-none font-mono"
              />
            </div>
            <button 
              type="button" 
              onClick={addVehicle}
              className="w-full text-[11px] py-1.5 bg-white text-blue-600 border border-blue-200 font-bold hover:bg-blue-50 transition-colors rounded-lg shadow-2xs"
            >
              + Tambah Kendaraan
            </button>
            {vehicles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {vehicles.map((v, idx) => (
                  <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-700 font-extrabold flex items-center gap-1.5 shadow-2xs">
                    <span>{v.type}: {v.brand} ({v.plateNumber})</span>
                    <button 
                      type="button" 
                      onClick={() => removeVehicle(idx)} 
                      className="text-rose-500 font-black hover:text-rose-700 text-xs ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Pets */}
          <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/20 space-y-3">
            <span className="text-xs font-extrabold text-amber-900 block flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-amber-600" /> Hewan Peliharaan di Rumah
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="Jenis (Kucing, Anjing)" 
                value={newPetType}
                onChange={e => setNewPetType(e.target.value)}
                className="text-xs bg-white border border-gray-300 p-2 rounded-lg outline-none font-medium"
              />
              <input 
                type="text" 
                placeholder="Nama (Milo)" 
                value={newPetName}
                onChange={e => setNewPetName(e.target.value)}
                className="text-xs bg-white border border-gray-300 p-2 rounded-lg outline-none font-medium"
              />
              <input 
                type="text" 
                placeholder="Catatan (Bulunya Putih)" 
                value={newPetNote}
                onChange={e => setNewPetNote(e.target.value)}
                className="text-xs bg-white border border-gray-300 p-2 rounded-lg outline-none font-medium"
              />
            </div>
            <button 
              type="button" 
              onClick={addPet}
              className="w-full text-[11px] py-1.5 bg-white text-blue-600 border border-blue-200 font-bold hover:bg-blue-50 transition-colors rounded-lg shadow-2xs"
            >
              + Tambah Hewan Peliharaan
            </button>
            {pets.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {pets.map((p, idx) => (
                  <span key={idx} className="text-[10px] bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-700 font-extrabold flex items-center gap-1.5 shadow-2xs">
                    <span>{p.type}: {p.name} <span className="text-gray-400 font-normal">({p.note})</span></span>
                    <button 
                      type="button" 
                      onClick={() => removePet(idx)} 
                      className="text-rose-500 font-black hover:text-rose-700 text-xs ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-150">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-250 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform shadow-xs"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
