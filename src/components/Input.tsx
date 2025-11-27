import clsx from 'clsx';
import "../styles/component.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input: React.FC<InputProps> = ({error,className,...props}) => {
    return (
        <input
            className={clsx(
                "input-base",
                error && "border-red-500 dark:border-red-400",
                className
            )}
            {...props}
        />
    )
}

export default Input;