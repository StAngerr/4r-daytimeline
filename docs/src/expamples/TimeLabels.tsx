import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

// Custom time label components for demonstration
const DefaultLabel = (hour: number) => (
    <span className="time-label">
        {hour.toString().padStart(2, '0')}:00
    </span>
);

const TwelveHourLabel = (hour: number) => {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : 'PM';
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">{displayHour}</span>
            <span className="text-xs text-gray-500">{period}</span>
        </div>
    );
};

const MinimalLabel = (hour: number) => (
    <span className="text-xs text-gray-500 font-mono">
        {hour.toString().padStart(2, '0')}
    </span>
);

const DetailedLabel = (hour: number) => (
    <div className="flex flex-col items-center">
        <span className="text-sm font-bold">{hour}:00</span>
        <span className="text-xs text-gray-600">
            {hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'}
        </span>
    </div>
);

const IconLabel = (hour: number) => {
    const getIcon = (hour: number) => {
        if (hour >= 6 && hour < 12) return '🌅'; // Sunrise
        if (hour >= 12 && hour < 18) return '☀️'; // Sun
        if (hour >= 18 && hour < 22) return '🌆'; // Sunset
        return '🌙'; // Night
    };

    return (
        <div className="flex flex-col items-center">
            <span className="text-lg">{getIcon(hour)}</span>
            <span className="text-xs font-medium">{hour}:00</span>
        </div>
    );
};

const code = `
    import { DayTimeline, Period } from 'day-timeline';
    
    // Default 24-hour labels (left position)
    function DefaultLabels() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeLabels={{
            position: 'left'
          }}
        />
      );
    }
    
    // 12-hour format with AM/PM
    const TwelveHourLabel = (hour) => {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour < 12 ? 'AM' : 'PM';
      return (
        <div className="time-label-12h">
          <span className="hour">{displayHour}</span>
          <span className="period">{period}</span>
        </div>
      );
    };
    
    function TwelveHourLabels() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeLabels={{
            component: TwelveHourLabel,
            position: 'right'
          }}
        />
      );
    }
    
    // Minimal numeric labels
    const MinimalLabel = (hour) => (
      <span className="text-xs text-gray-500 font-mono">
        {hour.toString().padStart(2, '0')}
      </span>
    );
    
    function MinimalLabels() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeLabels={{
            component: MinimalLabel
          }}
        />
      );
    }
    
    // Detailed labels with time periods
    const DetailedLabel = (hour) => {
      const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
      return (
        <div className="detailed-label">
          <span className="time">{hour}:00</span>
          <span className="period">{period}</span>
        </div>
      );
    };
    
    function DetailedLabels() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeLabels={{
            component: DetailedLabel,
            position: 'left'
          }}
        />
      );
    }
    
    // Icon-based labels with sun/moon
    const IconLabel = (hour) => {
      const isDay = hour >= 6 && hour <= 18;
      const icon = isDay ? '☀️' : '🌙';
      return (
        <div className="icon-label">
          <span className="icon">{icon}</span>
          <span className="time">{hour}:00</span>
        </div>
      );
    };
    
    function IconLabels() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeLabels={{
            component: IconLabel,
            position: 'right'
          }}
        />
      );
    }
`;

type LabelMode = 'default' | 'twelve-hour' | 'minimal' | 'detailed' | 'icon';

export const TimeLabels = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);
    const [mode, setMode] = useState<LabelMode>('default');

    const getTimeLabelsConfig = (mode: LabelMode) => {
        switch (mode) {
            case 'default':
                return { position: 'left' as const };
            case 'twelve-hour':
                return { component: TwelveHourLabel, position: 'left' as const };
            case 'minimal':
                return { component: MinimalLabel, position: 'right' as const };
            case 'detailed':
                return { component: DetailedLabel, position: 'left' as const };
            case 'icon':
                return { component: IconLabel, position: 'right' as const };
            default:
                return { position: 'left' as const };
        }
    };

    const getModeDescription = (mode: LabelMode): string => {
        switch (mode) {
            case 'default':
                return 'Default 24-hour format labels on the left';
            case 'twelve-hour':
                return '12-hour format with AM/PM indicators';
            case 'minimal':
                return 'Minimal numeric labels on the right';
            case 'detailed':
                return 'Detailed labels with time periods (Morning/Afternoon/Evening)';
            case 'icon':
                return 'Icon-based labels with time indicators';
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
                                        {getModeDescription(mode)}. Select a time slot to begin.
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('default')}
                                >
                                    Default
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'twelve-hour' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('twelve-hour')}
                                >
                                    12-Hour
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'minimal' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('minimal')}
                                >
                                    Minimal
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'detailed' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('detailed')}
                                >
                                    Detailed
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'icon' ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('icon')}
                                >
                                    Icons
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            timeLabels={getTimeLabelsConfig(mode)}
                        />
                    </div>
                </div>
            }
        />
    );
}; 