import { Link } from 'react-router-dom';

export const PublicCourseCard = ({ course }) => (
    <Link to={`/courses/${course.code}`} className="ocw-listing-card">
        <div className="code">{course.code}</div>
        <div className="title">{course.title}</div>
        <div className="meta">
            <strong>Category:</strong> {course.category || course.semester || 'General'}
        </div>
        <div className="meta">
            <strong>Credit Hours:</strong> {course.credits}
        </div>
    </Link>
);
