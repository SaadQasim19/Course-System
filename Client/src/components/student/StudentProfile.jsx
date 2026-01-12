import { CourseCard } from '../shared/CourseCard';
import { exportProfileToPDF } from '../../utils/pdfExport';

export const StudentProfile = ({ user, enrolledCourses }) => {
    const handleDownloadPDF = () => {
        exportProfileToPDF(user, enrolledCourses);
    };

    return (
        <div className="profile-section">
            <h2>Student Profile</h2>
            
            <div className="profile-info">
                <div className="profile-item">
                    <strong>Full Name:</strong>
                    <span>{user.fullName}</span>
                </div>
                <div className="profile-item">
                    <strong>Registration Number:</strong>
                    <span>{user.regNumber}</span>
                </div>
                <div className="profile-item">
                    <strong>Role:</strong>
                    <span>Student</span>
                </div>
                <div className="profile-item">
                    <strong>Semester:</strong>
                    <span>{user.semester}</span>
                </div>
                <div className="profile-item">
                    <strong>Total Enrolled Courses:</strong>
                    <span>{enrolledCourses.length}</span>
                </div>
            </div>

            <hr />

            <div id="profile-courses">
                <h2>Enrolled Courses ({enrolledCourses.length})</h2>
                {enrolledCourses.length === 0 ? (
                    <p className="no-courses">No courses enrolled yet.</p>
                ) : (
                    enrolledCourses.map(course => (
                        <div key={course.code} className="course-card">
                            <div className="course-code">{course.code}</div>
                            <div className="course-title">{course.title}</div>
                            <div className="course-credits">{course.credits} Credits</div>
                        </div>
                    ))
                )}
            </div>

            <div className="back-to-courses">
                <button className="download-btn" onClick={handleDownloadPDF}>
                    Download Profile as PDF
                </button>
            </div>
        </div>
    );
};
