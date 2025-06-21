import { useState } from 'react';
import { DayTimeline, Period, BusinessHoursPeriod } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

const code = `
    import { DayTimeline, Period, BusinessHoursPeriod } from 'day-timeline';
    
    // Use default business hours (9 AM to 5 PM)
    function DefaultBusinessHours() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          businessHours={true}
        />
      );
    }
    
    // Custom business hours (8 AM to 6 PM)
    function CustomBusinessHours() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          businessHours={{
            start: 8,
            end: 18
          }}
        />
      );
    }
    
    // Extended business hours (7 AM to 8 PM)
    function ExtendedBusinessHours() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          businessHours={{
            start: 7,
            end: 20
          }}
        />
      );
    }
    
    // Full 24-hour timeline (no business hours)
    function FullDayTimeline() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          businessHours={false}
        />
      );
    }
`;

type BusinessHoursMode = 'default' | 'custom' | 'extended' | 'full';

export const BusinessHours = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);
    const [mode, setMode] = useState<BusinessHoursMode>('default');

    const getBusinessHoursConfig = (mode: BusinessHoursMode): boolean | BusinessHoursPeriod => {
        switch (mode) {
            case 'default':
                return true;
            case 'custom':
                return { start: 8, end: 18 };
            case 'extended':
                return { start: 7, end: 20 };
            case 'full':
                return false;
            default:
                return true;
        }
    };

    const getModeDescription = (mode: BusinessHoursMode): string => {
        switch (mode) {
            case 'default':
                return 'Default business hours (9 AM - 5 PM)';
            case 'custom':
                return 'Custom business hours (8 AM - 6 PM)';
            case 'extended':
                return 'Extended business hours (7 AM - 8 PM)';
            case 'full':
                return 'Full 24-hour timeline';
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
                                    className={`px-3 py-1 rounded text-sm ${mode === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('custom')}
                                >
                                    Custom
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'extended' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('extended')}
                                >
                                    Extended
                                </button>
                                <button
                                    className={`px-3 py-1 rounded text-sm ${mode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setMode('full')}
                                >
                                    Full Day
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            businessHours={getBusinessHoursConfig(mode)}
                        />
                    </div>
                </div>
            }
        />
    );
}; 