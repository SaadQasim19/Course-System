import { useState } from 'react';
import { useSearch } from '../../context/SearchContext';

export const Banner = () => {
    const { searchQuery, setSearchQuery, submitSearch } = useSearch();
    const [localQuery, setLocalQuery] = useState(searchQuery);

    const handleSubmit = (e) => {
        e.preventDefault();
        submitSearch(localQuery);
    };

    return (
        <div className="ocw-banner">
            <div className="ocw-banner-inner">
                <div className="ocw-logo" aria-hidden="true">VU</div>
                <div className="ocw-banner-title">
                    <h1>OPEN COURSEWARE</h1>
                    <p>VIRTUAL UNIVERSITY OF PAKISTAN</p>
                </div>
                <form className="ocw-search-box" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={localQuery}
                        onChange={(e) => {
                            setLocalQuery(e.target.value);
                            setSearchQuery(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                submitSearch(localQuery);
                            }
                        }}
                        aria-label="Search courses"
                    />
                    <button type="submit" className="ocw-btn-find">FIND COURSE</button>
                </form>
            </div>
        </div>
    );
};
