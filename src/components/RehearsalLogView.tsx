import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Plus, ChevronRight, Play, Pause, Award, Clock, 
  CheckCircle2, Users, AlertTriangle, BookOpen, Music, Check 
} from 'lucide-react';
import { RehearsalLog, UserRole, RehearsalSongStatus } from '../types';

interface RehearsalLogViewProps {
  currentRole: UserRole;
  logs: RehearsalLog[];
  onAddLog: (newLog: RehearsalLog) => void;
  onSendAlert: (message: string) => void;
}

export default function RehearsalLogView({
  currentRole,
  logs,
  onAddLog,
  onSendAlert,
}: RehearsalLogViewProps) {
  const [selectedLogId, setSelectedLogId] = useState<string>(logs[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Create state for new Rehearsal log
  const [newDate, setNewDate] = useState('2026-06-19');
  const [newMemo, setNewMemo] = useState('');
  const [newNext, setNewNext] = useState('');
  const [newAssignee, setNewAssignee] = useState('전원');
  const [newIssues, setNewIssues] = useState('');

  const activeLog = logs.find(l => l.id === selectedLogId) || logs[0];

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      onSendAlert('[오디오 플레이어 재생] 합주 중 기타 솔로 리프 피드백용 실시간 Jam 세션 엠바고 녹음본 재생을 개시했습니다.');
    }
  };

  const statusColors: { [key in RehearsalSongStatus]: string } = {
    '시작 전': 'bg-slate-800 text-slate-400',
    '연습 중': 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    '추가 연습 필요': 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    '공연 가능': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold',
    '완료': 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
  };

  const handleApplyXP = () => {
    onSendAlert('[활동 레벨 반영] 이번 합주에 공로를 기록한 유저들에게 활동지수 점수(동아리 기여도)가 정상 가산 전송되었습니다!');
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemo || !newNext) return;

    const added: RehearsalLog = {
      id: `log-${Date.now()}`,
      rehearsalDate: newDate,
      attendees: ['김민준', '배진혁', '이서연', '박지훈', '최유나', '정하늘'],
      songs: [
        { songTitle: '사건의 지평선', status: '공연 가능' },
        { songTitle: 'Square', status: '연습 중' }
      ],
      memo: newMemo,
      issues: newIssues || '이슈 없음',
      nextAssignment: newNext,
      assignee: newAssignee,
      recordingFileName: 'orpheus_jam_session_latest.wav',
      recordingFileUrl: '#',
      isXPApplied: false
    };

    onAddLog(added);
    setSelectedLogId(added.id);
    setShowForm(false);
    // Reset inputs
    setNewMemo('');
    setNewNext('');
    setNewIssues('');
    onSendAlert(`[기록 발행 완료] ${newDate} 일자 합주 리포트가 최종 공유되었습니다. 부원 대시보드에 과제로 매칭 이식됩니다.`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-20 overflow-y-auto max-h-[100%] text-slate-100">
      
      {/* Title Segment and Create Trigger */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-850 p-3.5 rounded-2xl">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">🎸 합주 피드백 & 복기 기록</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">합주 결과, 피드백, 보완점, 다음 과제를 복기하세요.</p>
        </div>
        {currentRole === '운영진' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition active:scale-95"
          >
            <Plus className="w-4 h-4" /> 기록 작성
          </button>
        )}
      </div>

      {/* Interactive Form panel for Admin */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl flex flex-col gap-3"
        >
          <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-400" /> 오늘의 합주 기록부 업로드
            </h4>
            <button onClick={() => setShowForm(false)} className="text-[10px] text-slate-400 hover:text-slate-200">닫기</button>
          </div>

          <form onSubmit={handleSubmitLog} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">합주 날짜</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full text-xs p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">다음 과제 담당자</label>
                <input
                  type="text"
                  required
                  value={newAssignee}
                  onChange={e => setNewAssignee(e.target.value)}
                  placeholder="예: 전원 또는 특정 이름"
                  className="w-full text-xs p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">합주 종합 평가 메모</label>
              <textarea
                required
                value={newMemo}
                onChange={e => setNewMemo(e.target.value)}
                placeholder="오늘 어떤 파트 연결이 매끄러웠는지, 박자가 튀었던 부분은 어디인지 기입하세요..."
                className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
                rows={2}
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">차기 특이사항 및 긴급 이슈</label>
              <input
                type="text"
                value={newIssues}
                onChange={e => setNewIssues(e.target.value)}
                placeholder="예: 최유나 부원 30분 지각 예정, 기구 보완 필요 등..."
                className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">다음 합주 전 해결할 연습 과제</label>
              <input
                type="text"
                required
                value={newNext}
                onChange={e => setNewNext(e.target.value)}
                placeholder="예: 후렴 32마디 전조(Key Change) 파트 보이싱 맞추기"
                className="w-full text-xs p-2 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 bg-slate-850 text-slate-400 text-xs rounded-xl cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
              >
                기록 발행 고지
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Rehearsal log history picker */}
      <div className="inline-flex gap-2 overflow-x-auto pb-1 shrink-0">
        {logs.map(log => {
          const isSelected = log.id === selectedLogId;
          return (
            <button
              key={log.id}
              onClick={() => setSelectedLogId(log.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border shrink-0 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-slate-100 border-slate-100 text-slate-950 font-bold' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              🗓️ {log.rehearsalDate} 합주 리포트
            </button>
          );
        })}
      </div>

      {activeLog && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
          
          {/* Header element with date */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] bg-slate-850 text-blue-400 px-2 py-0.5 rounded font-mono font-semibold">REHEARSAL ARCHIVE</span>
              <h3 className="text-lg font-display font-medium text-slate-100 mt-1">{activeLog.rehearsalDate} 합주 복기 일지</h3>
            </div>
            
            {activeLog.isXPApplied ? (
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-1 rounded-lg flex items-center gap-1">
                <Check className="w-3 h-3" /> 활동점수 반영 완료
              </span>
            ) : currentRole === '운영진' ? (
              <button
                onClick={handleApplyXP}
                className="text-[9px] font-bold text-slate-950 bg-emerald-500 px-2 py-1 rounded-lg hover:bg-emerald-400 flex items-center gap-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" /> 활동점수 반영하기
              </button>
            ) : (
              <span className="text-[9px] text-slate-400 bg-slate-850 px-2 py-1 rounded">미기록</span>
            )}
          </div>

          {/* Attendees summary row */}
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">참석자 ({activeLog.attendees.length}명):</span>
            <span className="text-slate-200 font-semibold">{activeLog.attendees.join(', ')}</span>
          </div>

          {/* List of practiced songs with statuses */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">오늘 연습한 곡 목록 & 목표치</h4>
            <div className="flex flex-col gap-2">
              {activeLog.songs.map((song, sIdx) => (
                <div key={sIdx} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-blue-400" /> {song.songTitle}
                  </span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${statusColors[song.status]}`}>
                    {song.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Big feedback and observations */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">합주 총평 및 연주 향상 코멘트</h4>
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 leading-relaxed italic">
                “ {activeLog.memo} ”
              </div>
            </div>

            {activeLog.issues && (
              <div>
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 돌발 현장 이슈 및 장비 이상
                </h4>
                <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-slate-300">
                  {activeLog.issues}
                </div>
              </div>
            )}
          </div>

          {/* Next practice assignment row */}
          <div className="p-4 bg-gradient-to-r from-orange-950/30 to-slate-950 border border-orange-500/10 rounded-xl">
            <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-500" /> 차기 인오프라인 합주 과제 (Next Actions)
            </h4>
            <p className="text-xs font-semibold text-slate-200 leading-relaxed">
              📌 {activeLog.nextAssignment}
            </p>
            <p className="text-[10px] text-slate-400 mt-2">
              담당 단원: <span className="font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md">{activeLog.assignee}</span> · 다음 주 합주 인입 12시간 전까지 전용 과제 제출 필수!
            </p>
          </div>

          {/* Audio Jam Session recording mock player */}
          {activeLog.recordingFileName && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleTogglePlay}
                  className={`w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition ${
                    isPlaying 
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse' 
                      : 'bg-slate-800 text-slate-205 hover:bg-slate-705'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-200 translate-x-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-semibold text-slate-205">합주 엠바고 백업 리모트 오디오 녹음</p>
                  <p className="text-[10px] text-slate-505 font-mono">{activeLog.recordingFileName}</p>
                </div>
              </div>

              {isPlaying && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-3.5 bg-emerald-400 rounded-sm animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-1.5 h-5 bg-emerald-400 rounded-sm animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-4 bg-emerald-400 rounded-sm animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-2 bg-emerald-400 rounded-sm animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
