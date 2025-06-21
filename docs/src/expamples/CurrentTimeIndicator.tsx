import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

const code = `
    import { DayTimeline, Period } from 'day-timeline';
    
    // Basic usage with current time indicator
    function BasicCurrentTime() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          currentTime={{
            showLine: true,
            showTime: true
          }}
        />
      );
    }
    
    // Custom current time indicator
    function CustomCurrentTime() {
      const [selectedTime, setSelectedTime] = useState<Period | null>(null);
      
      return (
        <DayTimeline
          onChange={(period) => setSelectedTime(period)}
          currentTime={{
            showLine: true,
            showTime: true,
            component: ({ timeLabel }) => (
              <div className="custom-time-label">
                Current time: {timeLabel}
              </div>
            )
          }}
        />
      );
    }
`;

export const CurrentTimeIndicator = () => {
    const [selectedTime, setSelectedTime] = useState<Period | null>(null);

    return (
        <ExampleLayout
            code={code}
            component={
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="h-16 p-4 border-b flex-shrink-0">
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
                                The red line shows the current time. Select a time slot to begin.
                            </p>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                            currentTime={{
                                showLine: true,
                                showTime: true
                            }}
                        />
                    </div>
                </div>
            }
        />
    );
}; 