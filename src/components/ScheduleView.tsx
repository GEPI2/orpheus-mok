import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, HelpCircle, Check, X, 
  ArrowRight, FileText, Send, CheckCircle, Clock 
} from 'lucide-react';
import { Schedule, UserRole, AttendanceStatus } from '../types';

interface ScheduleViewProps {
  currentRole: UserRole;
  schedules: Schedule[];
  onChangeAttendance: (scheduleId: string, memberName: string, status: AttendanceStatus) => void;
  onSendAlert: (message: string) => void;
  onNavigate: (tab: string) => void;
}

export default function ScheduleView({
  currentRole,
  schedules,
  onChangeAttendance,
  onSendAlert,
  onNavigate,
}: ScheduleViewProps) {
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(schedules[0]?.id || '');
  const activeSched = schedules.find(s => s.id === selectedScheduleId) || schedules[0];
  
  if (!activeSched) {
    return <div className="p-4 text-slate-400">등록된 일정이 없습니다.</div>;
  }

  // Active user's mocked name: "이서연" (Vocal) for '부원', "김민준" (Guitar 1) for '운영진'
  const currentUserName = currentRole === '운영진' ? '김민준' : '이서연';
  const currentUserAttendance = activeSched.attendances.find(a => a.memberName === currentUserName);
  const currentStatus = currentUserAttendance ? currentUserAttendance.status : '미정';

  // Stats calculation
  const totalCount = activeSched.attendances.length;
  const attendingList = activeSched.attendances.filter(a => a.status === '참석').map(a => a.memberName);
  const absentList = activeSched.attendances.filter(a => a.status === '불참').map(a => a.memberName);
  const undecidedList = activeSched.attendances.filter(a => a.status === '미정' || a.status === '미응답').map(a => a.memberName);

  const handleStatusChange = (status: AttendanceStatus) => {
    onChangeAttendance(activeSched.id, currentUserName, status);
    onSendAlert(`[참석 응답 완료] ${currentUserName}님의 응답이 '${status}'(으)로 변경 및 동기화되었습니다.`);
  };

  const handleRemindUndecided = () => {
    if (undecidedList.length > 0) {
      onSendAlert(`[운영진 알림 전송] 아직 미응답 상태인 (${undecidedList.join(', ')}) 단원들에게 모바일 알림톡을 재발송했습니다.`);
    } else {
      onSendAlert('[알림] 모든 단원이 응답 완료하여 추가 리마인더 발송이 불필요합니다.');
    }
  };

  const handleRecordAttendance = () => {
    onSendAlert('[운영 점검] 금일 합주 현장에서 실시간 출석 확인이 완료되었습니다.');
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-20 overflow-y-auto max-h-[100%] text-slate-700 bg-slate-50">
      
      {/* Schedule Picker Tag Row */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {schedules.map((s, idx) => {
          const dateStr = s.dateTime.substring(5, 10).replace('-', '/');
          const isActive = s.id === selectedScheduleId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedScheduleId(s.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border shrink-0 transition-all cursor-pointer shadow-sm ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-600 text-white font-bold' 
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="font-mono text-[9px] uppercase opacity-75">{idx === 0 ? 'NEXT UP' : `DUE ${dateStr}`}</div>
              <div className="mt-0.5">{s.title.substring(0, 10)}...</div>
            </button>
          );
        })}
      </div>

      {/* Main Schedule Detail Card */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col gap-3.5">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100/80">
            {activeSched.id === 'sched-1' ? '중요 정기합주' : '리허설 & 최종점검'}
          </span>
          <h3 className="text-lg font-display font-bold text-slate-900 mt-2.5">{activeSched.title}</h3>
        </div>

        {/* Info Rows */}
        <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <Clock className="w-4 h-4 text-indigo-550" />
            <span className="font-semibold text-slate-850">
              {new Date(activeSched.dateTime).toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
              })} 오후 6시 정각
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span className="text-slate-800">{activeSched.location}</span>
          </div>
        </div>

        {/* ----------------- SELECTION BUTTONS (참석 / 불참 / 미정) ----------------- */}
        <div className="border-t border-b border-slate-100 py-3.5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-650">내 응답 상태: <strong>{currentUserName} ({currentRole})</strong></span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              currentStatus === '참석' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              currentStatus === '불참' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-650'
            }`}>
              {currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { status: '참석', icon: Check, activeClass: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm', inactiveClass: 'bg-white text-emerald-750 border-slate-200 hover:bg-emerald-50/50' },
              { status: '불참', icon: X, activeClass: 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm', inactiveClass: 'bg-white text-rose-750 border-slate-200 hover:bg-rose-50/50' },
              { status: '미정', icon: HelpCircle, activeClass: 'bg-slate-600 text-white border-slate-600 font-bold shadow-sm', inactiveClass: 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50/50' }
            ].map(btn => {
              const IconComp = btn.icon;
              const isSelected = currentStatus === btn.status;
              return (
                <button
                  key={btn.status}
                  onClick={() => handleStatusChange(btn.status as AttendanceStatus)}
                  className={`py-2 px-3 rounded-xl text-xs border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected ? btn.activeClass : btn.inactiveClass
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  {btn.status}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => onSendAlert('[저장 완료] 참석 정보 및 부원 출석 현황이 안전하게 클라우드 저장소에 보관되었습니다.')}
            className="w-full mt-3 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            저장하기
          </button>
        </div>

        {/* Attendance Breakdown Header */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">파트별 실시간 인원 현황</h4>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
            {[
              { name: 'VOCAL', stat: activeSched.partStatus.vocal, color: 'bg-rose-550' },
              { name: 'GUITAR', stat: activeSched.partStatus.guitar, color: 'bg-indigo-600' },
              { name: 'BASS', stat: activeSched.partStatus.bass, color: 'bg-indigo-600' },
              { name: 'DRUM', stat: activeSched.partStatus.drum, color: 'bg-indigo-600' },
              { name: 'KEYS', stat: activeSched.partStatus.keyboard, color: 'bg-indigo-600' },
            ].map(part => {
              const isShort = part.stat.current < part.stat.required;
              return (
                <div key={part.name} className={`p-1.5 rounded-xl border shadow-sm ${isShort ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-150'}`}>
                  <p className="text-slate-500 font-bold mb-0.5">{part.name}</p>
                  <p className={`text-xs font-extrabold ${isShort ? 'text-rose-600' : 'text-slate-800'}`}>
                    {part.stat.current}/{part.stat.required}
                  </p>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1 max-w-[28px] mx-auto">
                    <div 
                      className={`h-full ${isShort ? 'bg-rose-550' : 'bg-indigo-600'}`}
                      style={{ width: `${Math.min(100, (part.stat.current / part.stat.required) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member names breakdown sorted */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs flex flex-col gap-2">
          <div className="flex items-start gap-1">
            <span className="text-emerald-700 font-bold w-12 shrink-0">참석 ({attendingList.length}):</span>
            <span className="text-slate-700 font-medium">{attendingList.join(', ') || '없음'}</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-rose-700 font-bold w-12 shrink-0">불참 ({absentList.length}):</span>
            <span className="text-slate-700 font-medium">{absentList.join(', ') || '없음'}</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-slate-400 font-bold w-12 shrink-0">미정 ({undecidedList.length}):</span>
            <span className="text-slate-700 font-medium">{undecidedList.join(', ') || '정답 완료'}</span>
          </div>
        </div>

        {/* Connected sheets & Practice assignments */}
        <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">연결된 파트 연습 과제</p>
              <p className="text-[10px] text-slate-500 font-medium">Supernova (개인 연습 & 피드백 수렴)</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('음악')}
            className="p-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] text-slate-650 font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-sm"
          >
            보기 <ArrowRight className="w-3 h-3 text-indigo-600" />
          </button>
        </div>

        {/* Connected Rehearsals / Admin section */}
        {currentRole === '운영진' && (
          <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">운영진 관리자 전용 조작선</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRemindUndecided}
                className="py-2.5 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-650 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> 미응답 긴급 알림
              </button>
              <button
                onClick={handleRecordAttendance}
                className="py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" /> 현장 출석 체크
              </button>
            </div>
            <button
               onClick={() => onNavigate('음악')}
               className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 text-xs rounded-lg text-center cursor-pointer shadow-sm"
            >
               새로운 연습 과제/합주 기록 발행하기
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
