import React from 'react'

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> =({message}) => {
    if (!message) return null;

    return (
        <div className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 mb-4 rounded-lg border border-red-300 flex items-center shadow-md" role="alert">
            <span className="mr-3 text-xl">⚠️</span> 
            <p className="text-sm font-medium">{message}</p>
        </div>
    )
}

export default ErrorMessage;