import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Download, CheckCircle, Clock, AlertTriangle, 
  MessageSquare, Send, Award, HelpCircle, X, ChevronRight, User 
} from 'lucide-react';
import { SheetAndPractice, UserRole } from '../types';

interface PracticeViewProps {
  currentRole: UserRole;
  sheets: SheetAndPractice[];
  onToggleSubmission: (sheetId: string) => void;
  onAddFeedback: (sheetId: string, feedback: string) => void;
  onSendAlert: (message: string) => void;
}

export default function PracticeView({
  currentRole,
  sheets,
  onToggleSubmission,
  onAddFeedback,
  onSendAlert,
}: PracticeViewProps) {
  const [selectedSheetId, setSelectedSheetId] = useState<string>(sheets[0]?.id || '');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [recordingTitle, setRecordingTitle] = useState('');

  const activeSheet = sheets.find(s => s.id === selectedSheetId) || sheets[0];

  if (!activeSheet) {
    return <div className="p-4 text-slate-400">등록된 과제/악보 자료가 없습니다.</div>;
  }

  const handleDownloadSheet = () => {
    onSendAlert(`[다운로드 완료] '${activeSheet.songTitle} (${activeSheet.part} 파트 악보 ${activeSheet.version})' PDF 파일 다운로드가 시작되었습니다.`);
  };

  const handleOpenSubmit = () => {
    setFileAttached(false);
    setRecordingTitle('');
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onToggleSubmission(activeSheet.id);
    setShowSubmitModal(false);
    onSendAlert(`[과제 제출 성공] 대동제 준비를 위한 '${activeSheet.songTitle}' 연습 녹음이 정상 제출되었습니다.`);
  };

  const handleAddFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    onAddFeedback(activeSheet.id, feedbackText);
    setFeedbackText('');
    setShowFeedbackInput(false);
    onSendAlert(`[피드백 등록 완료] ${activeSheet.part} 파트 연습 과제에 소중한 코멘트를 달아주셨습니다.`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-20 overflow-y-auto max-h-[100%] text-slate-100">
      
      {/* Search / Playlist header info */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-850 p-3 rounded-2xl">
        <h3 className="text-sm font-semibold text-slate-200">악보 자료실 및 전용 과제</h3>
        <span className="text-[10px] bg-slate-800 text-emerald-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
          TOTAL: {sheets.length}
        </span>
      </div>

      {/* Song selector rows */}
      <div className="flex flex-col gap-2">
        {sheets.map(sheet => {
          const isSubmitted = sheet.submissionStatus === '제출 완료';
          const isSelected = sheet.id === selectedSheetId;
          
          return (
            <div 
              key={sheet.id}
              onClick={() => {
                setSelectedSheetId(sheet.id);
                setShowFeedbackInput(false);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                isSelected 
                  ? 'bg-slate-900 border-emerald-500 shadow-md' 
                  : 'bg-slate-900/50 border-slate-850 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  sheet.part === 'Guitar' ? 'bg-emerald-500/10 text-emerald-400' :
                  sheet.part === 'Vocal' ? 'bg-rose-500/10 text-rose-400' :
                  sheet.part === 'Bass' ? 'bg-blue-500/10 text-blue-400' :
                  sheet.part === 'Keyboard' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{sheet.songTitle}</h4>
                  <p className="text-[10px] text-slate-400">{sheet.artist} · <span className="font-semibold text-slate-300">{sheet.part}</span>({sheet.version})</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isSubmitted 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                    : 'bg-orange-500/10 text-orange-400 border border-orange-500/25'
                }`}>
                  {isSubmitted ? '제출 완료' : '미제출'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Material Details Frame */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
        
        {/* Header Segment */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-100">{activeSheet.songTitle}</h3>
            <p className="text-xs text-slate-400">{activeSheet.artist} · {activeSheet.part} 오피셜 악보</p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">최종 업데이트 {activeSheet.updatedAt}</span>
        </div>

        {/* 1. Sheet music file segment */}
        <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">오리지널 PDF 기보 파트보</p>
              <p className="text-[10px] text-slate-400">버전: {activeSheet.version} 최신 패치 / {activeSheet.part} 전용</p>
            </div>
          </div>
          
          <button
            onClick={handleDownloadSheet}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            악보 받기
          </button>
        </div>

        {/* 2. Practice Assignment details */}
        <div className="bg-slate-950/30 border border-slate-850 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-400" /> 연습 과제 상세 요약
            </span>
            <span className="text-[10px] text-slate-500">제출 마감: {activeSheet.dueDate} 23:59까지</span>
          </div>

          <h4 className="text-xs font-semibold text-slate-200 mb-2 leading-relaxed bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
            📌 {activeSheet.assignmentTitle}
          </h4>

          {/* Submission and file attach simulated status */}
          <div className="flex items-center justify-between mt-4 p-2 bg-slate-950/60 rounded-lg">
            <div className="flex items-center gap-2">
              {activeSheet.submissionStatus === '제출 완료' ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle className="w-4 h-4" /> 과제 완료 상태입니다!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold">
                  <Clock className="w-4 h-4 text-orange-500 animate-pulse" /> 연습 음원 미제출 상태
                </span>
              )}
            </div>

            {/* Submit Toggle button */}
            <button
              onClick={handleOpenSubmit}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-transform cursor-pointer active:scale-95 ${
                activeSheet.submissionStatus === '제출 완료'
                  ? 'bg-slate-800 hover:bg-slate-705 text-slate-300 border border-slate-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {activeSheet.submissionStatus === '제출 완료' ? '재제출하기' : '과제 제출하기'}
            </button>
          </div>
        </div>

        {/* 3. Feedback section from leaders */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/10 p-3.5 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> 운영진의 밀착형 연습 피드백
            </span>
            {currentRole === '운영진' && (
              <button
                onClick={() => setShowFeedbackInput(!showFeedbackInput)}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
              >
                {activeSheet.feedback ? '피드백 수정' : '피드백 등록'}
              </button>
            )}
          </div>

          {activeSheet.feedback ? (
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-850">
              <p className="text-xs text-slate-300 leading-relaxed italic">“ {activeSheet.feedback} ”</p>
              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <User className="w-2.5 h-2.5 text-slate-400" /> {activeSheet.feedbackAuthor || '운영진 피드백'}
                </span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">합주 반영완료</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-950/30 rounded-lg border border-slate-900/60 text-xs text-slate-400">
              아직 피드백이 등록되지 않았습니다.
              {currentRole === '부원' 
                ? ' 과제를 먼저 제출하시면 운영진 멘토링 코멘트가 달립니다.' 
                : ' 아래 파트원의 성장을 지원하기 위해 꼼꼼한 피드백을 전달해 주세요!'}
            </div>
          )}

          {/* Leader Feedback Input Form */}
          {showFeedbackInput && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleAddFeedbackSubmit}
              className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-2"
            >
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="부원의 연습곡 연주 향상을 돕기 위한 조언을 기록하세요 (예: 피치 유지, 드럼 비트 보완점 등)..."
                className="w-full text-xs p-2 text-slate-200 bg-slate-900 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
                rows={3}
              />
              <div className="flex justify-end gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setShowFeedbackInput(false)}
                  className="px-2 py-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 text-slate-950 rounded font-bold cursor-pointer"
                >
                  등록
                </button>
              </div>
            </motion.form>
          )}
        </div>

      </div>

      {/* 4. Assignment submission modal popup simulation */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl w-full max-w-sm flex flex-col gap-4 text-left"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-base font-bold text-slate-100">연습 궤적 과제물 제출</h4>
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">대상 과제:</p>
                <p className="text-xs font-semibold text-emerald-400">
                  [{activeSheet.songTitle}] {activeSheet.assignmentTitle}
                </p>
              </div>

              <form onSubmit={handleConfirmSubmit} className="flex flex-col gap-3">
                
                {/* Simulated file attachments */}
                <div 
                  onClick={() => {
                    setFileAttached(true);
                    setRecordingTitle(`${activeSheet.songTitle.replace(/\s+/g, '_')}_${activeSheet.part}_pitch_record.mp3`);
                  }}
                  className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-colors ${
                    fileAttached 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850/40'
                  }`}
                >
                  {fileAttached ? (
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                      <p className="text-xs text-slate-200 font-bold">오디오 녹음본 첨부 완료!</p>
                      <p className="text-[10px] text-slate-400 font-mono italic max-w-[200px] truncate">{recordingTitle}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Download className="w-8 h-8 text-slate-500 transform rotate-180 mb-1" />
                      <p className="text-xs text-slate-300 font-semibold">이곳을 클릭하여 녹음 파일 올리기</p>
                      <p className="text-[10px] text-slate-500">M4A, MP3, WAV 지원 (최대 50MB)</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400">하고 싶은 한마디</label>
                  <input
                    type="text"
                    required
                    defaultValue="이번 주 리프 2절 싱코페이션 박자가 조금 난해해서 메트로놈 키고 여러 번 끊어서 연습했습니다! 잘 들어주세요."
                    className="w-full text-xs p-2 bg-slate-950 border border-slate-850 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-xl font-bold cursor-pointer"
                  >
                    이전으로
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs rounded-xl font-bold cursor-pointer transition"
                  >
                    과제 최종 올리기
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
