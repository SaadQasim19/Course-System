import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { CourseCard } from '../shared/CourseCard';
import { CourseModal } from '../shared/CourseModal';
import { TeacherProfile } from './TeacherProfile';

export const TeacherPortal = ({ user, onLogout, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('available');
    const [coursesData, setCoursesData] = useState({});
    const [teachingCourses, setTeachingCourses] = useState(user.enrolledCourses || []);
    const [modalCourse, setModalCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await courseApi.fetchCourses();
            const grouped = {};
            data.forEach(course => {
                const sem = course.semester;
                if (!grouped[sem]) grouped[sem] = [];
                grouped[sem].push(course);
            });
            setCoursesData(grouped);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleEnroll = async (course) => {
        try {
            const result = await courseApi.enroll(user.regNumber, course);
            setTeachingCourses(result.enrolledCourses);
            const updatedUser = { ...user, enrolledCourses: result.enrolledCourses };
            onUpdateUser(updatedUser);
            alert('Enrolled as Teacher successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDrop = async (courseCode) => {
        try {
            const result = await courseApi.drop(user.regNumber, courseCode);
            setTeachingCourses(result.enrolledCourses);
            const updatedUser = { ...user, enrolledCourses: result.enrolledCourses };
            onUpdateUser(updatedUser);
            alert('Dropped successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleViewDescription = (course) => {
        setModalCourse(course);
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    // Get all courses from all semesters
    const allCourses = [];
    Object.keys(coursesData).forEach(sem => {
        coursesData[sem].forEach(c => {
            allCourses.push({ ...c, semester: sem });
        });
    });

    const availableCourses = allCourses.filter(
        c => !teachingCourses.some(tc => tc.code === c.code)
    );

    return (
        <>
            <div className="portal-header">
                <h1>Teacher Portal</h1>
                <div className="teacher-info">
                    <span>{user.fullName}</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <nav className="portal-nav">
                <button
                    className={`nav-btn ${activeTab === 'available' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available')}
                >
                    Available Courses
                </button>
                <button
                    className={`nav-btn ${activeTab === 'teaching' ? 'active' : ''}`}
                    onClick={() => setActiveTab('teaching')}
                >
                    Teaching Courses
                </button>
                <button
                    className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
            </nav>

            {activeTab === 'available' && (
                <div className="portal-page active">
                    <div className="courses-section">
                        <h2>Available Courses ({availableCourses.length})</h2>
                        <div className="courses-container">
                            {availableCourses.length === 0 ? (
                                <p className="no-courses">No courses available.</p>
                            ) : (
                                availableCourses.map(course => (
                                    <CourseCard
                                        key={course.code}
                                        course={course}
                                        type="teacher-available"
                                        onEnroll={handleEnroll}
                                        onViewDescription={handleViewDescription}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'teaching' && (
                <div className="portal-page active">
                    <div className="courses-section">
                        <h2>Teaching Courses ({teachingCourses.length})</h2>
                        <div className="courses-container">
                            {teachingCourses.length === 0 ? (
                                <p className="no-courses">No courses assigned yet.</p>
                            ) : (
                                teachingCourses.map(course => (
                                    <CourseCard
                                        key={course.code}
                                        course={course}
                                        type="teacher-enrolled"
                                        onDrop={handleDrop}
                                        onViewDescription={handleViewDescription}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'profile' && (
                <div className="portal-page active">
                    <TeacherProfile user={user} teachingCourses={teachingCourses} />
                </div>
            )}

            <CourseModal
                course={modalCourse}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
