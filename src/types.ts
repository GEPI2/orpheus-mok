export type UserRole = '운영진' | '부원';

export interface Member {
  name: string;
  role: UserRole;
  part: string;
  level: string; // L1, L2, L3
  avatarColor: string; // tailwind bg color class
}

export type AttendanceStatus = '참석' | '불참' | '미정' | '미응답';

export interface Attendance {
  memberName: string;
  status: AttendanceStatus;
}

export interface Schedule {
  id: string;
  title: string;
  dateTime: string;
  location: string;
  attendances: Attendance[];
  partStatus: {
    vocal: { required: number; current: number };
    guitar: { required: number; current: number };
    bass: { required: number; current: number };
    drum: { required: number; current: number };
    keyboard: { required: number; current: number };
  };
  connectedSheetId: string; // Supernova 등 악보 ID 매핑
  hasRehearsalLog: boolean;
  rehearsalLogId?: string;
}

export interface SheetAndPractice {
  id: string;
  songTitle: string;
  artist: string;
  part: string; // Guitar, Vocal, Bass, Drum, Keyboard
  version: string; // v1, v2, v3
  updatedAt: string;
  sheetFileUrl: string;
  assignmentTitle: string;
  dueDate: string;
  submissionStatus: '제출 완료' | '미제출';
  feedback?: string;
  feedbackAuthor?: string;
}

export type RecruitStatus = '모집 중' | '파트 부족' | '준비 완료' | '진행 중' | '완료' | '보류';

export interface SongApplication {
  memberName: string;
  part: string;
  comment: string;
  approved: boolean;
}

export interface SongRecruit {
  id: string;
  songTitle: string;
  artist: string;
  creator: string;
  status: RecruitStatus;
  requiredParts: string[]; // ['Vocal', 'Guitar 1', 'Guitar 2', 'Bass', 'Drum', 'Keyboard']
  currentParticipants: { [part: string]: string }; // { 'Vocal': '이서연', 'Guitar 1': '김민준' }
  chatCount: number;
  referenceUrl: string;
  createdAt: string;
  description: string;
  applications: SongApplication[];
}

export type RehearsalSongStatus = '시작 전' | '연습 중' | '추가 연습 필요' | '공연 가능' | '완료';

export interface RehearsalSong {
  songTitle: string;
  status: RehearsalSongStatus;
}

export interface RehearsalLog {
  id: string;
  rehearsalDate: string;
  attendees: string[];
  songs: RehearsalSong[];
  memo: string;
  issues: string;
  nextAssignment: string;
  assignee: string; // 담당자
  recordingFileUrl?: string; // 파일이 있는지 여부
  recordingFileName?: string;
  isXPApplied: boolean; // 활동 점수 반영 상태
}

export interface SetlistItem {
  order: number;
  songTitle: string;
  artist: string;
  key: string;
  bpm: number;
  partMemos: { [part: string]: string };
}

export interface ConcertInfo {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  mapLink: string;
  lineup: string[];
  setlistPreview: string[];
  isPublished: boolean;
  posterBg: string; // 그라데이션 일러스트를 위한 css 클래스들
}
