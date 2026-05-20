import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { useAuth } from '../hooks/useAuth';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { CourseDetailSidebar } from '../components/layout/CourseDetailSidebar';

const SectionContent = ({ course, section }) => {
    switch (section) {
        case 'overview':
            return (
                <div className="ocw-section-block">
                    <p>{course.overview || course.description}</p>
                </div>
            );
        case 'links':
            return (
                <div className="ocw-section-block">
                    <ul>
                        {(course.relatedLinks || []).map((link) => (
                            <li key={link.url}>
                                <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        case 'books':
            return (
                <div className="ocw-section-block">
                    <ul>
                        {(course.referenceBooks || []).map((book) => (
                            <li key={book}>{book}</li>
                        ))}
                    </ul>
                </div>
            );
        case 'videos':
            return (
                <div className="ocw-section-block">
                    <ul>
                        {(course.lectureVideos || []).map((video) => (
                            <li key={video.title}>
                                <a href={video.url} target="_blank" rel="noreferrer">{video.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            );
        case 'assignments':
            return (
                <div className="ocw-section-block">
                    <ul>
                        {(course.assignments || []).map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            );
        case 'grading':
            return (
                <div className="ocw-section-block">
                    <p>{course.gradingScheme || 'Grading scheme will be announced by the instructor.'}</p>
                </div>
            );
        case 'home':
        default:
            return (
                <>
                    <table className="ocw-info-table">
                        <tbody>
                            <tr>
                                <td className="label">Course Category</td>
                                <td className="value">{course.category || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="label">Course Level</td>
                                <td className="value">{course.level || course.semester || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="label">Credit Hours</td>
                                <td className="value">{course.credits}</td>
                            </tr>
                            <tr>
                                <td className="label">Pre-requisites</td>
                                <td className="value">{course.prerequisites || 'None'}</td>
                            </tr>
                            <tr>
                                <td className="label">Instructor</td>
                                <td className="value">
                                    {course.instructor?.name || 'TBA'}
                                    {course.instructor && (
                                        <span className="ocw-instructor-sub">
                                            {course.instructor.qualification}, {course.instructor.university}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr className="ocw-divider" />
                    <div className="ocw-contents">
                        <h3>Course Contents</h3>
                        <ol className={`ocw-contents-list ${(course.contents?.length || 0) >= 20 ? 'scrollable' : ''}`}>
                            {(course.contents || []).map((topic, i) => (
                                <li key={`${topic}-${i}`}>{topic}</li>
                            ))}
                        </ol>
                    </div>
                </>
            );
    }
};

export const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser, updateUser } = useAuth();
    const [course, setCourse] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await courseApi.fetchCourseByCode(id);
                setCourse(data);
            } catch {
                setCourse(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        if (currentUser && course) {
            setIsLiked((currentUser.likedCourses || []).includes(course.code));
        }
    }, [currentUser, course]);

    const handleLike = async () => {
        if (!currentUser) {
            const goLogin = window.confirm('You must be logged in to like a course. Go to login page?');
            if (goLogin) navigate('/login');
            return;
        }

        try {
            const result = await courseApi.toggleLike(course.code, currentUser.regNumber);
            setIsLiked(result.isLiked);
            updateUser({ ...currentUser, likedCourses: result.likedCourses });
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return <p className="ocw-empty">Loading course...</p>;
    }

    if (!course) {
        return <p className="ocw-empty">Course not found.</p>;
    }

    const breadcrumbItems = [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: course.category || 'General', to: `/courses?search=${encodeURIComponent(course.category || '')}` },
        { label: course.code }
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <div className="ocw-two-col">
                <CourseDetailSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                <article className="ocw-panel">
                    <div className="ocw-detail-header">
                        <h1>{course.code} : {course.title.toUpperCase()}</h1>
                        <button
                            type="button"
                            className={`ocw-btn-like ${isLiked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            I like this Course
                        </button>
                    </div>
                    <SectionContent course={course} section={activeSection} />
                </article>
            </div>
        </>
    );
};
