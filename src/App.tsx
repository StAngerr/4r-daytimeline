import './App.css';
import '../src/Daytimeline/DayTimeline.css';
import { DayTimeline } from './Daytimeline/DayTimeline.tsx';

function App() {
    return (
        <div className={'test-container'}>
            <DayTimeline timeslotHeight={55} />
        </div>
    );
}

export default App;
