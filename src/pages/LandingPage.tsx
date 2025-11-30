import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'; // Button 컴포넌트의 스타일은 유지된다고 가정

const LandingPage: React.FC = () => {
  const nav = useNavigate();
  const [demoText, setDemoText] = useState('');
  const [result, setResult] = useState('');

  const handleDemo = () => {
    if (!demoText.trim()) return;
    setResult(`✨ AI Preview:\n"${demoText}" 문장은 더 이렇게 개선할 수 있어요... (데모 응답)`);
  };

  return (
    // 💡 배경 색상: Light/Dark 모드를 지원하는 회색 톤 유지
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4">

      {/* Hero Section */}
      <div className="text-center pt-20 pb-32 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
          AI Note: 생각을 기록하고 더 발전시키세요
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          AI가 당신의 메모를 분석하고 피드백하여 더 나은 아이디어로 확장합니다.
        </p>
        
        {/* 🎨 UX 개선: CTA 버튼 그룹 (Primary - Secondary - Secondary 순서) */}
        <div className="flex gap-4 justify-center"> 
          {/* Primary: 가장 강조되어야 하는 행동 (지금 써보기) */}
          <Button onClick={() => nav('/home')}>
            🚀 지금 AI 써보기
          </Button> 
          
          {/* Secondary Group: 보조적인 행동 (회원가입, 로그인) */}
          <Button variant="secondary" onClick={() => nav('/register')}>
            회원가입
          </Button>
        </div>
      </div>

      {/* --- */}

      {/* Feature Section */}
      {/* 💡 카드 그림자 및 Hover 효과 추가하여 인터랙션 UX 개선 */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
          <h2 className="font-semibold text-xl mb-2 text-indigo-600 dark:text-indigo-400">📝 AI 피드백</h2>
          <p className="text-gray-600 dark:text-gray-300 flex-1">메모를 입력하면 AI가 실시간으로 분석하고 피드백 제공</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
          <h2 className="font-semibold text-xl mb-2 text-indigo-600 dark:text-indigo-400">📚 메모 저장</h2>
          <p className="text-gray-600 dark:text-gray-300 flex-1">개인 계정에 메모 저장 및 이력 관리 가능</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full">
          <h2 className="font-semibold text-xl mb-2 text-indigo-600 dark:text-indigo-400">🔄 문장 개선</h2>
          <p className="text-gray-600 dark:text-gray-300 flex-1">AI가 문장을 부드럽게 다듬어줍니다</p>
        </div>
      </div>

      {/* --- */}

      {/* Demo Section */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl mb-24">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">✨ 10초 데모 체험</h3>
        <textarea
          value={demoText}
          onChange={(e) => setDemoText(e.target.value)}
          // 💡 포커스 시 테두리 색상 강조 (UX)
          className="w-full border-2 border-gray-200 focus:border-indigo-500 rounded-lg p-4 mb-4 min-h-[150px] bg-gray-100 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-500 transition duration-150"
          placeholder="여기에 간단한 문장을 적어보세요..."
        />
        <Button onClick={handleDemo}>AI 미리보기</Button>

        {result && (
          <div className="mt-6">
            <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">AI 피드백 결과:</h4>
            <pre 
              // 💡 데모 결과 영역 시각적 구분
              className="mt-2 whitespace-pre-wrap text-gray-800 dark:text-gray-100 bg-indigo-50/50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-indigo-500 shadow-inner"
            >
              {result}
            </pre>
          </div>
        )}
      </div>

      {/* --- */}
      
      <footer className="text-center pb-8 text-gray-500 dark:text-gray-400">
        © 2025 AI Note. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;