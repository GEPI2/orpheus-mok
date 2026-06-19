import React from 'react';
import { motion } from 'motion/react';
import { Music, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onStart: () => void;
}

export default function Onboarding({ onStart }: OnboardingProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-[100%] bg-white text-slate-800 p-6 relative overflow-hidden">
      {/* Decorative ambient blurred lights */}
      <div className="absolute top-[-100px] left-[-100px] w-72 h-72 bg-indigo-50 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-72 h-72 bg-[#F1F5F9] rounded-full blur-[80px]" />

      {/* Top Logo Region */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 mt-8 z-10"
      >
        <span className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100/80 shadow-sm">
          <Music className="w-8 h-8 text-indigo-600" />
        </span>
        <span className="text-3xl font-display font-extrabold tracking-tight text-indigo-600">
          Orpheus
        </span>
      </motion.div>

      {/* Center Slogan Banner */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm px-4 my-8 z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-xs font-semibold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          디지털스토리텔링 MVP 발표 목업
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-display font-bold leading-tight tracking-tight mb-4 text-slate-900"
        >
          합주 준비,<br />
          <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">단톡방에 흩어지지 않게.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-slate-500 text-sm leading-relaxed mb-8"
        >
          일정, 참석 응답, 악보, 연습 과제, 곡 모집, 공연 준비를 하나의 흐름으로 긴밀하게 연동하고 완벽한 오프 무대를 준비하세요.
        </motion.p>

        {/* Dynamic mockup tags in grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-2 text-left w-full mt-2"
        >
          {[
            '번거로운 일정 및 파트 파악',
            '최신 악보 아카이빙',
            '미루는 연습과제 트래킹',
            '민주적이고 신속한 곡 모집',
          ].map((text, idx) => (
            <div key={idx} className="flex items-start gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <span className="text-xs text-slate-600 font-sans leading-tight">{text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Start Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-sm mb-6 z-10"
      >
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg transition duration-300 active:scale-95 group font-sans text-base cursor-pointer"
        >
          목업 시작하기
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-3">
          숭실대학교 밴드 동아리 오르페우스 빌드 v1.2
        </p>
      </motion.div>
    </div>
  );
}
