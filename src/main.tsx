import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { AuthProvider } from './hooks/useAuth'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // Strict Mode 가 오류 조기검사를 위해 api를 한번 더 호출
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
// BrowserRouter는 History API를 사용하여 URL을 관리한다 (pushState, replaceState, popState)
// 페이지 새로고침을 방지 , URL만 변경처리
// 뒤로가기, 앞으로가기를 컴포넌트만 변경처리
// 라우팅 컨텍스트 제공  (useNavigate, useLocation, useParams)
// 앱의 Root Component를 감싸는 곳에 위치함 , 하위의 모든 컴포넌트들은 라우팅을 이용