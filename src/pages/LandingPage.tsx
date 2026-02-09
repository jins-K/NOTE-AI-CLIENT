import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
  const nav = useNavigate();
  const [demoText, setDemoText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 특정 영역으로 스크롤하기 위한 Ref
  const demoSectionRef = useRef<HTMLDivElement>(null);

  const scrollToDemo = () => {
    demoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    // 2. 섹션 내부의 textarea를 찾아 포커스 주기
    // setTimeout을 아주 짧게(0ms) 주는 이유는 스크롤 애니메이션과 
    // 브라우저의 포커스 동작이 충돌하지 않게 하기 위함입니다.
    setTimeout(() => {
      const textarea = demoSectionRef.current?.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        
        // 커서를 텍스트 맨 끝으로 보내고 싶다면 아래 한 줄 추가
        // textarea.selectionStart = textarea.value.length;
      }
    }, 350); // 스크롤이 어느 정도 진행된 후 포커스
  };

  /**
   * 데모 분석 핸들러
   * 1. 데모 전용 API(/api/demo/analyze) 호출
   * 2. 결과를 받아 NoteDetail 페이지로 state와 함께 이동
   */
  const handleDemo = async () => {
    if (!demoText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      // 서버의 데모 전용 엔드포인트 호출 (Rate Limit 1분 2회 적용된 곳)
      const response = await api.post('/demo', { content: demoText.trim() });

      if (!response.status) {
        if (response.status === 429) {
          alert("너무 많은 요청이 발생했습니다. 1분 후에 다시 시도해주세요.");
          return;
        }
        throw new Error("분석 중 오류가 발생했습니다.");
      }

      const aiResult = await response.data;

      // 💡 핵심: DB 저장 없이 결과 객체를 들고 상세 페이지로 점프!
      nav(`/note/demo`, { 
        state: { 
          initialData: {
            ...aiResult, // 서버에서 온 title, summary, tags, suggestion 등
            content: demoText, // 사용자가 입력한 원문
            updatedAt: new Date().toISOString()
          }, 
          isDemo: true 
        } 
      });

    } catch (error) {
      console.error("데모 분석 실패:", error);
      alert("AI 서비스와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300 font-sans">

      {/* Hero Section */}
      <div className="text-center pt-24 pb-32 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">
          AI Note: 생각을 기록하고 <br/>
          <span className="text-indigo-600 dark:text-indigo-400">더 나은 아이디어로</span> 확장하세요
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          복잡한 가입 없이 AI의 통찰력을 지금 바로 확인해보세요.
        </p>
        
        <div className="flex gap-4 justify-center"> 
          <Button onClick={scrollToDemo} className="px-8 py-4 text-lg shadow-lg shadow-indigo-500/20">
            ⚡ 지금 바로 체험하기
          </Button> 
          <Button variant="secondary" onClick={() => nav('/login')} className="px-8 py-4 text-lg">
            로그인
          </Button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">📝</div>
          <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">AI 실시간 분석</h2>
          <p className="text-gray-600 dark:text-gray-400">메모의 핵심을 파악하여 놓치기 쉬운 인사이트를 발견해줍니다.</p>
        </div>
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🔄</div>
          <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">문장 다듬기</h2>
          <p className="text-gray-600 dark:text-gray-400">어색한 표현을 비즈니스나 학술적 용어로 깔끔하게 교정합니다.</p>
        </div>
        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-4">🚀</div>
          <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">아이디어 확장</h2>
          <p className="text-gray-600 dark:text-gray-400">작은 메모 하나를 거대한 프로젝트 기획으로 발전시켜보세요.</p>
        </div>
      </div>

      {/* Demo Section */}
      <div 
        ref={demoSectionRef}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl mb-32 border border-indigo-100 dark:border-indigo-900/30"
      >
        <div className="text-center mb-8">
          <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">Demo</span>
          <h3 className="text-3xl font-bold mt-4 text-gray-900 dark:text-gray-100">AI 피드백 미리보기</h3>
          <p className="text-gray-500 mt-2">입력하신 내용은 저장되지 않으며, 즉시 AI 분석 결과로 이어집니다.</p>
        </div>

        <div className="relative">
          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            disabled={isAnalyzing}
            className="w-full border-2 border-gray-100 focus:border-indigo-500 rounded-2xl p-6 mb-6 min-h-[200px] bg-gray-50 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400 transition-all outline-none text-lg resize-none shadow-inner"
            placeholder="예: 오늘 점심에 생각한 카페 창업 아이디어를 구체화하고 싶어..."
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold">AI가 아이디어를 분석 중입니다...</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleDemo} 
            disabled={isAnalyzing || !demoText.trim()}
            className="w-full md:w-auto px-16 py-5 text-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            {isAnalyzing ? '분석 중...' : 'AI 결과 확인하기 ✨'}
          </Button>
        </div>
      </div>

      <footer className="text-center pb-12 text-gray-400 dark:text-gray-500 text-sm border-t border-gray-100 dark:border-gray-800 pt-12">
        © 2026 AI Note. 생각을 현실로 만드는 가장 빠른 방법.
      </footer>
    </div>
  );
};

export default LandingPage;
// UX 설계에서 중요한 마찰을 고려하여 AHA moment를 주기위해 현재 페이지에서 즉시 체험가능하도록 한다