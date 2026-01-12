export const TeacherProfile = ({ user, teachingCourses }) => {
    return (
        <div className="profile-section">
            <h2>Teacher Profile</h2>
            
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
                    <span>Teacher</span>
                </div>
                <div className="profile-item">
                    <strong>Total Teaching Courses:</strong>
                    <span>{teachingCourses.length}</span>
                </div>
            </div>

            <hr />

            <div id="profile-courses">
                <h2>Teaching Courses ({teachingCourses.length})</h2>
                {teachingCourses.length === 0 ? (
                    <p className="no-courses">No courses assigned yet.</p>
                ) : (
                    teachingCourses.map(course => (
                        <div key={course.code} className="course-card">
                            <div className="course-code">{course.code}</div>
                            <div className="course-title">{course.title}</div>
                            <div className="course-credits">{course.credits} Credits</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
