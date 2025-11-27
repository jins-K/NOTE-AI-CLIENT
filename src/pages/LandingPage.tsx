import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
  const nav = useNavigate();
  const [demoText, setDemoText] = useState('');
  const [result, setResult] = useState('');

  const handleDemo = () => {
    if (!demoText.trim()) return;
    setResult(`✨ AI Preview:\n"${demoText}" 문장은 더 이렇게 개선할 수 있어요... (데모 응답)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4">

      {/* Hero Section */}
      <div className="text-center pt-20 pb-32 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          AI Note: 생각을 기록하고 더 발전시키세요
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          AI가 당신의 메모를 분석하고 피드백하여 더 나은 아이디어로 확장합니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => nav('/home')}>지금 써보기</Button>
          <Button variant="secondary" onClick={() => nav('/login')}>로그인</Button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col h-full">
          <h2 className="font-semibold text-xl mb-2">📝 AI 피드백</h2>
          <p className="text-gray-600 dark:text-gray-300 flex-1">메모를 입력하면 AI가 실시간으로 분석하고 피드백 제공</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col h-full">
          <h2 className="font-semibold text-xl mb-2">📚 메모 저장</h2>
          <p className="text-gray-600 dark:text-gray-300 flex-1">개인 계정에 메모 저장 및 이력 관리 가능</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col h-full">
          <h2 className="font-semibold text-xl mb-2">🔄 문장 개선</h2>
          <p className="text-gray-600 dark:text-gray-300 flex-1">AI가 문장을 부드럽게 다듬어줍니다</p>
        </div>
      </div>

      {/* Demo Section */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-24">
        <h3 className="text-xl font-semibold mb-3">✨ 10초 데모 체험</h3>
        <textarea
          value={demoText}
          onChange={(e) => setDemoText(e.target.value)}
          className="w-full border rounded-md p-3 mb-3 min-h-[150px] bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
          placeholder="여기에 간단한 문장을 적어보세요..."
        />
        <Button onClick={handleDemo}>AI 미리보기</Button>

        {result && (
          <pre className="mt-4 whitespace-pre-wrap text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-3 rounded-md border">
            {result}
          </pre>
        )}
      </div>

      <footer className="text-center pb-8 text-gray-500 dark:text-gray-400">
        © 2025 AI Note. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
