export const CourseCard = ({ course, type, onEnroll, onDrop, onViewDescription }) => {
    const semester = course.semester || 'N/A';
    const isEnrolled = type === 'student-enrolled' || type === 'teacher-enrolled';
    const isTeacher = type.includes('teacher');

    return (
        <div className={`course-card ${isEnrolled ? 'enrolled-course' : ''}`}>
            <div className="course-code">{course.code}</div>
            <div className="course-title">{course.title}</div>
            <div className="course-credits">{course.credits} Credits</div>
            {isTeacher && <div className="course-semester">Semester: {semester}</div>}
            
            {type === 'student-enrolled' && (
                <>
                    <button className="description-btn" onClick={() => onViewDescription(course)}>
                        View Description & Video
                    </button>
                    <button className="drop-btn" onClick={() => onDrop(course.code)}>
                        Drop Course
                    </button>
                </>
            )}
            
            {type === 'student-available' && (
                <>
                    <button className="description-btn" onClick={() => onViewDescription(course)}>
                        View Description
                    </button>
                    <button className="enroll-btn" onClick={() => onEnroll(course)}>
                        Enroll Now
                    </button>
                </>
            )}
            
            {type === 'teacher-enrolled' && (
                <div className="teacher-actions">
                    <button className="description-btn" onClick={() => onViewDescription(course)}>
                        View Description
                    </button>
                    <button className="drop-btn" onClick={() => onDrop(course.code)}>
                        Drop Course
                    </button>
                </div>
            )}
            
            {type === 'teacher-available' && (
                <>
                    <button className="description-btn" onClick={() => onViewDescription(course)}>
                        View Description
                    </button>
                    <button className="enroll-btn" onClick={() => onEnroll(course)}>
                        Enroll as Teacher
                    </button>
                </>
            )}
        </div>
    );
};
