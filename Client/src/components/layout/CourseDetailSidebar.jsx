import { FeaturedCourses } from './FeaturedCourses';

const SECTIONS = [
    { id: 'home', label: 'Course Home' },
    { id: 'overview', label: 'Course Overview' },
    { id: 'links', label: 'Related Links' },
    { id: 'books', label: 'Reference Books' },
    { id: 'videos', label: 'Lecture Videos' },
    { id: 'assignments', label: 'Course Assignments' },
    { id: 'grading', label: 'Course Grading Scheme' }
];

export const CourseDetailSidebar = ({ activeSection, onSectionChange }) => (
    <aside className="ocw-sidebar">
        <ul className="ocw-sidebar-nav">
            {SECTIONS.map((section) => (
                <li key={section.id}>
                    <button
                        type="button"
                        className={activeSection === section.id ? 'active' : ''}
                        onClick={() => onSectionChange(section.id)}
                    >
                        {section.label}
                    </button>
                </li>
            ))}
        </ul>
        <FeaturedCourses />
    </aside>
);
