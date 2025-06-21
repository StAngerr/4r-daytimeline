import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

// Custom components for demonstration
const SimpleTimeDisplay = ({ selected }: { selected: Period }) => (
    <div className="p-2 text-center bg-blue-50 border border-blue-200 rounded h-full flex items-center justify-center">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="font-semibold text-sm text-blue-800">
                {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    </div>
);

const DurationDisplay = ({ selected }: { selected: Period }) => {
    const duration = selected.end.getTime() - selected.start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return (
        <div className="p-2 text-center bg-green-50 border border-green-200 rounded h-full flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 mb-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm font-medium text-green-800">
                    {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Duration: {hours}h {minutes}m
            </div>
        </div>
    );
};

const InteractiveDisplay = ({ selected }: { selected: Period }) => (
    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded h-full flex flex-col items-center justify-center">
        <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <div className="text-sm font-medium text-yellow-800">
                {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
        <div className="flex space-x-1">
            <button 
                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center space-x-1"
                onClick={(e) => {
                    e.stopPropagation();
                    alert('Edit clicked!');
                }}
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
            </button>
            <button 
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-1"
                onClick={(e) => {
                    e.stopPropagation();
                    alert('Delete clicked!');
                }}
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
            </button>
        </div>
    </div>
);

const StyledDisplay = ({ selected }: { selected: Period }) => (
    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded h-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1 right-1">
            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        </div>
        <div className="text-center">
            <div className="text-sm font-bold">
                {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs opacity-90">
                to {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    </div>
);

const BookingDisplay = ({ selected }: { selected: Period }) => {
    const [isBooked, setIsBooked] = useState(false);
    
    return (
        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded h-full flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-sm font-bold">
                    {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <button 
                className={`px-3 py-1 text-xs rounded flex items-center space-x-1 transition-colors ${
                    isBooked 
                        ? 'bg-white text-emerald-600' 
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsBooked(!isBooked);
                    alert(isBooked ? 'Booking cancelled!' : 'Time slot booked successfully!');
                }}
            >
                {isBooked ? (
                    <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Booked</span>
                    </>
                ) : (
                    <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Book Now</span>
                    </>
                )}
            </button>
        </div>
    );
};

const code = `
    import { DayTimeline, Period } from '4r-daytimeline';
    
    // Simple time display with visual indicator
    const SimpleTimeDisplay = ({ selected }) => (
        <div className="p-2 text-center bg-blue-50 border border-blue-200 rounded h-full flex items-center justify-center">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="font-semibold text-sm text-blue-800">
                    {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
    
    // Component with duration calculation and clock icon
    const DurationDisplay = ({ selected }) => {
        const duration = selected.end.getTime() - selected.start.getTime();
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        
        return (
            <div className="p-2 text-center bg-green-50 border border-green-200 rounded h-full flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2 mb-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm font-medium text-green-800">
                        {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Duration: {hours}h {minutes}m
                </div>
            </div>
        );
    };
    
    // Interactive component with edit/delete buttons and icons
    const InteractiveDisplay = ({ selected }) => (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded h-full flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <div className="text-sm font-medium text-yellow-800">
                    {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
            <div className="flex space-x-1">
                <button 
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert('Edit clicked!');
                    }}
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                </button>
                <button 
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center space-x-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        alert('Delete clicked!');
                    }}
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
    
    // Styled component with gradient background and star icon
    const StyledDisplay = ({ selected }) => (
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1 right-1">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            </div>
            <div className="text-center">
                <div className="text-sm font-bold">
                    {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs opacity-90">
                    to {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
    
    // Booking component with submit/book functionality
    const BookingDisplay = ({ selected }) => {
        const [isBooked, setIsBooked] = useState(false);
        
        return (
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded h-full flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm font-bold">
                        {selected.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selected.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <button 
                    className={\`px-3 py-1 text-xs rounded flex items-center space-x-1 transition-colors \${
                        isBooked 
                            ? 'bg-white text-emerald-600' 
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }\`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsBooked(!isBooked);
                        alert(isBooked ? 'Booking cancelled!' : 'Time slot booked successfully!');
                    }}
                >
                    {isBooked ? (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Booked</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Book Now</span>
                        </>
                    )}
                </button>
            </div>
        );
    };
    
    // Usage examples
    function SimpleExample() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                selectedComponent={SimpleTimeDisplay}
            />
        );
    }
    
    function DurationExample() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                selectedComponent={DurationDisplay}
            />
        );
    }
    
    function InteractiveExample() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                selectedComponent={InteractiveDisplay}
            />
        );
    }
    
    function StyledExample() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                selectedComponent={StyledDisplay}
            />
        );
    }
    
    function BookingExample() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                selectedComponent={BookingDisplay}
            />
        );
    }
`;

type ComponentMode = 'simple' | 'duration' | 'interactive' | 'styled' | 'booking';

export const SelectedComponent = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);
    const [mode, setMode] = useState<ComponentMode>('simple');

    const getSelectedComponent = (mode: ComponentMode) => {
        switch (mode) {
            case 'simple':
                return SimpleTimeDisplay;
            case 'duration':
                return DurationDisplay;
            case 'interactive':
                return InteractiveDisplay;
            case 'styled':
                return StyledDisplay;
            case 'booking':
                return BookingDisplay;
            default:
                return SimpleTimeDisplay;
        }
    };

    const getModeDescription = (mode: ComponentMode): string => {
        switch (mode) {
            case 'simple':
                return 'Simple time display with visual indicator';
            case 'duration':
                return 'Duration calculation with clock icon';
            case 'interactive':
                return 'Interactive component with edit/delete buttons';
            case 'styled':
                return 'Styled component with gradient and star icon';
            case 'booking':
                return 'Booking component with submit/book functionality';
            default:
                return '';
        }
    };

    return (
        <ExampleLayout
            code={code}
            component={
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="h-16 p-4 border-b flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <div>
                                {selectedTime ? (
                                    <h3 className="font-medium">
                                        Selected time:&nbsp;
                                        {selectedTime.start.getHours() +
                                            ':' +
                                            selectedTime.start.getMinutes().toString().padStart(2, '0')}
                                        -
                                        {selectedTime.end.getHours() +
                                            ':' +
                                            selectedTime.end.getMinutes().toString().padStart(2, '0')}
                                    </h3>
                                ) : (
                                    <p className="font-medium">
                                        {getModeDescription(mode)}. Select a time slot to see the custom component.
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'simple' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('simple')}
                                >
                                    Simple
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'duration' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('duration')}
                                >
                                    Duration
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'interactive' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('interactive')}
                                >
                                    Interactive
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'styled' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('styled')}
                                >
                                    Styled
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'booking' ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('booking')}
                                >
                                    Booking
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            selectedComponent={getSelectedComponent(mode)}
                        />
                    </div>
                </div>
            }
        />
    );
}; 