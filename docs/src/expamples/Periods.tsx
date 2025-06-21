import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

// Helper function to create periods for today
const createPeriodsForToday = (baseHour: number, duration: number, id: string): Period => {
    const start = new Date();
    start.setHours(baseHour, 0, 0, 0);
    const end = new Date();
    end.setHours(baseHour + duration, 0, 0, 0);
    return { start, end, id };
};

// Different types of periods for demonstration
const getMeetingPeriods = (): Period[] => [
    createPeriodsForToday(9, 1.5, 'meeting-1'),   // 9:00 - 10:30
    createPeriodsForToday(14, 1, 'meeting-2'),    // 14:00 - 15:00
    createPeriodsForToday(16, 0.5, 'meeting-3'),  // 16:00 - 16:30
];

const getEventPeriods = (): Period[] => [
    createPeriodsForToday(10, 1, 'event-1'),      // 10:00 - 11:00
    createPeriodsForToday(13, 3, 'event-2'),      // 13:00 - 16:00
    createPeriodsForToday(18, 2, 'event-3'),      // 18:00 - 20:00
];

const getBookingPeriods = (): Period[] => [
    createPeriodsForToday(8, 1, 'booking-1'),     // 8:00 - 9:00
    createPeriodsForToday(11, 2, 'booking-2'),    // 11:00 - 13:00
    createPeriodsForToday(15, 1.5, 'booking-3'),  // 15:00 - 16:30
    createPeriodsForToday(19, 1, 'booking-4'),    // 19:00 - 20:00
];

const getLayeredPeriods = (): Period[] => [
    { ...createPeriodsForToday(9, 2, 'layer-1'), layer: 1 },    // 9:00 - 11:00, layer 1
    { ...createPeriodsForToday(10, 1, 'layer-2'), layer: 2 },   // 10:00 - 11:00, layer 2 (overlaps)
    { ...createPeriodsForToday(14, 3, 'layer-3'), layer: 1 },   // 14:00 - 17:00, layer 1
    { ...createPeriodsForToday(15, 1, 'layer-4'), layer: 2 },   // 15:00 - 16:00, layer 2 (overlaps)
];

const getCrossDayPeriods = (): Period[] => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return [
        // Period starting yesterday, ending today
        {
            start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 22, 0, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0),
            id: 'cross-day-1'
        },
        // Period starting today, ending tomorrow
        {
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0, 0),
            end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 1, 0, 0),
            id: 'cross-day-2'
        },
        // Period spanning multiple days
        {
            start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 20, 0, 0),
            end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 4, 0, 0),
            id: 'cross-day-3'
        }
    ];
};

const code = `
    import { DayTimeline, Period } from '4r-daytimeline';
    
    // Helper function to create periods for today
    const createPeriodsForToday = (baseHour, duration, id) => {
        const start = new Date();
        start.setHours(baseHour, 0, 0, 0);
        const end = new Date();
        end.setHours(baseHour + duration, 0, 0, 0);
        return { start, end, id };
    };
    
    // Display existing meetings
    const meetingPeriods = [
        createPeriodsForToday(9, 1.5, 'meeting-1'),   // 9:00 - 10:30
        createPeriodsForToday(14, 1, 'meeting-2'),    // 14:00 - 15:00
        createPeriodsForToday(16, 0.5, 'meeting-3'),  // 16:00 - 16:30
    ];
    
    function MeetingTimeline() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                periods={meetingPeriods}
            />
        );
    }
    
    // Display events with custom styling
    const eventPeriods = [
        createPeriodsForToday(10, 1, 'event-1'),      // 10:00 - 11:00
        createPeriodsForToday(13, 3, 'event-2'),      // 13:00 - 16:00
        createPeriodsForToday(18, 2, 'event-3'),      // 18:00 - 20:00
    ];
    
    function EventTimeline() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                periods={eventPeriods}
            />
        );
    }
    
    // Display bookings
    const bookingPeriods = [
        createPeriodsForToday(8, 1, 'booking-1'),     // 8:00 - 9:00
        createPeriodsForToday(11, 2, 'booking-2'),    // 11:00 - 13:00
        createPeriodsForToday(15, 1.5, 'booking-3'),  // 15:00 - 16:30
        createPeriodsForToday(19, 1, 'booking-4'),    // 19:00 - 20:00
    ];
    
    function BookingTimeline() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                periods={bookingPeriods}
            />
        );
    }
    
    // Display layered periods (overlapping events)
    const layeredPeriods = [
        { ...createPeriodsForToday(9, 2, 'layer-1'), layer: 1 },    // 9:00 - 11:00, layer 1
        { ...createPeriodsForToday(10, 1, 'layer-2'), layer: 2 },   // 10:00 - 11:00, layer 2 (overlaps)
        { ...createPeriodsForToday(14, 3, 'layer-3'), layer: 1 },   // 14:00 - 17:00, layer 1
        { ...createPeriodsForToday(15, 1, 'layer-4'), layer: 2 },   // 15:00 - 16:00, layer 2 (overlaps)
    ];
    
    function LayeredTimeline() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                periods={layeredPeriods}
            />
        );
    }
    
    // Display cross-day periods
    const crossDayPeriods = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return [
            // Period starting yesterday, ending today
            {
                start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 22, 0, 0),
                end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0),
                id: 'cross-day-1'
            },
            // Period starting today, ending tomorrow
            {
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0, 0),
                end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 1, 0, 0),
                id: 'cross-day-2'
            },
            // Period spanning multiple days
            {
                start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 20, 0, 0),
                end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 4, 0, 0),
                id: 'cross-day-3'
            }
        ];
    };
    
    function CrossDayTimeline() {
        const [selectedTime, setSelectedTime] = useState(null);
        
        return (
            <DayTimeline
                onChange={(period) => setSelectedTime(period)}
                periods={crossDayPeriods()}
            />
        );
    }
`;

type PeriodMode = 'meetings' | 'events' | 'bookings' | 'layered' | 'cross-day';

export const Periods = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);
    const [mode, setMode] = useState<PeriodMode>('meetings');

    const getPeriods = (mode: PeriodMode): Period[] => {
        switch (mode) {
            case 'meetings':
                return getMeetingPeriods();
            case 'events':
                return getEventPeriods();
            case 'bookings':
                return getBookingPeriods();
            case 'layered':
                return getLayeredPeriods();
            case 'cross-day':
                return getCrossDayPeriods();
            default:
                return [];
        }
    };

    const getModeDescription = (mode: PeriodMode): string => {
        switch (mode) {
            case 'meetings':
                return 'Existing meetings (9:00-10:30, 14:00-15:00, 16:00-16:30)';
            case 'events':
                return 'Scheduled events (10:00-11:00, 13:00-16:00, 18:00-20:00)';
            case 'bookings':
                return 'Room bookings (8:00-9:00, 11:00-13:00, 15:00-16:30, 19:00-20:00)';
            case 'layered':
                return 'Overlapping events with different layers (z-index)';
            case 'cross-day':
                return 'Events spanning multiple days (cross-day periods)';
            default:
                return '';
        }
    };

    const getPeriodCount = (mode: PeriodMode): number => {
        return getPeriods(mode).length;
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
                                        {getModeDescription(mode)}. {getPeriodCount(mode)} existing periods shown. Select a time slot to begin.
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'meetings' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('meetings')}
                                >
                                    Meetings
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'events' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('events')}
                                >
                                    Events
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'bookings' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('bookings')}
                                >
                                    Bookings
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'layered' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('layered')}
                                >
                                    Layered
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'cross-day' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('cross-day')}
                                >
                                    Cross-Day
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            periods={getPeriods(mode)}
                        />
                    </div>
                </div>
            }
        />
    );
}; 