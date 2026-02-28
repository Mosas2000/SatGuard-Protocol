import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
    header?: ReactNode;
}

export default function DashboardLayout({ children, sidebar, header }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {header && (
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                    {header}
                </div>
            )}
            <div className="flex">
                {sidebar && (
                    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16 hidden lg:block">
                        <div className="p-6">
                            {sidebar}
                        </div>
                    </aside>
                )}
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
