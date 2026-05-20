import { Link } from 'react-router-dom';

export const HomePage = () => (
    <section className="ocw-home-hero">
        <h2>Welcome to Open Courseware</h2>
        <p>
            Virtual University of Pakistan provides free access to course materials, lecture outlines,
            and learning resources for students and lifelong learners worldwide.
        </p>
        <p>
            Browse our catalog of computer science and general education courses, explore detailed
            syllabi, and access structured lecture content for each program semester.
        </p>
        <p style={{ marginTop: 24 }}>
            <Link to="/courses" className="ocw-btn-find" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 24px' }}>
                Browse All Courses
            </Link>
        </p>
    </section>
);
