/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, Calendar as CalendarIcon, Music as MusicIcon, 
  MessageSquare as MessageSquareIcon, User as UserIcon, Bell, 
  Sparkles, ShieldCheck, HelpCircle, Laptop, Landmark, ChevronRight, Play, Award, CheckCircle2 
} from 'lucide-react';

// Data types & Sample data load
import { UserRole, Schedule, SheetAndPractice, SongRecruit, RehearsalLog, SetlistItem, AttendanceStatus, SongApplication } from './types';
import { SAMPLE_MEMBERS, INITIAL_SCHEDULES, INITIAL_SHEETS, INITIAL_RECRUITS, INITIAL_REHEARSAL_LOGS, INITIAL_SETLIST, INITIAL_CONCERT } from './data';

// Component Views Load
import Onboarding from './components/Onboarding';
import HomeView from './components/HomeView';
import ScheduleView from './components/ScheduleView';
import PracticeView from './components/PracticeView';
import SongRecruitView from './components/SongRecruitView';
import RehearsalLogView from './components/RehearsalLogView';
import SetlistView from './components/SetlistView';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('부원');
  const [activeTab, setActiveTab] = useState<string>('홈'); // 홈, 일정, 음악, 대화, 내 정보
  const [activeMusicSubTab, setActiveMusicSubTab] = useState<'악보과제' | '합주기록'>('악보과제');

  // Unified States for mock databases to sync everything instantly
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [sheets, setSheets] = useState<SheetAndPractice[]>(INITIAL_SHEETS);
  const [recruits, setRecruits] = useState<SongRecruit[]>(INITIAL_RECRUITS);
  const [logs, setLogs] = useState<RehearsalLog[]>(INITIAL_REHEARSAL_LOGS);
  const [setlist, setSetlist] = useState<SetlistItem[]>(INITIAL_SETLIST);
  const [concert, setConcert] = useState(INITIAL_CONCERT);

  // Toast / Push notifications simulation state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastId, setToastId] = useState<number | null>(null);

  // Broadcast standard alerting
  const triggerToast = (message: string) => {
    if (toastId) clearTimeout(toastId);
    setToastMessage(message);
    const id = window.setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    setToastId(id);
  };

  // State modification callbacks
  const handleChangeAttendance = (scheduleId: string, memberName: string, status: AttendanceStatus) => {
    setSchedules(prev => prev.map(sched => {
      if (sched.id !== scheduleId) return sched;
      
      const nextAtt = sched.attendances.map(att => {
        if (att.memberName === memberName) {
          return { ...att, status };
        }
        return att;
      });

      // Recalculate quick stats based on the change
      const nextVocalCurrent = nextAtt.filter(a => a.status === '참석' && SAMPLE_MEMBERS.find(m => m.name === a.memberName)?.part === 'Vocal').length;
      const nextGuitarCurrent = nextAtt.filter(a => a.status === '참석' && SAMPLE_MEMBERS.find(m => m.name === a.memberName)?.part === 'Guitar').length;
      const nextBassCurrent = nextAtt.filter(a => a.status === '참석' && SAMPLE_MEMBERS.find(m => m.name === a.memberName)?.part === 'Bass').length;
      const nextDrumCurrent = nextAtt.filter(a => a.status === '참석' && SAMPLE_MEMBERS.find(m => m.name === a.memberName)?.part === 'Drum').length;
      const nextKeyboardCurrent = nextAtt.filter(a => a.status === '참석' && SAMPLE_MEMBERS.find(m => m.name === a.memberName)?.part === 'Keyboard').length;

      return {
        ...sched,
        attendances: nextAtt,
        partStatus: {
          vocal: { required: 1, current: nextVocalCurrent },
          guitar: { required: 2, current: nextGuitarCurrent },
          bass: { required: 1, current: nextBassCurrent },
          drum: { required: 1, current: nextDrumCurrent },
          keyboard: { required: 1, current: nextKeyboardCurrent },
        }
      };
    }));
  };

  const handleToggleSubmission = (sheetId: string) => {
    setSheets(prev => prev.map(sheet => {
      if (sheet.id !== sheetId) return sheet;
      const isComplete = sheet.submissionStatus === '제출 완료';
      return {
        ...sheet,
        submissionStatus: isComplete ? '미제출' : '제출 완료'
      };
    }));
  };

  const handleAddFeedback = (sheetId: string, feedback: string) => {
    setSheets(prev => prev.map(sheet => {
      if (sheet.id !== sheetId) return sheet;
      return {
        ...sheet,
        feedback,
        feedbackAuthor: '김민준 (운영진)'
      };
    }));
  };

  const handleAddRecruit = (newRecruit: SongRecruit) => {
    setRecruits(prev => [newRecruit, ...prev]);
  };

  const handleApplyForPart = (recruitId: string, app: SongApplication) => {
    setRecruits(prev => prev.map(rec => {
      if (rec.id !== recruitId) return rec;
      return {
        ...rec,
        applications: [...rec.applications, app]
      };
    }));
  };

  const handleApproveApplication = (recruitId: string, appIndex: number) => {
    setRecruits(prev => prev.map(rec => {
      if (rec.id !== recruitId) return rec;
      const targetApp = rec.applications[appIndex];
      if (!targetApp) return rec;

      const nextApps = rec.applications.map((app, idx) => 
        idx === appIndex ? { ...app, approved: true } : app
      );

      const nextParticipants = {
        ...rec.currentParticipants,
        [targetApp.part]: targetApp.memberName
      };

      // Determine statuses auto
      const isFullyStaffed = rec.requiredParts.every(part => nextParticipants[part]);

      return {
        ...rec,
        applications: nextApps,
        currentParticipants: nextParticipants,
        status: isFullyStaffed ? '준비 완료' : '진행 중'
      };
    }));
  };

  const handleAddLog = (newLog: RehearsalLog) => {
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAddSongToSetlist = (item: SetlistItem) => {
    setSetlist(prev => [...prev, item]);
  };

  const handleUpdateSetlistOrder = (updated: SetlistItem[]) => {
    setSetlist(updated);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-800 flex flex-col items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden select-none">
      
      {/* Simulation shell for beautiful mockup viewport presentation */}
      <div className="w-full max-w-[420px] h-screen max-h-[880px] bg-white relative md:rounded-[40px] md:border-[12px] md:border-slate-900 md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
        
        {/* Dynamic simulator Notch/Speaker */}
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-[28px] bg-slate-900 rounded-b-2xl z-50 text-center">
          <div className="w-12 h-1 bg-slate-950 rounded-full mx-auto mt-2" />
        </div>

        {/* 1. TOAST ALERTS - OVERLAY LAYER */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 50, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute left-4 right-4 bg-white border-l-4 border-indigo-600 shadow-lg p-3.5 rounded-xl z-50 flex items-start gap-2.5 text-xs text-slate-800 border border-slate-100"
            >
              <Bell className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Orpheus 알림</p>
                <p className="text-slate-500 mt-0.5 leading-snug">{toastMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTAINER STREAM */}
        <div className="flex-1 overflow-hidden relative">
          {!hasStarted ? (
            /* ================= ONBOARDING VIEW ================= */
            <Onboarding onStart={() => setHasStarted(true)} />
          ) : (
            /* ================= DYNAMIC TABS VIEW ================= */
            <div className="h-full flex flex-col justify-between">
              
              {/* Scrollable View Frame */}
              <div className="flex-1 overflow-y-auto mt-0 md:mt-6 bg-slate-50">
                {activeTab === '홈' && (
                  <HomeView
                    currentRole={currentRole}
                    onRoleToggle={(role) => {
                      setCurrentRole(role);
                      triggerToast(`사용자 모드가 '${role}'(으)로 전환되었습니다.`);
                    }}
                    schedules={schedules}
                    sheets={sheets}
                    recruits={recruits}
                    logs={logs}
                    onNavigate={(tab) => setActiveTab(tab)}
                    onSendAlert={triggerToast}
                  />
                )}

                {activeTab === '일정' && (
                  <ScheduleView
                    currentRole={currentRole}
                    schedules={schedules}
                    onChangeAttendance={handleChangeAttendance}
                    onSendAlert={triggerToast}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === '음악' && (
                  <div className="h-full flex flex-col">
                    {/* Sub navigation for Sheets vs. Rehearsals */}
                    <div className="grid grid-cols-2 bg-white border-b border-slate-100 sticky top-0 z-20">
                      <button
                        onClick={() => setActiveMusicSubTab('악보과제')}
                        className={`py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                          activeMusicSubTab === '악보과제' 
                            ? 'text-indigo-600 border-indigo-600 bg-slate-50/50' 
                            : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                      >
                        🎵 악보함 & 과제
                      </button>
                      <button
                        onClick={() => setActiveMusicSubTab('합주기록')}
                        className={`py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                          activeMusicSubTab === '합주기록' 
                            ? 'text-indigo-600 border-indigo-600 bg-slate-50/50' 
                            : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                      >
                        🎸 합주 피드백 일지
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-slate-50">
                      {activeMusicSubTab === '악보과제' ? (
                        <PracticeView
                          currentRole={currentRole}
                          sheets={sheets}
                          onToggleSubmission={handleToggleSubmission}
                          onAddFeedback={handleAddFeedback}
                          onSendAlert={triggerToast}
                        />
                      ) : (
                        <RehearsalLogView
                          currentRole={currentRole}
                          logs={logs}
                          onAddLog={handleAddLog}
                          onSendAlert={triggerToast}
                        />
                      )}
                    </div>
                  </div>
                )}

                {activeTab === '대화' && (
                  <SongRecruitView
                    currentRole={currentRole}
                    recruits={recruits}
                    onAddRecruit={handleAddRecruit}
                    onApplyForPart={handleApplyForPart}
                    onApproveApplication={handleApproveApplication}
                    onSendAlert={triggerToast}
                  />
                )}

                {activeTab === '내 정보' && (
                  /* ================= MY ACCOUNT PROFILER & DISCLOSURE ================= */
                  <div className="p-4 flex flex-col gap-5 overflow-y-auto max-h-[100%] text-slate-700 bg-slate-50">
                    
                    {/* User profile card */}
                    <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="w-14 h-14 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0">
                        {currentRole === '운영진' ? 'M' : 'S'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900">{currentRole === '운영진' ? '김민준 (운영진)' : '이서연 (부원)'}</h4>
                          <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                            {currentRole === '운영진' ? 'L3 리더' : 'L2 단원'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-550">파트 배정: {currentRole === '운영진' ? 'First Guitarist' : 'Main Vocalist'}</p>
                        <p className="text-[10px] text-slate-400 mt-1">소속: 숭실대학교 오르페우스 (Orpheus)</p>
                      </div>
                    </div>

                    {/* Interactive Level Meter */}
                    <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-indigo-600" /> 다음 축제 준비 활동 레벨
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">85% 점수율</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[85%]" />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">이번 주 과제 제출 완료 및 출석 완료로 가산 가점을 획득했습니다.</p>
                    </div>

                    {/* Setlist & Concert Invitation Builder Navigation CTA card */}
                    <div 
                      onClick={() => setActiveTab('셋리스트')}
                      className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200/80 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition active:scale-[0.98] shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-150 text-indigo-600 rounded-xl border border-indigo-200/40">
                          <Landmark className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">공연 셋리스트 & 모바일 초대장</h4>
                          <p className="text-[10.5px] text-indigo-750 mt-1">공연 순서 곡 편제 및 실시간 관객 초대장 빌드</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-indigo-500" />
                    </div>

                    {/* Developer presentation panel for showcase */}
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-sm">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> 발표자(피치)를 위한 디지털스토리텔링 가이드
                      </h4>
                      
                      <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                        <p>
                          본 Orpheus 모바일 목업은 <strong>디지털스토리텔링 기말 과제 발표</strong>에 최적화하여 설계되었습니다. 홈 탭 상단에서 
                          <span className="text-indigo-600 font-semibold px-1">“운영진 ↔ 부원”</span> 토글 역할을 실시간 전환하며 두 개의 유기적인 워크플로우를 대조해 캡처해 보세요.
                        </p>
                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-[10.5px]">
                          <p className="font-bold text-slate-800">💡 시나리오 추천 루트:</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600 text-left">
                            <li><strong>부원 모드</strong>: 홈에서 '참석 응답 미완료' 발견 → 일정 탭에서 <strong>참석</strong> 버튼 누르는 순간 상태 동기화 완료!</li>
                            <li><strong>악보/과제</strong>: 'Supernova' 과제 제출 버튼을 눌러 모킹 오디오 음원을 업로드하는 원스톱 모션 구현.</li>
                            <li><strong>관객 초대장</strong>: 셋리스트 탭에서 <strong>“초대장 미리보기”</strong>를 누르면, 대동제 당일 관객에게 배포할 <b>모바일 초대장과 우선입장 QR e-티켓</b> 다이얼로그를 감동적인 레이아웃으로 열어 보일 수 있습니다.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Exit simulation link */}
                    <button
                      onClick={() => setHasStarted(false)}
                      className="w-full py-3 bg-red-50 hover:bg-red-100/60 border border-red-200 text-red-650 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      온보딩 인트로 화면으로 가기
                    </button>
                    
                  </div>
                )}

                {activeTab === '셋리스트' && (
                  /* ================= SETLIST & MOBILE INVITATION EXTRA PAGE ================= */
                  <SetlistView
                    currentRole={currentRole}
                    setlist={setlist}
                    concert={concert}
                    onAddSongToSetlist={handleAddSongToSetlist}
                    onUpdateSetlistOrder={handleUpdateSetlistOrder}
                    onSendAlert={triggerToast}
                  />
                )}
              </div>

              {/* ------------------ BOTTOM PORT NAVIGATION BAR ------------------ */}
              <div className="bg-white border-t border-slate-100 grid grid-cols-5 py-2 px-1 relative z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                {/* Let's render the exact requested navigation items */}
                {[
                  { id: '홈', label: '홈', icon: HomeIcon },
                  { id: '일정', label: '일정', icon: CalendarIcon },
                  { id: '음악', label: '음악', icon: MusicIcon },
                  { id: '대화', label: '대화', icon: MessageSquareIcon },
                  { id: '내 정보', label: '내 정보', icon: UserIcon },
                ].map(tabItem => {
                  const IconComponent = tabItem.icon;
                  const isCurrent = activeTab === tabItem.id;
                  
                  return (
                    <button
                      key={tabItem.id}
                      onClick={() => setActiveTab(tabItem.id)}
                      className="flex flex-col items-center justify-center gap-1 py-1 text-center cursor-pointer transition relative group animate-none"
                    >
                      <span className={`p-1.5 rounded-xl transition ${
                        isCurrent 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </span>
                      <span className={`text-[9.5px] font-sans font-semibold tracking-tight transition ${
                        isCurrent ? 'text-indigo-600 font-bold' : 'text-slate-450 group-hover:text-slate-600'
                      }`}>
                        {tabItem.id}
                      </span>
                      {isCurrent && (
                        <span className="absolute bottom-0 w-1 h-1 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Extra helper badge outside the phone for easy review in development iframe */}
      <div className="hidden lg:flex flex-col items-center gap-2.5 max-w-[280px] p-5 bg-white border border-slate-200/80 rounded-2xl text-xs absolute right-6 top-1/2 transform -translate-y-1/2 shadow-sm">
        <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
          <Laptop className="w-4 h-4 text-indigo-600" /> 모바일 시뮬레이터 안내
        </h5>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          본 어플리케이션은 <strong>발표용 MVP 모바일 사양</strong>으로 렌더링되고 있습니다. 아이폰 포트 규격의 고해상도 디자인 요소를 통해 프레젠테이션 및 캡처가 가능합니다.
        </p>
        <div className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5 text-[10.5px]">
          <p className="font-semibold text-indigo-600">⚡ 특화 기능 신속 맵:</p>
          <p className="text-slate-600">· <b>운영진 홈</b>: 참석 응답률, 부족 파트 집계, 긴급 알림 전송</p>
          <p className="text-slate-600">· <b>부원 홈</b>: 오늘 가입할 곡, 연습 과제 완료 전환</p>
          <p className="text-slate-600">· <b>내 정보</b>: 대동제 정기공연 셋리스트 수정 및 모바일 모바일 관객 초대장 인쇄</p>
        </div>
      </div>

    </div>
  );
}

