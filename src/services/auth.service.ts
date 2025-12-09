import type { RegisterResponse, LoginResponse } from '../types/auth'; // LoginResponse 타입은 실제 사용 안 함
import { api } from './api';

export const authService = {
    // 회원가입은 토큰 반환 방식에 따라 로직이 달라지지 않으므로 유지합니다.
    // (서버에서 회원가입 후 자동 로그인을 HttpOnly 쿠키로 처리한다고 가정)
    register: async (email: string, password: string): Promise<RegisterResponse> => {
        // 서버가 응답 시 Set-Cookie 헤더를 함께 보낸다고 가정
        const res = await api.post<RegisterResponse>('/auth/register', { email, password });
        return res.data;
    } ,
    
    // 💡 [수정] HttpOnly 방식 적용: 클라이언트에서 토큰 처리 로직 모두 제거
    login: async (email: string, password: string): Promise<void> => {
        // 1. 서버에 로그인 요청을 보냅니다.
        //   - 서버는 인증 성공 후 응답 헤더에 Set-Cookie를 담아 토큰을 설정합니다.
        //   - LoginResponse 타입은 JSON 본문이 비어있거나 메시지만 포함할 것이므로 실제 사용하지 않습니다.
        await api.post('/auth/login', { email, password });
        
        // 2. [제거됨] const { token } = res.data; (토큰은 쿠키로 오므로 접근 불가)
        // 3. [제거됨] localStorage.setItem('authToken', token); (localStorage 사용 금지)
        // 4. [제거됨] api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        //    (토큰을 읽을 수 없으며, 브라우저가 쿠키를 자동으로 첨부합니다.)
        
        // 5. 작업 완료 (void 반환)
    } ,
    
    // 💡 [수정] HttpOnly 방식 적용: 서버에 쿠키 제거 요청을 보냅니다.
    logout: async (): Promise<void> => {
        // 1. 서버의 로그아웃 엔드포인트에 요청을 보냅니다.
        //   - 서버는 이 요청을 받으면 응답 헤더를 통해 쿠키를 만료(제거)시킵니다.
        await api.post('/auth/logout', {}); 
        
        // 2. [제거됨] localStorage.removeItem('authToken');
        // 3. [제거됨] delete api.defaults.headers.common['Authorization'];
    } ,

    checkAuthStatus: async (): Promise<void> => {
        // 서버의 사용자 정보 엔드포인트 호출을 통해 인증 유효성 확인
        await api.get('/auth/me'); // 200 OK -> 인증 성공, 401 Unauthorized -> 인증 실패
    }
}
