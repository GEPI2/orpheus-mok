import { Member, Schedule, SheetAndPractice, SongRecruit, RehearsalLog, SetlistItem, ConcertInfo } from './types';

export const SAMPLE_MEMBERS: Member[] = [
  { name: '김민준', role: '운영진', part: 'Guitar', level: 'L3', avatarColor: 'bg-emerald-500' },
  { name: '배진혁', role: '운영진', part: 'Guitar', level: 'L3', avatarColor: 'bg-teal-500' },
  { name: '이서연', role: '부원', part: 'Vocal', level: 'L2', avatarColor: 'bg-rose-500' },
  { name: '박지훈', role: '부원', part: 'Bass', level: 'L2', avatarColor: 'bg-blue-500' },
  { name: '최유나', role: '부원', part: 'Drum', level: 'L3', avatarColor: 'bg-amber-500' },
  { name: '정하늘', role: '부원', part: 'Keyboard', level: 'L1', avatarColor: 'bg-indigo-500' },
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 'sched-1',
    title: '정기 합주 및 공연 기획 회의',
    dateTime: '2026-06-22T18:00:00',
    location: 'B101 합주실 (지하 1층)',
    attendances: [
      { memberName: '김민준', status: '참석' },
      { memberName: '배진혁', status: '참석' },
      { memberName: '이서연', status: '미정' }, // 아직 미응답 데이터 지원 (원래 '미정' 혹은 '미응답' 상태로 유인)
      { memberName: '박지훈', status: '참석' },
      { memberName: '최유나', status: '참석' },
      { memberName: '정하늘', status: '미정' },
    ],
    partStatus: {
      vocal: { required: 1, current: 0 }, // 이서연 미응답으로 인해 부족 파트 보컬 상태 구현
      guitar: { required: 2, current: 2 },
      bass: { required: 1, current: 1 },
      drum: { required: 1, current: 1 },
      keyboard: { required: 1, current: 0 }, // 정하늘 미정으로 인해 부족 파트 키보드 상태 구현
    },
    connectedSheetId: 'sheet-1', // Supernova
    hasRehearsalLog: false,
  },
  {
    id: 'sched-2',
    title: '중간 점검 및 리허설',
    dateTime: '2026-06-29T17:00:00',
    location: '학생회관 소공연장 (3층)',
    attendances: [
      { memberName: '김민준', status: '참석' },
      { memberName: '배진혁', status: '참석' },
      { memberName: '이서연', status: '참석' },
      { memberName: '박지훈', status: '참석' },
      { memberName: '최유나', status: '불참' }, // 최유나 불참 상태 예시
      { memberName: '정하늘', status: '참석' },
    ],
    partStatus: {
      vocal: { required: 1, current: 1 },
      guitar: { required: 2, current: 2 },
      bass: { required: 1, current: 1 },
      drum: { required: 1, current: 0 }, // 드럼 부족
      keyboard: { required: 1, current: 1 },
    },
    connectedSheetId: 'sheet-2', // 사건의 지평선
    hasRehearsalLog: false,
  }
];

export const INITIAL_SHEETS: SheetAndPractice[] = [
  {
    id: 'sheet-1',
    songTitle: 'Supernova',
    artist: 'aespa',
    part: 'Guitar',
    version: 'v3',
    updatedAt: '2026-06-18',
    sheetFileUrl: '#',
    assignmentTitle: '아웃트로 솔로 32마디 풀 업 벤딩 녹음 제출하기',
    dueDate: '2026-06-21',
    submissionStatus: '미제출',
  },
  {
    id: 'sheet-1-vocal',
    songTitle: 'Supernova',
    artist: 'aespa',
    part: 'Vocal',
    version: 'v2',
    updatedAt: '2026-06-12',
    sheetFileUrl: '#',
    assignmentTitle: '인쇄된 코러스 전 파트 2단 화음 가이드 오디오',
    dueDate: '2026-06-21',
    submissionStatus: '제출 완료',
    feedback: '강약 조절이 아주 좋습니다. 하이라이트 진입 시 호흡 유지를 조금만 더 탄탄하게 해주세요.',
    feedbackAuthor: '김민준 (운영진)'
  },
  {
    id: 'sheet-2',
    songTitle: '사건의 지평선',
    artist: '윤하',
    part: 'Bass',
    version: 'v1',
    updatedAt: '2026-06-10',
    sheetFileUrl: '#',
    assignmentTitle: '후렴 슬랩 파트 BPM 140 메트로놈 박자 맞추기',
    dueDate: '2026-06-25',
    submissionStatus: '제출 완료',
    feedback: 'Fret 노이즈가 살짝 있으나 박자감이 칼같습니다! 자신 있게 리드하셔도 돼요.',
    feedbackAuthor: '배진혁 (운영진)'
  },
  {
    id: 'sheet-3',
    songTitle: 'Square',
    artist: '백예린',
    part: 'Keyboard',
    version: 'v2',
    updatedAt: '2026-06-15',
    sheetFileUrl: '#',
    assignmentTitle: '피아노 인트로 감성 충만한 보이싱 다듬기',
    dueDate: '2026-06-24',
    submissionStatus: '미제출',
  }
];

export const INITIAL_RECRUITS: SongRecruit[] = [
  {
    id: 'rec-1',
    songTitle: '나는 나비',
    artist: 'YB',
    creator: '박지훈',
    status: '파트 부족',
    requiredParts: ['Vocal', 'Guitar 1', 'Guitar 2', 'Bass', 'Drum'],
    currentParticipants: {
      'Bass': '박지훈',
      'Guitar 1': '김민준',
      'Drum': '최유나',
    },
    chatCount: 4,
    referenceUrl: 'https://www.youtube.com/...',
    createdAt: '2026-06-15',
    description: '대학 축제 단골 앵콜 곡! 코드도 크게 복잡하지 않고 다같이 떼창 유도하기에 최고라 이번 공연 맨 마지막 순서나 앵콜용으로 추천하고 싶습니다. 보컬 한 분과 세컨드 기타 모집 중입니다!',
    applications: [
      { memberName: '이서연', part: 'Vocal', comment: '목 터져라 불러보겠습니다! 저 보컬 시켜주세요!! 🎙️', approved: false },
      { memberName: '배진혁', part: 'Guitar 2', comment: '기타 솔로 배킹 탄탄하게 받쳐 드리겠습니다.', approved: true }
    ]
  },
  {
    id: 'rec-2',
    songTitle: 'Square',
    artist: '백예린',
    creator: '정하늘',
    status: '준비 완료',
    requiredParts: ['Vocal', 'Keyboard', 'Bass', 'Drum', 'Guitar'],
    currentParticipants: {
      'Keyboard': '정하늘',
      'Vocal': '이서연',
      'Bass': '박지훈',
      'Drum': '최유나',
      'Guitar': '배진혁',
    },
    chatCount: 8,
    referenceUrl: 'https://www.youtube.com/...',
    createdAt: '2026-06-10',
    description: '봄 옥상 페스티벌 감성을 자극하는 곡입니다. 키보드가 중심이 되는 전개가 매력적입니다. 팀원 모두 매칭 완료되어 다음 주부터 합주 들어갑시다!',
    applications: []
  },
  {
    id: 'rec-3',
    songTitle: 'Hype Boy',
    artist: 'NewJeans',
    creator: '이서연',
    status: '모집 중',
    requiredParts: ['Vocal', 'Keyboard', 'Guitar', 'Bass', 'Drum'],
    currentParticipants: {
      'Vocal': '이서연',
    },
    chatCount: 1,
    referenceUrl: 'https://www.youtube.com/...',
    createdAt: '2026-06-19',
    description: '아이돌 디스코 펑키 넘버를 록 버전으로 편곡해서 해보면 관객 반응 대박일 것 같습니다. 베이시스트, 드럼, 기타, 키보드 다 환영합니다!',
    applications: []
  }
];

export const INITIAL_REHEARSAL_LOGS: RehearsalLog[] = [
  {
    id: 'log-1',
    rehearsalDate: '2026-06-15',
    attendees: ['김민준', '배진혁', '이서연', '박지훈', '최유나'],
    songs: [
      { songTitle: 'Supernova', status: '추가 연습 필요' },
      { songTitle: '사건의 지평선', status: '연습 중' },
    ],
    memo: '전체적으로 음량 밸런스는 맞춰지고 있으나, Supernova 인트로에 신스 이펙터를 기타 톤으로 재현하는 구간 싱크가 안 맞았습니다. 사건의 지평선은 후렴 고음역 템포가 조급해질 때가 있네요.',
    issues: '드러머 최유나 6월 22일 개인 사정으로 합주 30분 지각 예정. 메트로놈 인이어 송신기 2번 채널 수신 감도 문제 발생.',
    nextAssignment: '각자 약속한 파트 과제 리모트 녹음 제출 데드라인 엄수하기.',
    assignee: '전원',
    recordingFileUrl: '#',
    recordingFileName: 'orpheus_20260615_jam.mp3',
    isXPApplied: true
  }
];

export const INITIAL_SETLIST: SetlistItem[] = [
  { order: 1, songTitle: 'Square', artist: '백예린', key: 'C Major', bpm: 110, partMemos: { 'Keyboard': '도입부 스트링 아르페지오 볼륨 페이드', 'Vocal': '도입부 잔잔하게' } },
  { order: 2, songTitle: '사건의 지평선', artist: '윤하', key: 'C# Major', bpm: 124, partMemos: { 'Guitar': '솔로 벤딩 피치 정확도 유지', 'Drum': '후반부 업템포 킥 엇박자 주의' } },
  { order: 3, songTitle: 'Supernova', artist: 'aespa', key: 'D Minor', bpm: 120, partMemos: { 'Bass': '슬랩 라인 압축감 있게 연주', 'Vocal': '코러스 더블링 볼륨감 확인' } },
];

export const INITIAL_CONCERT: ConcertInfo = {
  id: 'concert-1',
  title: '제18회 숭실대학교 대동제 오르페우스 정기 공연',
  date: '2026-06-29',
  time: '18:30',
  location: '숭실대학교 한경직기념관 야외무대',
  mapLink: 'https://map.kakao.com/?urlX=496515&urlY=1114510&urlLevel=3&map_type=TYPE_MAP&map_hybrid=false',
  lineup: ['Vocal 이서연', 'Guitar 김민준 배진혁', 'Bass 박지훈', 'Drum 최유나', 'Keyboard 정하늘'],
  setlistPreview: ['Square (백예린)', '사건의 지평선 (윤하)', 'Supernova (aespa)', '그리고 미공개 앵콜곡 수록!'],
  isPublished: true,
  posterBg: 'bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900'
};
