import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { PublicCourseCard } from '../components/public/PublicCourseCard';
import { FeaturedCourses } from '../components/layout/FeaturedCourses';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { useSearch } from '../context/SearchContext';

export const CoursesPage = () => {
    const [searchParams] = useSearchParams();
    const { searchQuery, setSearchQuery } = useSearch();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const urlSearch = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';

    useEffect(() => {
        if (urlSearch) setSearchQuery(urlSearch);
    }, [urlSearch, setSearchQuery]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await courseApi.fetchCourses({
                    search: urlSearch || searchQuery,
                    sort: sort || undefined
                });
                setCourses(data);
            } catch (err) {
                console.error(err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [urlSearch, searchQuery, sort]);

    const breadcrumbItems = [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' }
    ];

    if (sort === 'popular') breadcrumbItems.push({ label: 'Most Popular Courses' });
    if (sort === 'visited') breadcrumbItems.push({ label: 'Most Visited Courses' });
    if (urlSearch) breadcrumbItems.push({ label: `Search: ${urlSearch}` });

    const pageTitle = sort === 'popular'
        ? 'Most Popular Courses'
        : sort === 'visited'
            ? 'Most Visited Courses'
            : urlSearch
                ? `Search Results for "${urlSearch}"`
                : 'All Courses';

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="ocw-two-col">
                <aside className="ocw-sidebar">
                    <FeaturedCourses />
                </aside>
                <section className="ocw-panel">
                    <h2>{pageTitle}</h2>
                    {loading ? (
                        <p className="ocw-empty">Loading courses...</p>
                    ) : courses.length === 0 ? (
                        <p className="ocw-empty">No courses found. Try a different search term.</p>
                    ) : (
                        <div className="ocw-course-grid">
                            {courses.map((course) => (
                                <PublicCourseCard key={course.code} course={course} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};
