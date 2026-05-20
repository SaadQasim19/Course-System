import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Banner } from './Banner';
import { Breadcrumb } from './Breadcrumb';

const getBreadcrumbs = (pathname) => {
    const items = [{ label: 'Home', to: '/' }];

    if (pathname === '/about') {
        items.push({ label: 'About VU' });
        return items;
    }
    if (pathname === '/contact') {
        items.push({ label: 'Contact Us' });
        return items;
    }
    if (pathname === '/terms') {
        items.push({ label: 'Terms of Use' });
        return items;
    }

    return null;
};

export const MainLayout = () => {
    const location = useLocation();
    const breadcrumbs = getBreadcrumbs(location.pathname);

    return (
        <div className="ocw-app">
            <Header />
            <Banner />
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            <main className="ocw-container">
                <Outlet />
            </main>
        </div>
    );
};
