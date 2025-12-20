import type { MemberRegisterResponse, MemberRegisterRequest } from '../types/member';
import { api } from './api';

export const memberService = {
    // 회원가입은 토큰 반환 방식에 따라 로직이 달라지지 않으므로 유지합니다.
    // (서버에서 회원가입 후 자동 로그인을 HttpOnly 쿠키로 처리한다고 가정)
    register: async (request: MemberRegisterRequest): Promise<MemberRegisterResponse> => {
        // 서버가 응답 시 Set-Cookie 헤더를 함께 보낸다고 가정
        const { email, password } = request;
        const res = await api.post<MemberRegisterResponse>('/auth/members', { email, password });
        return res.data;
    } ,
}