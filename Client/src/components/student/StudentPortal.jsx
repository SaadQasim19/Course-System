import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/courseApi';
import { CourseCard } from '../shared/CourseCard';
import { CourseModal } from '../shared/CourseModal';
import { StudentProfile } from './StudentProfile';

export const StudentPortal = ({ user, onLogout, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('available');
    const [coursesData, setCoursesData] = useState({});
    const [enrolledCourses, setEnrolledCourses] = useState(user.enrolledCourses || []);
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
            setEnrolledCourses(result.enrolledCourses);
            const updatedUser = { ...user, enrolledCourses: result.enrolledCourses };
            onUpdateUser(updatedUser);
            alert('Enrolled successfully');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDrop = async (courseCode) => {
        try {
            const result = await courseApi.drop(user.regNumber, courseCode);
            setEnrolledCourses(result.enrolledCourses);
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

    const semester = user.semester || 'BCS-I';
    const semesterCourses = coursesData[semester] || [];
    const availableCourses = semesterCourses.filter(
        c => !enrolledCourses.some(ec => ec.code === c.code)
    );

    return (
        <>
            <div className="portal-header">
                <h1>Student Portal</h1>
                <div className="student-info">
                    <span>{user.fullName}</span>
                    <span>Semester: {semester}</span>
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
                    className={`nav-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enrolled')}
                >
                    Enrolled Courses
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
                        <h2>Available Courses ({semester})</h2>
                        <div className="courses-container">
                            {availableCourses.length === 0 ? (
                                <p className="no-courses">No new courses available.</p>
                            ) : (
                                availableCourses.map(course => (
                                    <CourseCard
                                        key={course.code}
                                        course={course}
                                        type="student-available"
                                        onEnroll={handleEnroll}
                                        onViewDescription={handleViewDescription}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'enrolled' && (
                <div className="portal-page active">
                    <div className="courses-section">
                        <h2>Enrolled Courses</h2>
                        <div className="courses-container">
                            {enrolledCourses.length === 0 ? (
                                <p className="no-courses">No courses enrolled yet.</p>
                            ) : (
                                enrolledCourses.map(course => (
                                    <CourseCard
                                        key={course.code}
                                        course={course}
                                        type="student-enrolled"
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
                    <StudentProfile user={user} enrolledCourses={enrolledCourses} />
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
