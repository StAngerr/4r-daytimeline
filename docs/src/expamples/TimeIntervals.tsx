import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

const code = `
    import { DayTimeline, Period } from '4r-daytimeline';
    
    // Default 30-minute intervals
    function HalfHourIntervals() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          interval={30}  // Default value, can be omitted
        />
      );
    }
    
    // One-hour intervals
    function OneHourIntervals() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          interval={60}  // One-hour intervals
        />
      );
    }
`;

export const TimeIntervals = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);
    const [intervalType, setIntervalType] = useState<30 | 60>(60);

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
                                        Select a time slot to begin
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    className={`px-3 py-1 rounded ${intervalType === 30 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setIntervalType(30)}
                                >
                                    30-min intervals
                                </button>
                                <button
                                    className={`px-3 py-1 rounded ${intervalType === 60 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setIntervalType(60)}
                                >
                                    60-min intervals
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            interval={intervalType}
                        />
                    </div>
                </div>
            }
        />
    );
}; 