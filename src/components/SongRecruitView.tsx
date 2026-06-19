import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, PlusCircle, Users, Check, ExternalLink, MessageSquare, 
  Clock, CheckCircle, ChevronLeft, Send, Sparkles, Plus, AlertTriangle 
} from 'lucide-react';
import { SongRecruit, UserRole, RecruitStatus, SongApplication } from '../types';

interface SongRecruitViewProps {
  currentRole: UserRole;
  recruits: SongRecruit[];
  onAddRecruit: (newRecruit: SongRecruit) => void;
  onApplyForPart: (recruitId: string, app: SongApplication) => void;
  onApproveApplication: (recruitId: string, appIndex: number) => void;
  onSendAlert: (message: string) => void;
}

export default function SongRecruitView({
  currentRole,
  recruits,
  onAddRecruit,
  onApplyForPart,
  onApproveApplication,
  onSendAlert,
}: SongRecruitViewProps) {
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [applyPart, setApplyPart] = useState('');
  const [applyComment, setApplyComment] = useState('');
  
  // Create state for adding a song
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newParts, setNewParts] = useState<string[]>(['Vocal', 'Guitar 1', 'Bass', 'Drum']);

  // Get active selected object
  const activeRecruit = recruits.find(r => r.id === selectedRecId) || null;

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;

    const newSong: SongRecruit = {
      id: `rec-${Date.now()}`,
      songTitle: newTitle,
      artist: newArtist,
      creator: currentRole === '운영진' ? '김민준' : '이서연',
      status: '모집 중',
      requiredParts: newParts,
      currentParticipants: {
        'Guitar 1': currentRole === '운영진' ? '김민준' : '이서연'
      },
      chatCount: 0,
      referenceUrl: 'https://youtube.com',
      createdAt: new Date().toISOString().split('T')[0],
      description: newDesc || '함께 즐거운 연주를 다듬어봅시다!',
      applications: []
    };

    onAddRecruit(newSong);
    setShowAddForm(false);
    setSelectedRecId(newSong.id);
    onSendAlert(`[곡 모집 등록 완료] 신곡 '${newTitle}'의 제안 글이 작성되어 실시간 파트 매칭이 개시되었습니다.`);
    // Reset form states
    setNewTitle('');
    setNewArtist('');
    setNewDesc('');
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecId || !applyPart) return;

    const app: SongApplication = {
      memberName: currentRole === '운영진' ? '배진혁' : '이서연',
      part: applyPart,
      comment: applyComment || '이 곡 합주 꼭 하고 싶었습니다! 열심히 달립니다! 🔥',
      approved: false
    };

    onApplyForPart(selectedRecId, app);
    setApplyPart('');
    setApplyComment('');
    onSendAlert(`[지원성공] '${applyPart}' 슬롯에 대한 서포트 및 지원이 신청 완료되었습니다. 운영진 승인 대기 단계로 인입됩니다.`);
  };

  const handleApprove = (idx: number, app: SongApplication) => {
    if (!selectedRecId) return;
    onApproveApplication(selectedRecId, idx);
    onSendAlert(`[파트 승인 완료] ${app.memberName} 님을 '${app.part}' 최종 멤버로 승인 및 합주단 구성을 체결했습니다.`);
  };

  const statusColors: { [key in RecruitStatus]: string } = {
    '모집 중': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    '파트 부족': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    '준비 완료': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    '진행 중': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    '완료': 'bg-slate-800 text-slate-400 border-slate-700',
    '보류': 'bg-slate-900 text-slate-500 border-slate-800'
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-20 overflow-y-auto max-h-[100%] text-slate-100">
      
      <AnimatePresence mode="wait">
        {!activeRecruit ? (
          /* ================= LIST OF SONG RECRUITS ================= */
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Top Row Title and Add trigger */}
            <div className="flex justify-between items-center bg-slate-900 border border-slate-850 p-3.5 rounded-2xl">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">🎵 곡 같이하자 (실시간 매칭)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">자유롭게 곡을 추천하고 파트 가입을 제안하세요.</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4" /> 곡 올리기
              </button>
            </div>

            {/* Simulated Add Song Pop-up Panel */}
            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl flex flex-col gap-3"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> 신규 합주곡 제안 및 단원 소환
                  </h4>
                  <button 
                    onClick={() => setShowAddForm(false)} 
                    className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
                
                <form onSubmit={handleCreateSong} className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">합주곡명</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="예: 사건의 지평선"
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">아티스트</label>
                      <input
                        type="text"
                        required
                        value={newArtist}
                        onChange={e => setNewArtist(e.target.value)}
                        placeholder="예: 윤하"
                        className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">상세 모집 정보 및 보컬 성향 안내</label>
                    <textarea
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      placeholder="어떤 악기가 주로 부각되는지, 편곡 구성은 원곡과 어떻게 다를 것인지 적어주세요..."
                      className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      제안글 공지 올리기
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* List of cards */}
            <div className="flex flex-col gap-3">
              {recruits.map(rec => {
                const filledCount = Object.keys(rec.currentParticipants).length;
                const totalReq = rec.requiredParts.length;
                
                return (
                  <div 
                    key={rec.id}
                    onClick={() => setSelectedRecId(rec.id)}
                    className="bg-slate-900 border border-slate-800 p-4 rounded-2xl hover:border-slate-750 transition cursor-pointer flex flex-col gap-3"
                  >
                    {/* Card Top Row */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusColors[rec.status]}`}>
                          {rec.status}
                        </span>
                        <h4 className="text-base font-bold text-slate-100 mt-1.5 font-display">{rec.songTitle}</h4>
                        <p className="text-xs text-slate-400">{rec.creator} · {rec.artist}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">{rec.createdAt}</span>
                    </div>

                    {/* Mid segment showing parts matches block */}
                    <div className="bg-slate-950/60 p-2 border border-slate-850 rounded-xl text-[10px] flex gap-2 items-center">
                      <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <div className="flex shrink-0">
                        <span className="font-semibold text-slate-200">참여 단원: {filledCount}/{totalReq}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 items-center overflow-hidden">
                        {rec.requiredParts.map(part => {
                          const player = rec.currentParticipants[part];
                          return (
                            <span 
                              key={part}
                              className={`px-1.5 py-0.5 rounded text-[8px] border shrink-0 ${
                                player 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-slate-900 text-slate-500 border-slate-800 border-dashed'
                              }`}
                            >
                              {part} {player ? `(${player})` : '✕'}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Action Stats summary */}
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                      <span className="flex items-center gap-1 hover:text-slate-200 text-emerald-400 font-medium">
                        참고 링크 <ExternalLink className="w-3 h-3" />
                      </span>
                      <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded text-[10px]">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>의견 및 지원 현황 ({rec.applications.length + rec.chatCount})</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ================= SONG RECRUIT DETAIL VIEW ================= */
          <motion.div 
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Nav back trigger */}
            <button 
              onClick={() => setSelectedRecId(null)}
              className="self-start flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer pt-1"
            >
              <ChevronLeft className="w-4 h-4" /> 리스트로 돌아가기
            </button>

            {/* Big Detail Content Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[activeRecruit.status]}`}>
                  {activeRecruit.status}
                </span>
                <h3 className="text-xl font-display font-medium text-slate-100 mt-2.5">{activeRecruit.songTitle}</h3>
                <p className="text-xs text-slate-400">{activeRecruit.artist} · 추천인 {activeRecruit.creator}</p>
              </div>

              {/* Description box */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850/80">
                <p className="text-xs text-slate-300 leading-relaxed">{activeRecruit.description}</p>
                <div className="mt-3.5 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>제안 등록: {activeRecruit.createdAt}</span>
                  <a href="#" className="text-emerald-400 flex items-center gap-1 hover:underline">
                    원곡 가이드 유튜브 <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Slot and participants lists detail */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">모집 슬롯 및 구성 현황</h4>
                <div className="flex flex-col gap-2">
                  {activeRecruit.requiredParts.map(part => {
                    const memberName = activeRecruit.currentParticipants[part];
                    
                    return (
                      <div 
                        key={part}
                        className="flex justify-between items-center p-2.5 bg-slate-950/40 rounded-xl border border-slate-850 text-xs"
                      >
                        <span className="font-semibold text-slate-300">{part}</span>
                        {memberName ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 text-[10px]">
                            <CheckCircle className="w-3 h-3" /> 매칭 확정 ({memberName})
                          </div>
                        ) : (
                          <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            공석지원 가능
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 1. APPLY TO CO-OP FORM */}
              <div className="border-t border-slate-800 pt-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">이 파트로 지원하기</h4>
                
                <form onSubmit={handleApply} className="flex flex-col gap-2 bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-500 block mb-0.5">지원할 파트 선택</label>
                      <select
                        required
                        value={applyPart}
                        onChange={e => setApplyPart(e.target.value)}
                        className="w-full text-xs p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none"
                      >
                        <option value="">-- 파트 선택 --</option>
                        {activeRecruit.requiredParts
                          .filter(part => !activeRecruit.currentParticipants[part])
                          .map(part => (
                            <option key={part} value={part}>{part}</option>
                          ))
                        }
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-500 block mb-0.5">역할 권한</label>
                      <span className="text-xs block py-1 px-1.5 bg-slate-900 text-slate-400 rounded">
                        {currentRole === '운영진' ? '운영진 (기타)' : '부원 (보컬)'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1">
                    <label className="text-[9px] text-slate-500 block mb-0.5">지원 한마디</label>
                    <input
                      type="text"
                      required
                      value={applyComment}
                      onChange={e => setApplyComment(e.target.value)}
                      placeholder="승인을 위해 연주 경력이나 다짐을 한마디 공유하세요!"
                      className="w-full text-xs p-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!applyPart}
                    className={`mt-2 py-2 text-xs font-bold rounded-lg transition text-slate-950 cursor-pointer ${
                      applyPart ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-slate-800 text-slate-600 border border-slate-900 cursor-not-allowed'
                    }`}
                  >
                    목형 파트 지원 및 의견 제출
                  </button>
                </form>
              </div>

              {/* 2. SUBMITTED APPLICATIONS LIST */}
              <div className="border-t border-slate-800 pt-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">실시간 지원자 대기부 ({activeRecruit.applications.length})</h4>
                
                {activeRecruit.applications.length > 0 ? (
                  <div className="flex flex-col gap-2.5 mt-2">
                    {activeRecruit.applications.map((app, appIdx) => (
                      <div key={appIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-slate-100">{app.memberName} <span className="text-[10px] text-slate-500">({app.part} 파트 수록)</span></span>
                          {app.approved ? (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">임명 및 임베딩 완료</span>
                          ) : currentRole === '운영진' ? (
                            <button
                              onClick={() => handleApprove(appIdx, app)}
                              className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded hover:bg-emerald-400 cursor-pointer"
                            >
                              멤버 최종 승인하기
                            </button>
                          ) : (
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">심의 검토 중</span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-300 italic">“ {app.comment} ”</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 italic mt-2 text-center py-2 bg-slate-950/20 rounded border border-slate-950">대기 중인 단원 지망자가 없습니다.</p>
                )}
              </div>

              {/* 3. SIMULATED TEAM CHATBOX VIEW */}
              <div className="border-t border-slate-800 pt-3.5">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" /> 곡별 대화방 (미리보기)
                </h4>
                
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 max-h-[140px] overflow-y-auto flex flex-col gap-2 text-[10px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-500 font-semibold text-[9px]">정하늘 · 6/18</span>
                    <span className="text-slate-300 bg-slate-900 p-1.5 rounded-lg max-w-[240px] self-start leading-normal">
                      사건의 지평선처럼 질주하는 드럼 비트가 멋질 듯해요!
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-505 font-semibold text-[9px]">최유나 · 6/18</span>
                    <span className="text-slate-200 bg-emerald-500/10 border border-emerald-500/10 p-1.5 rounded-lg max-w-[240px] self-start leading-normal">
                      드러머로서 아주 자글자글 쪼개는 비트 준비 완료했습니다!
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
