import './App.css';
import '../src/Daytimeline/DayTimeline.css';
import { DayTimeline } from './Daytimeline/DayTimeline.tsx';

const today = new Date();
const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T13:00:00`;
const start = new Date(dateString);
const end = new Date(new Date(start).setHours(start.getHours() + 1));

console.log(start.toString());
console.log(end.toString());
/*TODO add inaccurate time periods ? like half hour for 1h interval or 10 minutes or 43*/
function App() {
    return (
        <div className={'test-container'}>
            <DayTimeline
                timeslotHeight={40}
                onChange={(data) => console.log('from user ', data)}
                /*defaultSelected={{ start, end }}*/
                /*defaultSelected={[0, 24]}*/
                defaultSelected={['19:00', '21:30']}
            />
        </div>
    );
}

export default App;
