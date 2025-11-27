import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    className,
    ...props
}) => {
    const variantClass = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
    }[variant];
    return (
        <button className={clsx("btn-base", variantClass, className)} {...props} />
    );
}

export default Button;
// named export, default export
// HTML button 속성 자동완성 지원
// label props로 텍스트 지정
// 클릭 이벤트 등 기존 button 속성 그대로 사용 가능
