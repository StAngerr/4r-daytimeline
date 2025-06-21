import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

const code = `
    import { DayTimeline, Period } from '4r-daytimeline';
    
    // Default height (60px) - balanced spacing
    function DefaultHeight() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeslotHeight={60}
        />
      );
    }
    
    // Compact timeline (40px) - more slots visible
    function CompactTimeline() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeslotHeight={40}
        />
      );
    }
    
    // Spacious timeline (80px) - easier interaction
    function SpaciousTimeline() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeslotHeight={80}
        />
      );
    }
    
    // Large timeline (100px) - maximum comfort
    function LargeTimeline() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeslotHeight={100}
        />
      );
    }
    
    // Extra compact (30px) - maximum density
    function ExtraCompactTimeline() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          timeslotHeight={30}
        />
      );
    }
`;

type TimeslotHeightMode = 'compact' | 'default' | 'spacious' | 'large' | 'extra-compact';

export const TimeslotHeight = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);
    const [mode, setMode] = useState<TimeslotHeightMode>('default');

    const getTimeslotHeight = (mode: TimeslotHeightMode): number => {
        switch (mode) {
            case 'compact':
                return 40;
            case 'default':
                return 60;
            case 'spacious':
                return 80;
            case 'large':
                return 100;
            case 'extra-compact':
                return 30;
            default:
                return 60;
        }
    };

    const getModeDescription = (mode: TimeslotHeightMode): string => {
        switch (mode) {
            case 'compact':
                return 'Compact timeline (40px) - more slots visible';
            case 'default':
                return 'Default height (60px) - balanced spacing';
            case 'spacious':
                return 'Spacious timeline (80px) - easier interaction';
            case 'large':
                return 'Large timeline (100px) - maximum comfort';
            case 'extra-compact':
                return 'Extra compact (30px) - maximum density';
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
                                    className={`px-3 py-1 rounded text-sm ${mode === 'extra-compact' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('extra-compact')}
                                >
                                    30px
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'compact' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('compact')}
                                >
                                    40px
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('default')}
                                >
                                    60px
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'spacious' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('spacious')}
                                >
                                    80px
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'large' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('large')}
                                >
                                    100px
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            timeslotHeight={getTimeslotHeight(mode)}
                        />
                    </div>
                </div>
            }
        />
    );
}; 