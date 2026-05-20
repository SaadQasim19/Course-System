import { Link } from 'react-router-dom';

export const FeaturedCourses = () => (
    <div className="ocw-featured">
        <h4>Featured Courses</h4>
        <Link to="/courses?sort=popular">Most Popular Courses</Link>
        <Link to="/courses?sort=visited">Most Visited Courses</Link>
    </div>
);
