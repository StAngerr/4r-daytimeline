import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

const code = `
    import { DayTimeline, Period } from '4r-daytimeline';
    
    // Create an initial time period from 10:00 AM to 11:30 AM
    const startTime = new Date();
    startTime.setHours(10, 0, 0);
    const endTime = new Date();
    endTime.setHours(11, 30, 0);
    
    // Using a Period object with Date objects
    function MyComponent() {
      const [selectedTime, setSelectedTime] = useState<Period>({
        start: startTime,
        end: endTime
      });
      
      return (
        <DayTimeline 
          defaultSelected={{ start: startTime, end: endTime }} 
          onChange={(period) => setSelectedTime(period)}
        />
      );
    }
    
    // Alternatively, you can use hour numbers (simpler approach)
    // <DayTimeline defaultSelected={[10, 11.5]} onChange={handleChange} />
    
    // Or even time strings
    // <DayTimeline defaultSelected={["10:00", "11:30"]} onChange={handleChange} />
`;

export const PreSelectedPeriod = () => {
    // Create a default time slot from 10:00 AM to 11:30 AM
    const startTime = new Date();
    startTime.setHours(10, 0, 0);
    const endTime = new Date();
    endTime.setHours(11, 30, 0);
    
    const [selectedTime, setSelectedTime] = useState<Period>({
        start: startTime,
        end: endTime
    });

    return (
        <ExampleLayout
            code={code}
            component={
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="h-16 p-4 border-b flex-shrink-0">
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
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            defaultSelected={{ start: startTime, end: endTime }}
                            onChange={(date) => setSelectedTime(date)}
                        />
                    </div>
                </div>
            }
        />
    );
}; 