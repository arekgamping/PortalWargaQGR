import React, { useState } from 'react';
import { ForumThread, Polling, UserRole } from '../types';
import { MessageSquare, ThumbsUp, Plus, Calendar, Vote, CheckCircle, Flame, Gift, HelpCircle, TrendingUp, BarChart3, RotateCcw, UserCheck, AlertCircle, Sparkles, ShieldAlert, Award, Info } from 'lucide-react';

interface Candidate {
  id: string;
  type: 'RT' | 'RW';
  number: number;
  leaderName: string;
  coLeaderName: string;
  vision: string;
  mission: string[];
  votes: number;
  avatarUrl: string;
}

const defaultCandidates: Candidate[] = [
  {
    id: 'cand-rt-1',
    type: 'RT',
    number: 1,
    leaderName: 'H. Joko Susilo',
    coLeaderName: 'Ahmad Ghozali',
    vision: 'RT 01 Smart, Tanggap, Rukun Tetangga Nyaman & Transparan',
    mission: [
      'Digitalisasi layanan persuratan warga lewat aplikasi tinggal klik',
      'Peningkatan frekuensi ronda malam berkoordinasi dengan petugas keamanan utama',
      'Penyusunan laporan kas keuangan transparan bulanan yang bisa diakses warga online'
    ],
    votes: 28,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'cand-rt-2',
    type: 'RT',
    number: 2,
    leaderName: 'Prasetyo Utomo',
    coLeaderName: 'Dr. Irma Santosa',
    vision: 'Mewujudkan Lingkungan RT 01 Sehat, Hijau, Aman & Edukatif',
    mission: [
      'Pengolahan pupuk bokashi mandiri dan bank sampah terpadu lingkungan',
      'Pembuatan taman herbal/TOGA di area playground warga',
      'Mengaktifkan kembali posyandu bulanan untuk balita dan lansia'
    ],
    votes: 22,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'cand-rw-1',
    type: 'RW',
    number: 1,
    leaderName: 'Ir. H. Slamet Mulya',
    coLeaderName: 'H. M. Yusuf',
    vision: 'Menjadikan SmartLiving Residence Harmonis, Berkemajuan, & Berteknologi Tinggi',
    mission: [
      'Pemasangan kamera CCTV bertenaga AI di setiap gerbang sekunder',
      'Pembangunan instalasi filtrasi air bersih cadangan kawasan',
      'Perbaikan menyeluruh berkala aspal ruko dagang & jalanan utama perumahan'
    ],
    votes: 45,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 'cand-rw-2',
    type: 'RW',
    number: 2,
    leaderName: 'Drs. Heri Cahyadi',
    coLeaderName: 'Capt. Andi Wijaya',
    vision: 'RW Sejahtera: Inklusif, Bersih, Kreatif, Adil & Berdikari',
    mission: [
      'Pendirian koperasi simpan pinjam warga & bazar UMKM bulanan',
      'Penyelenggaraan acara kesenian & siskamling malam RW serentak',
      'Renovasi total clubhouse & penyediaan lapangan olahraga terlindung'
    ],
    votes: 39,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
  }
];

interface CommunityModuleProps {
  role: UserRole;
  threads: ForumThread[];
  pollings: Polling[];
  onAddThread: (thread: ForumThread) => void;
  onLikeThread: (id: string) => void;
  onVotePolling: (pollingId: string, optionId: string) => void;
  onAddComment: (threadId: string, content: string, author: string, roleName: string) => void;
  onAddPolling: (polling: Polling) => void;
}

export default function CommunityModule({
  role,
  threads,
  pollings,
  onAddThread,
  onLikeThread,
  onVotePolling,
  onAddComment,
  onAddPolling,
}: CommunityModuleProps) {
  const [filterCategory, setFilterCategory] = useState('Semua');
  
  // Sub-tab selection for Forum vs E-Voting
  const [activeSubTab, setActiveSubTab] = useState<'diskusi' | 'pemilihan'>('diskusi');
  const [activeElectionType, setActiveElectionType] = useState<'RT' | 'RW'>('RT');

  // Load candidates and voting records from localStorage
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('smartliving_candidates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Format candidates tidak valid:", e);
      }
    }
    return defaultCandidates;
  });

  const [votedRtCandidate, setVotedRtCandidate] = useState<string | null>(() => {
    return localStorage.getItem('smartliving_voted_rt') || null;
  });

  const [votedRwCandidate, setVotedRwCandidate] = useState<string | null>(() => {
    return localStorage.getItem('smartliving_voted_rw') || null;
  });

  // Adding Custom Candidate Pair Form State (for Admin/RT/RW role)
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [candType, setCandType] = useState<'RT' | 'RW'>('RT');
  const [candLeader, setCandLeader] = useState('');
  const [candCoLeader, setCandCoLeader] = useState('');
  const [candVision, setCandVision] = useState('');
  const [candMissionStr, setCandMissionStr] = useState('');
  const [candAvatar, setCandAvatar] = useState('');

  // Forum Form State
  const [showAddThread, setShowAddThread] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadCat, setThreadCat] = useState<'Diskusi' | 'Pengumuman' | 'Kehilangan' | 'Donasi' | 'Sosial'>('Diskusi');

  // Inline Comment State
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Polling Creation Form
  const [showAddPoll, setShowAddPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');
  const [pollOpt3, setPollOpt3] = useState('');

  const saveCandidates = (newCandidates: Candidate[]) => {
    setCandidates(newCandidates);
    localStorage.setItem('smartliving_candidates', JSON.stringify(newCandidates));
  };

  const handleCastVote = (candidateId: string, candidateType: 'RT' | 'RW') => {
    if (candidateType === 'RT' && votedRtCandidate) {
      alert("Anda sudah menggunakan hak suara Anda untuk pemilihan Ketua RT 01!");
      return;
    }
    if (candidateType === 'RW' && votedRwCandidate) {
      alert("Anda sudah menggunakan hak suara Anda untuk pemilihan Ketua RW 03!");
      return;
    }

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    if (!confirm(`Apakah Anda yakin ingin memberikan suara Anda kepada Paslon No. ${candidate.number}: ${candidate.leaderName} & ${candidate.coLeaderName}? Pilihan ini bersifat final.`)) {
      return;
    }

    const updated = candidates.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c);
    saveCandidates(updated);

    if (candidateType === 'RT') {
      setVotedRtCandidate(candidateId);
      localStorage.setItem('smartliving_voted_rt', candidateId);
    } else {
      setVotedRwCandidate(candidateId);
      localStorage.setItem('smartliving_voted_rw', candidateId);
    }

    alert(`Suara elektronik (E-Voting) Anda untuk Paslon No. ${candidate.number} berhasil direkam secara sah dan aman!`);
  };

  const handleAddCandidatePair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candLeader || !candCoLeader || !candVision) {
      alert("Harap isi semua kolom wajib!");
      return;
    }

    const currentCandidatesOfType = candidates.filter(c => c.type === candType);
    const nextNumber = currentCandidatesOfType.length > 0 
      ? Math.max(...currentCandidatesOfType.map(c => c.number)) + 1 
      : 1;

    const missionArray = candMissionStr
      ? candMissionStr.split('\n').map(m => m.trim()).filter(m => m.length > 0)
      : ['Menjaga kebersamaan dan memajukan kawasan perumahan secara berkala.'];

    const newCandidate: Candidate = {
      id: `cand-${candType.toLowerCase()}-${Date.now()}`,
      type: candType,
      number: nextNumber,
      leaderName: candLeader,
      coLeaderName: candCoLeader,
      vision: candVision,
      mission: missionArray,
      votes: 0,
      avatarUrl: candAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    };

    const updated = [...candidates, newCandidate];
    saveCandidates(updated);

    setCandLeader('');
    setCandCoLeader('');
    setCandVision('');
    setCandMissionStr('');
    setCandAvatar('');
    setShowAddCandidate(false);
    alert(`Pasangan Calon No. urut ${nextNumber} untuk pemilihan Ketua ${candType} berhasil didaftarkan secara resmi!`);
  };

  const handleResetElection = () => {
    if (confirm("Apakah Anda yakin ingin me-reset seluruh hasil penghitungan suara & status memilih (E-Voting) simulasi Anda? Semua data suara akan kembali ke bawaan semula.")) {
      localStorage.removeItem('smartliving_candidates');
      localStorage.removeItem('smartliving_voted_rt');
      localStorage.removeItem('smartliving_voted_rw');
      setCandidates(defaultCandidates);
      setVotedRtCandidate(null);
      setVotedRwCandidate(null);
      alert("Sistem Pemilihan RT & RW berhasil di-reset ke kondisi awal simulasi!");
    }
  };

  const handleThreadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle || !threadContent) return;

    const newThread: ForumThread = {
      id: `thr-${Date.now()}`,
      authorName: role === 'RT/RW' ? 'Ketua RW (Ir. H. Slamet Mulya)' : 'Budi Santoso',
      authorRole: role === 'RT/RW' ? 'RT/RW' : 'Warga',
      title: threadTitle,
      content: threadContent,
      category: threadCat,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: []
    };

    onAddThread(newThread);
    setThreadTitle('');
    setThreadContent('');
    setShowAddThread(false);
    alert("Utas diskusi forum BERHASIL diunggah ke linimasa komunitas warga!");
  };

  const handlePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion || !pollOpt1 || !pollOpt2) return;

    const options = [
      { id: 'opt-a', text: pollOpt1, votes: 0 },
      { id: 'opt-b', text: pollOpt2, votes: 0 }
    ];
    if (pollOpt3) {
      options.push({ id: 'opt-c', text: pollOpt3, votes: 0 });
    }

    const newPoll: Polling = {
      id: `poll-${Date.now()}`,
      question: pollQuestion,
      options,
      votesCount: {},
      totalVotes: 0,
      dueDate: '2026-06-01'
    };

    onAddPolling(newPoll);
    setPollQuestion('');
    setPollOpt1('');
    setPollOpt2('');
    setPollOpt3('');
    setShowAddPoll(false);
    alert("Polling / Pengambilan suara warga berhasil diluncurkan!");
  };

  const handleCommentSubmit = (threadId: string) => {
    if (!newCommentText) return;
    
    // Simulate active user details
    const authorName = role === 'RT/RW' ? 'Ketua RW (Ir. H. Slamet Mulya)' : 'Budi Santoso';
    const authorRole = role === 'RT/RW' ? 'RT/RW' : 'Warga';
    
    onAddComment(threadId, newCommentText, authorName, authorRole);
    setNewCommentText('');
    setCommentingId(null);
  };

  // Filter threads
  const filteredThreads = threads.filter(thr => filterCategory === 'Semua' || thr.category === filterCategory);

  return (
    <div id="community-module-container" className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-linear-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 p-5 rounded-2xl border border-blue-100 min-h-24">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Forum Komunitas & Musyawarah</h2>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-full">RT 01 / RW 03</span>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">Kanal kependudukan terpadu: diskusikan aspirasi Anda, mufakati polling, salurkan donasi kemanusiaan, atau ikuti pemilihan pimpinan warga secara digital & rahasia.</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {activeSubTab === 'diskusi' ? (
            <>
              {(role === 'RT/RW' || role === 'Super Admin') && (
                <button 
                  id="btn-open-poll-creation"
                  onClick={() => setShowAddPoll(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200 rounded-xl shadow-xs cursor-pointer"
                >
                  <Vote className="w-4 h-4" />
                  Buat Polling Baru
                </button>
              )}
              <button 
                id="btn-open-thread-creation"
                onClick={() => setShowAddThread(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors rounded-xl shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Mulai Diskusi Baru
              </button>
            </>
          ) : (
            (role === 'RT/RW' || role === 'Super Admin') && (
              <button 
                id="btn-open-candidate-creation"
                onClick={() => {
                  setCandType(activeElectionType);
                  setShowAddCandidate(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors rounded-xl shadow-md shadow-rose-500/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Pasangan Calon ({activeElectionType})
              </button>
            )
          )}
        </div>
      </div>

      {/* SUB-TAB NAVIGATOR */}
      <div className="flex border-b border-gray-200 bg-white rounded-xl p-1 shadow-xs ring-1 ring-gray-100">
        <button
          onClick={() => setActiveSubTab('diskusi')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'diskusi'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4.5 h-4.5" />
          Aspirasi, Diskusi & Polling
        </button>
        <button
          onClick={() => setActiveSubTab('pemilihan')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 text-xs font-extrabold rounded-lg transition-all relative cursor-pointer ${
            activeSubTab === 'pemilihan'
              ? 'bg-rose-50 text-rose-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Vote className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
          E-Voting Pemilihan RT & RW
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </button>
      </div>

      {activeSubTab === 'diskusi' ? (
        <>
          {/* RENDER POLLS ON TOP OF THE PAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pollings.map(poll => {
              // Check if Budi Santoso (res-01) already voted
              const hasVotedOpt = poll.votesCount['res-01'];

              return (
                <div key={poll.id} className="bg-white border border-indigo-100 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="flex items-center gap-1.5 text-xs text-indigo-700 font-extrabold tracking-wider">
                      <Vote className="w-4 h-4 text-indigo-600 animate-bounce" /> POLLING MUFAKAT WARGA
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">Tempo: {poll.dueDate}</span>
                  </div>
                  
                  <h4 className="font-extrabold text-sm text-gray-800 leading-snug">{poll.question}</h4>

                  {/* Polling Options Progress items */}
                  <div className="space-y-2.5 pt-1">
                    {poll.options.map(opt => {
                      const isThisSelected = hasVotedOpt === opt.id;
                      const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;

                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                              {isThisSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                              {opt.text}
                            </span>
                            <span className="font-bold text-gray-800">{opt.votes} Suara ({percent}%)</span>
                          </div>

                          <div className="relative h-6 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-150-inset 1">
                            <div 
                              className="h-full bg-indigo-600 transition-all duration-500 rounded-lg"
                              style={{ width: `${percent}%` }}
                            ></div>
                            
                            {/* Vote Button over progress */}
                            {!hasVotedOpt && (
                              <button 
                                type="button"
                                onClick={() => onVotePolling(poll.id, opt.id)}
                                className="absolute inset-0 w-full text-center hover:bg-indigo-300/10 text-[10px] text-indigo-600 font-black transition-all cursor-pointer"
                              >
                                Klik Memilih / Vote Opsi Ini
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-gray-400 font-serif pt-1 flex justify-between">
                    <span>Total Partisipan: <strong>{poll.totalVotes} Suara Masuk</strong></span>
                    {hasVotedOpt && <span className="text-indigo-600 font-bold">✓ Pilihan Anda telah tercatat</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SECTION TABS FOR FORUM CATEGORY */}
          <div className="flex overflow-x-auto gap-1.5 pb-2 border-b border-gray-100">
            {['Semua', 'Pengumuman', 'Diskusi', 'Kehilangan', 'Donasi'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                  filterCategory === cat 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* DISCUSSION LISTINGS */}
          <div className="space-y-5">
            {filteredThreads.map(thr => {
              let catBadge = 'bg-gray-100 text-gray-600';
              if (thr.category === 'Pengumuman') catBadge = 'bg-rose-100 text-rose-800 font-bold';
              if (thr.category === 'Donasi') catBadge = 'bg-emerald-100 text-emerald-800 font-bold';
              if (thr.category === 'Kehilangan') catBadge = 'bg-amber-100 text-amber-805 font-bold';

              return (
                <div key={thr.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {thr.authorName.charAt(0)}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-sm text-gray-800">{thr.authorName}</h5>
                          <span className="text-[10px] text-gray-400 font-semibold">{thr.authorRole} • {thr.date}</span>
                        </div>
                      </div>

                      <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${catBadge}`}>
                        {thr.category}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-800 tracking-tight leading-snug pt-1">
                      {thr.title}
                    </h3>

                    <p className="text-xs text-gray-650 font-serif leading-relaxed font-medium font-medium">
                      {thr.content}
                    </p>
                  </div>

                  {/* Likes & Comment count bar */}
                  <div className="flex items-center gap-4 text-xs pt-1 border-y border-gray-100 py-2.5">
                    <button 
                      onClick={() => onLikeThread(thr.id)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 font-bold transition-transform active:scale-90 cursor-pointer"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Suka ({thr.likes})</span>
                    </button>

                    <button 
                      onClick={() => setCommentingId(commentingId === thr.id ? null : thr.id)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 font-bold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Komentar ({thr.comments.length})</span>
                    </button>
                  </div>

                  {/* Comment inputs area if clicked */}
                  {commentingId === thr.id && (
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-150 animate-fade-in text-xs">
                      <span className="font-bold text-gray-700 block">Tulis Komentar Perumahan</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Tanggapi utas warga ini..." 
                          value={newCommentText}
                          onChange={e => setNewCommentText(e.target.value)}
                          className="flex-1 bg-white border p-2 rounded-lg text-xs outline-none"
                        />
                        <button 
                          onClick={() => handleCommentSubmit(thr.id)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg font-bold cursor-pointer"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}

                  {/* RENDER COMMENTS PREVIEW */}
                  {thr.comments.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Tanggapan Tetangga ({thr.comments.length})</span>
                      <div className="space-y-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-xs font-semibold">
                        {thr.comments.map(comm => (
                          <div key={comm.id} className="space-y-0.5">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-extrabold text-blue-900">{comm.authorName} <strong className="text-gray-400 font-normal">({comm.authorRole})</strong></span>
                              <span className="text-[9px] text-gray-400">{comm.date}</span>
                            </div>
                            <p className="text-gray-750 font-medium font-serif">{comm.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* VOTE ELECTION PORTAL */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="evoting-portal-view">
          {/* PANDUAN SINGKAT ATURAN E-VOTING BANNER */}
          <div id="evoting-quick-guidelines-banner" className="lg:col-span-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row gap-5 items-start">
            <div className="bg-amber-100/80 p-3 rounded-xl text-amber-700 shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-black text-amber-955 tracking-tight">Panduan Resmi &amp; Aturan E-Voting Warga</h3>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-200 text-amber-800 rounded-full lowercase tracking-wider">LUBER JURDIL</span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed font-semibold">
                Sistem e-voting diselenggarakan secara transparan untuk menyerap hak aspirasi kepemimpinan warga secara digital &amp; tepercaya. Mohon perhatikan ketentuan penting berikut:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1.5 text-[11px] text-gray-750 font-bold">
                <div className="flex items-start gap-2.5 bg-white/60 p-3 rounded-xl border border-amber-100/50">
                  <UserCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-900 font-extrabold text-[11px] mb-0.5">Satu Hak Suara per KK</span>
                    Setiap perwakilan Kartu Keluarga (KK) dibatasi hanya bisa memilih <strong className="text-rose-600 font-black">1 (satu) kali untuk pimpinan RT</strong> dan <strong className="text-rose-600 font-black">1 (satu) kali untuk pimpinan RW</strong>.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 bg-white/60 p-3 rounded-xl border border-amber-100/50">
                  <AlertCircle className="w-4 h-4 text-emerald-650 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-900 font-extrabold text-[11px] mb-0.5">Jaminan Kerahasiaan Penuh</span>
                    Pilihan suara Anda <strong className="text-emerald-700 font-black">dijamin 100% aman &amp; rahasia</strong>. Sistem merekam suara secara anonim tanpa menampilkan asosiasi pilihan dengan data profil pribadi Anda.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT COLUMNS: CAMPAIGN MAIN CARD VIEW */}
          <div className="lg:col-span-2 space-y-6">
            {/* ELECTION TYPE SELECTOR HEADER */}
            <div className="bg-white p-4 rounded-2xl border border-gray-150 flex justify-between items-center shadow-xs">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-rose-500 animate-pulse" />
                Matriks Pemilihan Aktif:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveElectionType('RT')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    activeElectionType === 'RT'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  Ketua RT 01
                </button>
                <button
                  onClick={() => setActiveElectionType('RW')}
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    activeElectionType === 'RW'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  Ketua RW 03
                </button>
              </div>
            </div>

            {/* CANDIDATES ITERATOR */}
            <div className="space-y-6">
              {candidates
                .filter(cand => cand.type === activeElectionType)
                .sort((a, b) => a.number - b.number)
                .map(cand => {
                  const isThisVoted = activeElectionType === 'RT' 
                    ? votedRtCandidate === cand.id 
                    : votedRwCandidate === cand.id;
                  const hasVotedCategory = activeElectionType === 'RT' 
                    ? !!votedRtCandidate 
                    : !!votedRwCandidate;
                  
                  // Compute vote percentages dynamically
                  const candidatesOfType = candidates.filter(c => c.type === activeElectionType);
                  const totalVotesType = candidatesOfType.reduce((acc, curr) => acc + curr.votes, 0);
                  const displayPercent = totalVotesType > 0 ? Math.round((cand.votes / totalVotesType) * 100) : 0;

                  return (
                    <div 
                      key={cand.id} 
                      className={`bg-white rounded-3xl border p-6 transition-all duration-300 relative ${
                        isThisVoted 
                          ? 'border-emerald-500 ring-2 ring-emerald-100 shadow-md' 
                          : 'border-gray-150 hover:border-gray-300 shadow-xs'
                      }`}
                    >
                      {/* Top ribbon if selected */}
                      {isThisVoted && (
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center gap-1 shadow-xs shadow-emerald-600/10">
                          <CheckCircle className="w-3.5 h-3.5" /> Pilihan Anda Tercatat (Sah)
                        </div>
                      )}

                      {/* Ballot Number Circular Bubble Badge */}
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-linear-to-br from-rose-500 to-rose-600 text-white font-black flex items-center justify-center text-xl shadow-md border-2 border-white">
                        {cand.number}
                      </div>

                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-gray-100">
                        {/* Avatar photo placeholder */}
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-150 shadow-xs shrink-0 flex items-center justify-center bg-gray-50">
                          <img 
                            src={cand.avatarUrl} 
                            alt={`${cand.leaderName}`} 
                            className="w-full h-full object-cover"
                            referrerPolicy="referrer"
                          />
                        </div>

                        {/* Leader/Co-leader names */}
                        <div className="space-y-1 text-center sm:text-left pr-12">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-rose-600 font-mono">Paslon No. Urut {cand.number}</span>
                          <h3 className="text-base font-extrabold text-gray-800 tracking-tight leading-none pt-0.5">
                            {cand.leaderName}
                          </h3>
                          <p className="text-xs text-blue-600 font-bold">
                            & {cand.coLeaderName}
                          </p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 pt-1">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-50 text-gray-700">Calon Pimpinan</span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600">Calon Wakil</span>
                          </div>
                        </div>
                      </div>

                      {/* Vision and Mission Blocks */}
                      <div className="py-5 space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Visi</h4>
                          <p className="text-xs font-serif font-semibold italic text-gray-700 bg-gray-50/50 p-2.5 rounded-xl border border-dashed border-gray-150 leading-relaxed">
                            "{cand.vision}"
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Misi Utama Program Kerja</h4>
                          <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-600">
                            {cand.mission.map((mis, idx) => (
                              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                                <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                                <span className="font-medium">{mis}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Voting Statistics & Actions */}
                      <div className="pt-4 border-t border-gray-100 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                            Pekiraan Suara: <strong>{cand.votes} Warga</strong>
                          </span>
                          <span className="text-gray-800 font-black text-xs">{displayPercent}% Suara</span>
                        </div>

                        {/* Progress Bar representation */}
                        <div className="h-2 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-150">
                          <div 
                            className={`h-full transition-all duration-500 rounded-lg ${
                              isThisVoted ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${displayPercent}%` }}
                          ></div>
                        </div>

                        {/* Button control triggers */}
                        <div className="pt-2.5 flex justify-end">
                          {isThisVoted ? (
                            <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-xl shadow-xs">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              Pilihan Anda Terpilih Terkunci
                            </div>
                          ) : hasVotedCategory ? (
                            <button
                              disabled
                              className="px-4 py-2 text-xs font-bold text-gray-450 bg-gray-100 rounded-xl cursor-not-allowed border border-gray-200"
                            >
                              Sudah Menyalurkan Suara
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCastVote(cand.id, activeElectionType)}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all transform hover:-translate-y-0.5 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
                            >
                              <UserCheck className="w-4 h-4" />
                              Salurkan Hak Suara Saya / Vote
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* RIGHT COLUMN: INFORMATION LEDGER & STATS */}
          <div className="space-y-6">
            {/* IN-DEPTH ELECTION STATISTICS CARD */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-gray-100 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-rose-500" />
                <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Hasil Pemilihan Sementara</h4>
              </div>

              {/* Comparing progress bars */}
              <div className="space-y-4 text-xs font-semibold">
                {(() => {
                  const filteredCands = candidates.filter(c => c.type === activeElectionType);
                  const totalVotesType = filteredCands.reduce((acc, curr) => acc + curr.votes, 0);

                  let leader: Candidate | null = null;
                  let maxVotes = -1;
                  let isTie = false;
                  filteredCands.forEach(c => {
                    if (c.votes > maxVotes) {
                      maxVotes = c.votes;
                      leader = c;
                      isTie = false;
                    } else if (c.votes === maxVotes && maxVotes > 0) {
                      isTie = true;
                    }
                  });

                  return (
                    <>
                      <div className="space-y-3">
                        {filteredCands.sort((a, b) => b.votes - a.votes).map(c => {
                          const pct = totalVotesType > 0 ? Math.round((c.votes / totalVotesType) * 100) : 0;
                          return (
                            <div key={c.id} className="space-y-1">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="font-extrabold text-gray-700">Paslon {c.number}: {c.leaderName}</span>
                                <span className="font-bold text-gray-400">{c.votes} Suara ({pct}%)</span>
                              </div>
                              <div className="h-2 w-full bg-gray-100 rounded-full">
                                <div 
                                  className="h-full bg-rose-500 rounded-full" 
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-gray-450 font-mono flex justify-between pt-1 border-t border-gray-100">
                        <span>Hak Suara Terpakai:</span>
                        <strong className="text-gray-700">{totalVotesType} KK Masuk</strong>
                      </div>

                      {totalVotesType > 0 && leader && (
                        <div className="p-3 bg-linear-to-br from-rose-500/5 to-pink-500/5 border border-pink-100 rounded-xl text-[11px] leading-relaxed flex items-start gap-2 text-rose-800 font-bold">
                          <Award className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                          <div>
                            {isTie ? (
                              <span>Hasil sementara berimbang secara seri. Suara Anda berikutnya akan menjadi penentu krusial.</span>
                            ) : (
                              <span>
                                Unggul Sementara: <strong>Paslon No. {(leader as Candidate).number} ({(leader as Candidate).leaderName})</strong> dengan selisih suara tipis.
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* EVOTING GUIDELINES CARD */}
            <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-gray-100 flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-blue-600" />
                <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Aturan E-Voting Digital</h4>
              </div>

              <div className="space-y-3 text-[11px] text-gray-650 leading-relaxed font-semibold">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Sistem mengidentifikasi hak kependudukan Anda untuk mencegah suara ganda demi keaslian data pemilihan.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Setiap perwakilan Kartu Keluarga (KK) hanya bisa memilih 1x untuk RT dan 1x untuk RW.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Kerahasiaan data suara dijamin 100% rahasia, bebas dari pengawasan pihak mana pun.</span>
                </div>
              </div>
            </div>

            {/* ADMIN / CONTROL BOARD */}
            {(role === 'RT/RW' || role === 'Super Admin') && (
              <div className="bg-linear-to-br from-indigo-50/70 to-blue-50/70 rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-800">
                  <ShieldAlert className="w-4.5 h-4.5 text-indigo-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider">Layanan Panitia (RT/RW)</h4>
                </div>

                <p className="text-[10px] text-indigo-700 leading-relaxed font-bold">
                  Sebagai admin, Anda berwenang menambahkan pasangan calon (paslon) baru secara real-time atau menyetel ulang (reset) perolehan data untuk simulasi anyar sekunder.
                </p>

                <div className="flex flex-col gap-2 pt-1 font-bold text-xs">
                  <button
                    onClick={() => {
                      setCandType(activeElectionType);
                      setShowAddCandidate(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-transform transform active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Buka Formulir Paslon
                  </button>

                  <button
                    onClick={handleResetElection}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Data Pemilihan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ADD UTAS DISKUSI MODAL --- */}
      {showAddThread && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Mulai Utas / Diskusi Warga</h3>
              <p className="text-xs text-gray-500">Membagikan pengumuman sosial, barang temuan, donasi anak yatim, atau musyawarah kompleks</p>
            </div>
            
            <form onSubmit={handleThreadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Judul Topik Musyawarah *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Usulan Kenaikan Iuran Ronda Malam" 
                  value={threadTitle}
                  onChange={e => setThreadTitle(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Kategori Diskusi</label>
                <select 
                  value={threadCat}
                  onChange={e => setThreadCat(e.target.value as any)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 text-gray-700 outline-none"
                >
                  <option value="Diskusi">Diskusi Terbuka</option>
                  <option value="Pengumuman">Pengumuman Penting RT/RW</option>
                  <option value="Kehilangan">Informasi Kehilangan (Hewan/Aset)</option>
                  <option value="Donasi">Kampanye Donasi Bersama</option>
                  <option value="Sosial">Hubungan Sosial & Guyub</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Uraian / Isi Diskusi Lengkap *</label>
                <textarea 
                  placeholder="Detail penyampaian Anda, lampirkan waktu berkumpul jika perlu..." 
                  value={threadContent}
                  onChange={e => setThreadContent(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 h-28 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddThread(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Terbitkan Utas Warga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD POLLING MODAL FORM --- */}
      {showAddPoll && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Buat Polling Suara Mufakat</h3>
              <p className="text-xs text-gray-500">Mencari suara terbanyak atas keputusan bersama warga secara adil</p>
            </div>
            
            <form onSubmit={handlePollSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Pertanyaan Polling *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Setujukah bila portal utara ditutup mulai jam 9 malam?" 
                  value={pollQuestion}
                  onChange={e => setPollQuestion(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600">Opsi Pilihan Suara warga (Minimal 2)</label>
                
                <input 
                  type="text" 
                  placeholder="Opsi Pilihan 1 (Misal: Setuju / Ya)" 
                  value={pollOpt1}
                  onChange={e => setPollOpt1(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 outline-none"
                  required
                />

                <input 
                  type="text" 
                  placeholder="Opsi Pilihan 2 (Misal: Tidak Setuju)" 
                  value={pollOpt2}
                  onChange={e => setPollOpt2(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 outline-none"
                  required
                />

                <input 
                  type="text" 
                  placeholder="Opsi Pilihan 3 (Opsional)" 
                  value={pollOpt3}
                  onChange={e => setPollOpt3(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddPoll(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform animate-pulse"
                >
                  Luncurkan Polling
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD CANDIDATE PAIR MODAL --- */}
      {showAddCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-150 w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in text-xs font-semibold">
            <div className="p-5 border-b border-gray-100 flex items-center gap-1.5">
              <Vote className="w-5 h-5 text-rose-500 animate-bounce" />
              <div>
                <h3 className="text-base font-black text-gray-800">Dafarkan Calon Pemimpin RT/RW</h3>
                <p className="text-[10px] text-gray-500 font-medium">Mendaftarkan sepasang calon baru untuk meramaikan kontestasi demokrasi digital.</p>
              </div>
            </div>
            
            <form onSubmit={handleAddCandidatePair} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tipe Pemilihan</label>
                  <select 
                    value={candType}
                    onChange={e => setCandType(e.target.value as any)}
                    className="w-full text-xs font-bold border border-gray-300 rounded-lg p-2 text-gray-750 outline-none"
                  >
                    <option value="RT">Ketua RT 01</option>
                    <option value="RW">Ketua RW 03</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">URL Foto (Opsional)</label>
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={candAvatar}
                    onChange={e => setCandAvatar(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2 outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Calon Ketua *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Drs. Joko Susilo" 
                  value={candLeader}
                  onChange={e => setCandLeader(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none font-bold text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Calon Wakil Ketua *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Capt. Andi Wijaya" 
                  value={candCoLeader}
                  onChange={e => setCandCoLeader(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none font-bold text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Visi Utama Paslon *</label>
                <input 
                  type="text" 
                  placeholder="Contoh: SmartLiving yang Nyaman & Tanggap Warga" 
                  value={candVision}
                  onChange={e => setCandVision(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2.5 outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Butir-Butir Misi (Pisahkan per baris / enter)</label>
                <textarea 
                  placeholder="Ketik baris misi pertama&#10;Ketik baris misi kedua&#10;Ketik baris misi ketiga..." 
                  value={candMissionStr}
                  onChange={e => setCandMissionStr(e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded-lg p-2 h-20 outline-none font-medium text-gray-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 text-xs">
                <button 
                  type="button" 
                  onClick={() => setShowAddCandidate(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl active:scale-95 transition-transform"
                >
                  Daftarkan Paslon Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
