import { useState } from 'react';
import { DayTimeline, Period } from '../../../src';
import { ExampleLayout } from '../common/ExampleLayout';

const code = `
    import { DayTimeline } from 'day-timeline';
    
    <DayTimeline />

    `;
export const Base = () => {
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
                                    selectedTime.start.getMinutes()}
                                -
                                {selectedTime.end.getHours() +
                                    ':' +
                                    selectedTime.end.getMinutes()}
                            </h3>
                        ) : (
                            <p>Select some period</p>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-16">
                        <DayTimeline
                            onChange={(date) => setSelectedTime(date)}
                        />
                    </div>
                </div>
            }
        />
    );
};
