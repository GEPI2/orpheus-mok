import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, MapPin, Calendar, Clock, Share2, Eye, Plus, ArrowUpDown, 
  Map, QrCode, AlertTriangle, Sparkles, X, Heart, Globe, RefreshCw, Layers 
} from 'lucide-react';
import { SetlistItem, ConcertInfo, UserRole } from '../types';

interface SetlistViewProps {
  currentRole: UserRole;
  setlist: SetlistItem[];
  concert: ConcertInfo;
  onAddSongToSetlist: (item: SetlistItem) => void;
  onUpdateSetlistOrder: (setlist: SetlistItem[]) => void;
  onSendAlert: (message: string) => void;
}

export default function SetlistView({
  currentRole,
  setlist,
  concert,
  onAddSongToSetlist,
  onUpdateSetlistOrder,
  onSendAlert,
}: SetlistViewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [addTitle, setAddTitle] = useState('');
  const [addArtist, setAddArtist] = useState('');
  const [addKey, setAddKey] = useState('E Major');
  const [addBpm, setAddBpm] = useState(120);

  const handleShareLink = () => {
    setCopiedLink(true);
    onSendAlert('[공연 공유 링크 생성 완료] 카카오톡 및 인스타그램 공유용 관객 초대장 웹 주소가 모바일 클립보드에 안전하게 보관되었습니다!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCreateAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle || !addArtist) return;

    const added: SetlistItem = {
      order: setlist.length + 1,
      songTitle: addTitle,
      artist: addArtist,
      key: addKey,
      bpm: Number(addBpm),
      partMemos: { '전원': '앵콜을 화려하게 장식할 수 있도록 템포 업 유지' }
    };

    onAddSongToSetlist(added);
    setShowAddForm(false);
    // Reset
    setAddTitle('');
    setAddArtist('');
    onSendAlert(`[셋리스트 곡 추가 성공] 신규 수록곡 '${addTitle}'이 ${added.order}번째 트랙으로 셋프레임에 영입되었습니다.`);
  };

  const handleReorder = () => {
    // Basic cyclic shifting of the set list for interactive simulation
    if (setlist.length <= 1) return;
    const reordered = [...setlist];
    // Rotate the order
    const first = reordered.shift()!;
    reordered.push(first);
    // Re-index order numbers
    const finalReorder = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));
    onUpdateSetlistOrder(finalReorder);
    onSendAlert('[곡 순서 변경됨] 셋리스트 연주 곡 선로가 최적화 템포 밸런스에 맞춰 시큐어하게 재조정 재동기화되었습니다.');
  };

  const mapMarkerUrl = "https://map.kakao.com/?q=숭실대학교 한경직기념관";

  return (
    <div className="flex flex-col gap-4 p-4 pb-20 overflow-y-auto max-h-[100%] text-slate-100">
      
      {/* Concert Info Segment Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2.5">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            공식 연동 셋리스트 & 대외 홍보
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-2 font-display">{concert.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-350 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" /> {concert.date} {concert.time}
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <MapPin className="w-3.5 h-3.5 text-rose-400" /> 한경직 야외무대
          </div>
        </div>

        {/* Major Actions */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button 
            onClick={() => setShowPreview(true)}
            className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4" /> 초대장 미리보기
          </button>
          
          <button 
            onClick={handleShareLink}
            className="py-2.5 bg-slate-850 hover:bg-slate-750 text-slate-205 text-xs font-bold rounded-xl border border-slate-750 flex items-center justify-center gap-1 cursor-pointer transition active:scale-95"
          >
            <Share2 className="w-4 h-4 text-emerald-500" /> 
            {copiedLink ? '링크 복사성공!' : '초대장 링크 생성'}
          </button>
        </div>
      </div>

      {/* Setlist builder track container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> 공식 합주 트랙 순서도 ({setlist.length}곡)
          </h4>
          
          {currentRole === '운영진' && (
            <div className="flex gap-1.5">
              <button 
                onClick={handleReorder}
                title="순서 재조정"
                className="p-1 px-2.5 bg-slate-950 border border-slate-850 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowUpDown className="w-3 h-3" /> 드래그 순서 전환
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-1 px-2.5 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> 추곡
              </button>
            </div>
          )}
        </div>

        {/* Setlist Insertion Form for simulation */}
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/10 mb-2 flex flex-col gap-2"
          >
            <form onSubmit={handleCreateAdd} className="flex flex-col gap-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="추가 곡명"
                  value={addTitle}
                  onChange={e => setAddTitle(e.target.value)}
                  className="p-1.5 bg-slate-910 border border-slate-800 text-slate-100 rounded"
                />
                <input
                  type="text"
                  required
                  placeholder="아티스트"
                  value={addArtist}
                  onChange={e => setAddArtist(e.target.value)}
                  className="p-1.5 bg-slate-910 border border-slate-800 text-slate-100 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Key (예: E Major)"
                  value={addKey}
                  onChange={e => setAddKey(e.target.value)}
                  className="p-1.5 bg-slate-910 border border-slate-800 text-slate-100 rounded"
                />
                <input
                  type="number"
                  placeholder="BPM"
                  value={addBpm}
                  onChange={e => setAddBpm(Number(e.target.value))}
                  className="p-1.5 bg-slate-910 border border-slate-800 text-slate-100 rounded"
                />
              </div>

              <div className="flex justify-end gap-1.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1 text-slate-400 hover:text-slate-200"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  className="px-3.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded"
                >
                  트랙 합류
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Setlist tracking lists */}
        <div className="flex flex-col gap-2.5">
          {setlist.map((item) => (
            <div 
              key={item.songTitle} 
              className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 flex flex-col gap-2 hover:border-slate-800"
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-800 text-slate-100 text-[10px] font-mono font-bold rounded">
                    {item.order}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-100">{item.songTitle}</h5>
                    <p className="text-[10px] text-slate-500">{item.artist}</p>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-400 font-mono">
                  <p className="text-emerald-400 font-semibold">{item.key}</p>
                  <p>♩ {item.bpm}</p>
                </div>
              </div>

              {/* Part memos for detailed rehearsals */}
              <div className="bg-slate-900 border border-slate-850 p-2 rounded text-[10px] flex flex-col gap-1 text-slate-400">
                {Object.entries(item.partMemos).map(([part, comment]) => (
                  <p key={part} className="leading-snug">
                    <strong className="text-slate-300 font-semibold">[{part}]</strong> {comment}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== EXTERNAL MOBILE INVITATION MODAL POPUP ===================== */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 bg-slate-950/90 z-50 overflow-y-auto flex justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm flex flex-col text-left overflow-hidden h-fit shadow-[0_10px_40px_rgba(30,27,75,0.7)] pb-6"
            >
              
              {/* Outer Custom poster decorative header */}
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 p-6 text-center space-y-4 relative border-b border-slate-800">
                
                {/* Float Close trigger */}
                <button 
                  onClick={() => setShowPreview(false)}
                  className="absolute right-4 top-4 p-1.5 bg-slate-950/85 hover:bg-slate-900 rounded-full border border-slate-800/80 cursor-pointer text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Music className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                    ORPHEUS 18TH CONCERT
                  </span>
                  <h3 className="text-base font-extrabold font-display leading-snug tracking-tight text-white pt-1">
                    {concert.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-sans">숭실대학교 명품 가요 밴드 '오르페우스'의 무대</p>
                </div>
              </div>

              {/* Detail list elements */}
              <div className="p-5 flex flex-col gap-5 text-xs text-slate-300">
                
                {/* 1. Schedule info summary */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">일시 및 공연장 안내</h4>
                  
                  <div className="grid grid-cols-2 gap-2 font-sans font-medium">
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> 날짜/요일</span>
                      <span className="text-slate-100 font-bold">{concert.date}</span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 오픈 시간</span>
                      <span className="text-emerald-400 font-bold">오후 {concert.time}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 block">정식 공연 장소</span>
                      <span className="text-slate-200 font-semibold">{concert.location}</span>
                    </div>
                    <a 
                      href={mapMarkerUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-1.5 px-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg text-[9px] text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Map className="w-3" /> 지도 열기
                    </a>
                  </div>
                </div>

                {/* 2. Lineup band list summary */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">출연진 라인업 (Lineup)</h4>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex flex-wrap gap-1">
                    {concert.lineup.map(p => (
                      <span key={p} className="px-2 py-0.5 bg-slate-900 text-slate-300 text-[10px] font-medium rounded-md border border-slate-800">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Partial setlist leak for hype */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-emerald-400">공개 셋리스트 (일부 선공개)</h4>
                  <div className="bg-slate-950/50 p-3 border border-slate-850 rounded-xl space-y-2">
                    {concert.setlistPreview.map((item, idx) => (
                      <div key={idx} className="flex gap-2 text-[10.5px]">
                        <span className="text-emerald-400 font-mono">0{idx + 1}</span>
                        <span className="text-slate-300 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. QR and Admission ticket */}
                <div className="py-4 border-t border-slate-800 flex flex-col items-center justify-center text-center gap-3 bg-slate-950/40 rounded-2xl mt-2 p-4">
                  <div className="p-2.5 bg-white rounded-2xl shrink-0">
                    <QrCode className="w-24 h-24 text-slate-950" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      MOBILE E-TICKET
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1.5">입구 스탠드에서 본 초대장의 QR을 스캔하시면<br />온라인 슬릿으로 빠른 우선 입장 및 안내지가 제공됩니다.</p>
                  </div>
                </div>

                {/* Bottom dialog Close button */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl cursor-pointer"
                >
                  초대장 뷰어 닫고 목업으로 복귀
                </button>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
