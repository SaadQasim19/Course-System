export const CourseModal = ({ course, isOpen, onClose }) => {
    if (!isOpen || !course) return null;

    return (
        <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h3>{course.title}</h3>
                <div className="modal-course-code">Course Code: {course.code}</div>
                <div className="modal-course-credits">Credits: {course.credits}</div>
                
                <h4>Description</h4>
                <p>{course.description || 'No description available.'}</p>
                
                {course.videoLink && (
                    <>
                        <h4>Video Lecture</h4>
                        <p>
                            <a href={course.videoLink} target="_blank" rel="noopener noreferrer" style={{color: '#3182ce'}}>
                                Watch Video Lecture
                            </a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};
