import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen text-slate-200">
            <Sidebar />
            <div className="flex-1 ml-72">
                {/* Top Navigation Bar could go here if needed, but for now we keep it clean */}
                <main className="p-8 max-w-[1600px] mx-auto min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
