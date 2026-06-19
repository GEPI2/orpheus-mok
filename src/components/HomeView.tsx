import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, Calendar, FileText, CheckCircle2, ShieldAlert, AlertTriangle, 
  ArrowRight, Radio, Bell, DollarSign, ExternalLink, Inbox, MessageSquare 
} from 'lucide-react';
import { UserRole, Schedule, SheetAndPractice, SongRecruit, RehearsalLog } from '../types';

interface HomeViewProps {
  currentRole: UserRole;
  onRoleToggle: (role: UserRole) => void;
  schedules: Schedule[];
  sheets: SheetAndPractice[];
  recruits: SongRecruit[];
  logs: RehearsalLog[];
  onNavigate: (tab: string) => void;
  onSendAlert: (message: string) => void;
}

export default function HomeView({
  currentRole,
  onRoleToggle,
  schedules,
  sheets,
  recruits,
  logs,
  onNavigate,
  onSendAlert,
}: HomeViewProps) {
  
  // Find next active schedule
  const nextSchedule = schedules[0] || null;
  const totalSchedules = schedules.length;

  // Derive stats for Admin View
  const attendances = nextSchedule?.attendances || [];
  const answeredCount = attendances.filter(a => a.status === '참석' || a.status === '불참').length;
  const pendingMembers = attendances.filter(a => a.status === '미정' || a.status === '미응답').map(a => a.memberName);
  const totalMembers = attendances.length || 24; // If mocked 24 from prompt
  const displayAnswered = answeredCount; 
  const displayTotal = totalMembers;
  
  const pendingAssignments = sheets.filter(s => s.submissionStatus === '미제출');
  const unpaidCount = 2; // Prompt says "회비 미납: 2명"
  
  // Interactive alert flow
  const handleAdminAlert = () => {
    if (pendingMembers.length > 0) {
      onSendAlert(`[Orpheus 알림] 아직 이번 주 합주 참석 응답을 하지 않은 ${pendingMembers.join(', ')}님, 앱에서 즉시 응답해주세요!`);
    } else {
      onSendAlert('[Orpheus 알림] 모든 부원이 참석 응답을 완료했습니다!');
    }
  };

  const handleDeficitAlert = () => {
    onSendAlert('[Orpheus 알림] 다음 합주에 보컬(이서연)과 키보드(정하늘) 파트의 참석 확인이 시급합니다! 일정 탭을 확인하세요.');
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-20 overflow-y-auto max-h-[100%] bg-slate-50">
      
      {/* 1. Header with App Name and Role Toggle */}
      <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <h2 className="text-[14px] font-display font-extrabold text-slate-900">오르페우스 Orpheus</h2>
        </div>
        
        {/* Role toggle switch */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
          <button 
            onClick={() => onRoleToggle('운영진')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${currentRole === '운영진' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-650'}`}
          >
            운영진
          </button>
          <button 
            onClick={() => onRoleToggle('부원')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${currentRole === '부원' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-655'}`}
          >
            부원
          </button>
        </div>
      </div>

      {/* 2. Welcome Banner */}
      <div className="p-4 bg-indigo-50/40 border border-indigo-100/80 rounded-2xl relative overflow-hidden shadow-sm">
        <div className="absolute right-3 bottom-0 opacity-5">
          <Radio className="w-20 h-20 text-indigo-600" />
        </div>
        <p className="text-[9.5px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">MEMBERSHIP HOME</p>
        <h3 className="text-base font-display font-bold text-slate-900">
          {currentRole === '운영진' ? '박배민 운영진님, 반갑습니다!' : '이서연 부원님, 합주 3일 전입니다.'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 leading-snug">
          {currentRole === '운영진' ? '이번 주 합주 준비와 공석 파트를 검토하고 알림을 보내세요.' : '오늘 제출해야 할 악보 연습 과제와 공지를 확인하세요.'}
        </p>
      </div>

      {/* 3. Role-specific Dynamic Content */}
      {currentRole === '운영진' ? (
        /* ==================== ADMIN HOME VIEW ==================== */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Main rehearsal readiness status */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">이번 주 정기 합주</span>
                <h4 className="text-base font-bold text-slate-900 mt-1.5">6월 22일 토요일 18:00</h4>
                <p className="text-xs text-slate-500">장소: B101 합주실</p>
              </div>
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>

            {/* Grid stats */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-indigo-500" /> 참석 응답률
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-1.5">{displayAnswered}/{displayTotal} <span className="text-xs text-slate-450 font-normal">명</span></span>
                <p className="text-[10px] text-slate-400 mt-1 truncate">미응답: {pendingMembers.length === 0 ? '없음' : pendingMembers.join(', ')}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> 부족 파트
                </span>
                <span className="text-xs font-bold text-rose-600 mt-2">보컬 1명, 키보드 1명</span>
                <p className="text-[10px] text-slate-400 mt-1 truncate">이서연, 정하늘(미정)</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> 악보 준비 상태
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-1.5">5/6 <span className="text-xs text-slate-450 font-normal">곡</span></span>
                <p className="text-[10px] text-slate-400 mt-1">신스 악보 보충 요망</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> 과제 미제출
                </span>
                <span className="text-base font-extrabold text-amber-600 mt-1.5">{pendingAssignments.length} <span className="text-xs text-slate-450 font-normal">명</span></span>
                <p className="text-[10px] text-slate-400 mt-1">기타, 키보드 미제출</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex gap-2">
                <button 
                  onClick={handleAdminAlert}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm"
                >
                  <Bell className="w-3.5 h-3.5" /> 미응답 리마인드 전송
                </button>
                <button 
                  onClick={handleDeficitAlert}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer shadow-sm"
                >
                  인원 보강 촉구
                </button>
              </div>
              <button
                onClick={() => onNavigate('일정')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-slate-600 hover:text-slate-800 bg-slate-50 border border-slate-250/60 text-xs rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                상세 출석 및 합주 기획 화면으로 이동 <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            </div>
          </div>

          {/* Operational Checklist */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-indigo-600" /> 운영 긴급 체크리스트
            </h4>
            
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-rose-50 text-rose-600 rounded-lg shrink-0 mt-0.5 border border-rose-100">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 font-bold">회비 납부 현황 미달</p>
                    <p className="text-[10px] text-slate-500">총 2명 미납 (최유나, 정하늘)</p>
                  </div>
                </div>
                <button 
                  onClick={() => onSendAlert('[Orpheus 회비] 회비 미납 상태인 최유나, 정하늘 님께 알림을 전송했습니다.')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 cursor-pointer shadow-sm"
                >
                  청구
                </button>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5 border border-amber-100">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 font-bold">동아리 연합회 보고서 제출</p>
                    <p className="text-[10px] text-slate-500">연합회 보고 승인 요청 대기 중</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-500 rounded-lg font-bold border border-rose-100">오류 발생</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ==================== MEMBER HOME VIEW ==================== */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Today Action Items (오늘 할 일) */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" /> 오늘 할 일 (Action Items)
            </h4>

            <div className="flex flex-col gap-2.5">
              {/* Need RSVP */}
              <div className="p-3 bg-indigo-50/40 hover:bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-indigo-700">🚨 참석 응답 미완료</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">6/22 정기 합주에 참석 응답을 남기세요.</p>
                </div>
                <button 
                  onClick={() => onNavigate('일정')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-550 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  응답하기
                </button>
              </div>

              {/* Sheet music download */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-800">🎵 내 파트 악보 수급</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supernova - Vocal 파트 최신 악보 등록됨</p>
                </div>
                <button 
                  onClick={() => onNavigate('음악')}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-750 text-[10px] font-bold rounded-lg border border-slate-200 cursor-pointer shadow-sm"
                >
                  악보 받기
                </button>
              </div>

              {/* Practice Submission */}
              <div className="p-3 bg-rose-50/40 border border-rose-100/80 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-rose-700">⏰ 연습 과제 마감 직전</p>
                  <p className="text-[10px] text-slate-550 mt-0.5">Supernova 화음 가이드 제출 마감 (내일!!)</p>
                </div>
                <button 
                  onClick={() => onNavigate('음악')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-550 text-white text-[10px] font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  제출하기
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-full">새로운 피드백</span>
              <p className="text-base font-bold text-slate-900 mt-2">1 건 수신됨</p>
              <p className="text-[10px] text-slate-500 mt-1 font-sans line-clamp-1">“보컬 강약 조절이 아주 좋습니다...”</p>
              <button 
                onClick={() => onNavigate('음악')} 
                className="text-[10px] text-indigo-600 font-bold mt-2.5 flex items-center gap-1 cursor-pointer"
              >
                자세히 보기 <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">참여 가능한 곡</span>
              <p className="text-base font-bold text-slate-900 mt-2">2 곡 모집 중</p>
              <p className="text-[10px] text-slate-500 mt-1 font-sans line-clamp-1">Hype Boy, 나는 나비 외 1건</p>
              <button 
                onClick={() => onNavigate('대화')} 
                className="text-[10px] text-indigo-600 font-bold mt-2.5 flex items-center gap-1 cursor-pointer"
              >
                신청하러 가기 <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Notice Board */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-indigo-600" /> 최신 공지 및 납부 상태
            </h4>
            <div className="flex flex-col gap-2">
              <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-150 text-xs">
                <div className="flex justify-between text-slate-800 font-bold">
                  <span>대동제 축제 참가 상세 동선 공지</span>
                  <span className="text-[10px] text-slate-400 font-normal">6시간 전</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">리허설 장소 및 동선 체크가 완료되었습니다. 당일 대기 장소는 대강당 102호입니다.</p>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-indigo-50/30 rounded-xl border border-indigo-100/60">
                <span className="text-xs text-slate-750 font-medium">내 2분기 회비 납부 상태</span>
                <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">납부 완료 (30,000원)</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. External Live View Option (Digital Storytelling Showcase) */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-550" /> 외부 사용자용 관람 포인트
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          마지막 탭의 <strong className="text-indigo-600">“셋리스트 / 모바일 공연 초대장”</strong>을 누르면 당일 외부 관객에게 실시간 발송되는 초대장 링크 뷰(UI 7번)를 즉석 시뮬레이팅할 수 있습니다. 캡처 및 발표 활용에 매우 좋습니다!
        </p>
      </div>

    </div>
  );
}
