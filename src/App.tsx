import './App.css';
import '../src/Daytimeline/DayTimeline.css';
import { DayTimeline } from './Daytimeline/DayTimeline.tsx';

const today = new Date();
const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T13:00:00`;
const start = new Date(dateString);
const end = new Date(new Date(start).setHours(start.getHours() + 1));
/* TEST code*/

const generateRandomPeriod = (baseDate) => {
    const startPeriod = baseDate;

    // Set minutes to 0 or 30 for half-hour thresholds
    startPeriod.setMinutes(startPeriod.getMinutes() < 30 ? 0 : 30);

    // Randomly add between 0 and 23 hours
    const randomHours = Math.floor(Math.random() * 24);
    startPeriod.setHours(baseDate.getHours() + randomHours);

    // Generate a random period length between 0.5 and 3 hours
    const periodLength = (Math.floor(Math.random() * 6) + 1) * 0.5;
    const endPeriod = new Date(startPeriod);
    endPeriod.setHours(startPeriod.getHours() + Math.floor(periodLength));
    endPeriod.setMinutes(startPeriod.getMinutes() + (periodLength % 1) * 60);

    return { start: startPeriod, end: endPeriod };
};

const generatePeriods = (length, date) => {
    const periods = [];

    for (let i = 0; i < length; i++) {
        periods.push(generateRandomPeriod(date));
    }

    return periods;
};

// Example usage
const numberOfPeriods = 5;
const periods = generatePeriods(numberOfPeriods, today);

console.log(periods);

const p1_s = new Date();
const p1_e = new Date();
p1_s.setHours(7);
p1_s.setMinutes(30);

p1_e.setHours(9);
p1_e.setMinutes(0);

const p2_s = new Date();
const p2_e = new Date();
p2_s.setHours(3);
p2_s.setMinutes(0);

p2_e.setHours(6);
p2_e.setMinutes(0);

const p3_s = new Date();
const p3_e = new Date();
p3_s.setHours(18);
p3_s.setMinutes(0);

p3_e.setHours(18);
p3_e.setMinutes(30);

const p4_s = new Date();
const p4_e = new Date();
p4_s.setHours(17);
p4_s.setMinutes(0);

p4_e.setHours(21);
p4_e.setMinutes(30);

const p5_s = new Date();
const p5_e = new Date('2024-07-04T10:00:00');
p5_s.setHours(22);
p5_s.setMinutes(0);

p5_e.setHours(10);
p5_e.setMinutes(30);

const p6_s = new Date('2024-07-01T10:00:00');
const p6_e = new Date('2024-07-08T10:00:00');
p6_s.setHours(22);
p6_s.setMinutes(0);

p6_e.setHours(10);
p6_e.setMinutes(30);

const p7_s = new Date('2024-07-01T10:00:00');
const p7_e = new Date();
p7_s.setHours(22);
p7_s.setMinutes(0);

p7_e.setHours(1);
p7_e.setMinutes(30);

const p8_s = new Date('2024-07-07T10:00:00');
const p8_e = new Date();
p8_s.setHours(7);
p8_s.setMinutes(0);

p8_e.setHours(8);
p8_e.setMinutes(35);

const periods1 = [
    { start: p1_s, end: p1_e },
    { start: p2_s, end: p2_e },
    { start: p3_s, end: p3_e, layer: 2 },
    { start: p4_s, end: p4_e },
    { start: p5_s, end: p5_e },
    { start: p7_s, end: p7_e },
    // { start: p6_s, end: p6_e },
];
/*end*/
/*TODO add inaccurate time periods ? like half hour for 1h interval or 10 minutes or 43*/
function App() {
    return (
        <div className={'test-container'}>
            <DayTimeline
                timeslotHeight={40}
                onChange={(data) => console.log(data)}
                /*defaultSelected={{ start, end }}*/
                /*defaultSelected={[0, 24]}*/
                // defaultSelected={['09:00', '09:30']}
                // businessHours={true}
                // businessHours={{ start: 22, end: 23 }}
                date={new Date('2021-01-02T10:00:00')}
                timeLabels={{
                    position: 'right',
                }}
                currentTime={{
                    showTime: true,
                }}
                // periods={periods1.map((i, idx) => ({ ...i, id: idx }))}
                periods={[{ start: p8_s, end: p8_e }]}
                selectedComponent={(args) => {
                    /*TODO define types for arguments*/
                    return (
                        <div>
                            <span>{args.start}</span>
                            <span>{args.end}</span>
                        </div>
                    );
                }}
            />
        </div>
    );
}

export default App;
