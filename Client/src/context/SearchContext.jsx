import { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const submitSearch = useCallback((query) => {
        const term = (query ?? searchQuery).trim();
        setSearchQuery(term);
        const params = term ? `?search=${encodeURIComponent(term)}` : '';
        navigate(`/courses${params}`);
    }, [navigate, searchQuery]);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, submitSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return ctx;
};
