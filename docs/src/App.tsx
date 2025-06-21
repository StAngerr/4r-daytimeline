import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { Base } from './expamples/Base';
import { PreSelectedPeriod } from './expamples/PreSelectedPeriod';
import { CurrentTimeIndicator } from './expamples/CurrentTimeIndicator';
import { TimeIntervals } from './expamples/TimeIntervals';
import { BusinessHours } from './expamples/BusinessHours';
import { TimeslotHeight } from './expamples/TimeslotHeight';
import { SelectedComponent } from './expamples/SelectedComponent';
import { TimeLabels } from './expamples/TimeLabels';
import { Periods } from './expamples/Periods';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Base />} />
                    <Route
                        path={'pre-selected'}
                        element={<PreSelectedPeriod />}
                    />
                    <Route
                        path={'current-time'}
                        element={<CurrentTimeIndicator />}
                    />
                    <Route
                        path={'time-intervals'}
                        element={<TimeIntervals />}
                    />
                    <Route
                        path={'business-hours'}
                        element={<BusinessHours />}
                    />
                    <Route
                        path={'timeslot-height'}
                        element={<TimeslotHeight />}
                    />
                    <Route
                        path={'selected-component'}
                        element={<SelectedComponent />}
                    />
                    <Route
                        path={'time-labels'}
                        element={<TimeLabels />}
                    />
                    <Route
                        path={'periods'}
                        element={<Periods />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
