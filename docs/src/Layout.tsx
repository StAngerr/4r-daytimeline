import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="flex justify-center items-center bg-blue-600 text-white shadow-lg h-16 flex-shrink-0">
                <h1 className="text-xl font-bold">daytimeline component docs</h1>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <nav className="w-64 bg-gray-100 p-4 overflow-y-auto flex-shrink-0 border-r">
                    <div className="flex flex-col h-full justify-between">
                        <div>
                            <div className="text-lg font-bold mb-4">Examples</div>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="hover:text-blue-600 block py-1">
                                        Base
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/pre-selected"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Pre-selected Period
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/current-time"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Current Time Indicator
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/time-intervals"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Time Intervals
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/business-hours"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Business Hours
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/timeslot-height"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Timeslot Height
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/selected-component"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Selected Component
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/time-labels"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Time Labels
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/periods"
                                        className="hover:text-blue-600 block py-1"
                                    >
                                        Periods
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="pt-4 border-t mt-8">
                            <a
                                href="https://github.com/StAngerr/4r-daytimeline"
                                className="text-blue-600 hover:underline block py-2"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                GitHub Repository
                            </a>
                        </div>
                    </div>
                </nav>
                <main className="flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
