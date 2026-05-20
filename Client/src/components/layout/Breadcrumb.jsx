import { Link } from 'react-router-dom';

export const Breadcrumb = ({ items }) => {
    if (!items || items.length === 0) return null;

    return (
        <nav className="ocw-breadcrumb" aria-label="Breadcrumb">
            <div className="ocw-breadcrumb-inner">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <span key={`${item.label}-${index}`}>
                            {index > 0 && <span className="sep"> &gt; </span>}
                            {isLast || !item.to ? (
                                <span className={isLast ? 'current' : ''}>{item.label}</span>
                            ) : (
                                <Link to={item.to}>{item.label}</Link>
                            )}
                        </span>
                    );
                })}
            </div>
        </nav>
    );
};
