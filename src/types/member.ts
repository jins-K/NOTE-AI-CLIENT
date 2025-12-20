export interface MemberRegisterRequest {
    email: string;
    password: string;
}

// 회원가입 응답 타입: 토큰이 있거나 (즉시 로그인), 메시지만 있거나 (인증 필요)
export interface MemberRegisterResponse {
    message: string;
    id: string;
    email: string;
}
