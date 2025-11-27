import clsx from 'clsx';
import "../styles/component.css"

interface CardProps {
    title: string;
    className?: string;
}

const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
    title,
    children,
    className,
}) => {
    return (
        <div className={clsx("card", className)}>
            <h2 className="card-title">{title}</h2>
            {children}
        </div>
    )
}

export default Card;