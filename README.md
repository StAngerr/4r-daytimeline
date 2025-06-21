# DayTimeline Component

A powerful React component for selecting and displaying time periods within a day, similar to Outlook's event creation interface. Built with TypeScript and designed for modern React applications.

**Built by Crafted Kit**

## Features

- 🕐 **Flexible Time Selection**: Click and drag to create time slots
- 📅 **Business Hours Support**: Configure custom business hours or show full 24-hour timeline
- 🎨 **Customizable Appearance**: Control time slot heights, intervals, and styling
- 📍 **Current Time Indicator**: Visual indicator showing the current time
- 🏷️ **Custom Time Labels**: Customize time label format and position
- 🎯 **Existing Periods Display**: Show existing events, meetings, or bookings
- 🔧 **Custom Components**: Render custom content for selected time slots
- 📱 **Responsive Design**: Works seamlessly across different screen sizes
- ⚡ **TypeScript Support**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install day-timeline
# or
yarn add day-timeline
```

## Basic Usage

```tsx
import { DayTimeline, Period } from 'day-timeline';

function MyComponent() {
  const [selectedTime, setSelectedTime] = useState<Period | null>(null);

  return (
    <DayTimeline
      onChange={(period) => setSelectedTime(period)}
    />
  );
}
```

## Props

### `onChange` (required)
Callback function triggered when a user creates or modifies a time period.

```tsx
onChange: (selected: Period) => void
```

### `defaultSelected` (optional)
Initial selected time period to display when the component mounts.

```tsx
defaultSelected?: Period | [number, number] | [string, string]
```

**Examples:**
```tsx
// Using a Period object
<DayTimeline defaultSelected={{ start: startTime, end: endTime }} />

// Using hour numbers
<DayTimeline defaultSelected={[10, 11.5]} />

// Using time strings
<DayTimeline defaultSelected={["10:00", "11:30"]} />
```

### `periods` (optional)
Array of existing time periods to display on the timeline.

```tsx
periods?: Period[]
```

**Example:**
```tsx
const existingMeetings = [
  {
    start: new Date('2024-01-15T09:00:00'),
    end: new Date('2024-01-15T10:30:00'),
    id: 'meeting-1'
  }
];

<DayTimeline periods={existingMeetings} />
```

### `businessHours` (optional)
Controls the display of business hours on the timeline.

```tsx
businessHours?: boolean | BusinessHoursPeriod
```

**Examples:**
```tsx
// Default business hours (9 AM to 5 PM)
<DayTimeline businessHours={true} />

// Custom business hours
<DayTimeline businessHours={{ start: 8, end: 18 }} />

// Full 24-hour timeline
<DayTimeline businessHours={false} />
```

### `currentTime` (optional)
Settings for displaying the current time indicator on the timeline.

```tsx
currentTime?: CurrentTimeSettings
```

**Example:**
```tsx
<DayTimeline
  currentTime={{
    showLine: true,
    showTime: true,
    component: ({ timeLabel }) => <span className="custom-time">{timeLabel}</span>
  }}
/>
```

### `timeLabels` (optional)
Settings for customizing the time labels displayed on the timeline.

```tsx
timeLabels?: TimeLabelsSettings
```

**Example:**
```tsx
const CustomTimeLabel = (hour) => (
  <div className="custom-time-label">
    <span className="hour">{hour}:00</span>
    <span className="period">{hour < 12 ? 'AM' : 'PM'}</span>
  </div>
);

<DayTimeline
  timeLabels={{
    component: CustomTimeLabel,
    position: 'left'
  }}
/>
```

### `selectedComponent` (optional)
Custom component to render the content of the selected time period.

```tsx
selectedComponent?: React.ComponentType<{ selected: Period }>
```

**Example:**
```tsx
const TimeDisplay = ({ selected }) => (
  <div className="custom-time-display">
    <strong>Selected:</strong> {selected.start.toLocaleTimeString()} - {selected.end.toLocaleTimeString()}
  </div>
);

<DayTimeline selectedComponent={TimeDisplay} />
```

### `timeslotHeight` (optional)
Controls the height of each time slot in the timeline.

```tsx
timeslotHeight?: number
```

**Default:** `60`

**Example:**
```tsx
// Compact timeline
<DayTimeline timeslotHeight={40} />

// Spacious timeline
<DayTimeline timeslotHeight={80} />
```

### `interval` (optional)
Time interval in minutes for the timeline slots.

```tsx
interval?: 30 | 60
```

**Default:** `30`

**Example:**
```tsx
// Half-hour intervals (default)
<DayTimeline interval={30} />

// One-hour intervals
<DayTimeline interval={60} />
```

### `className` (optional)
Additional CSS class names to apply to the timeline container.

```tsx
className?: string
```

**Example:**
```tsx
<DayTimeline className="my-custom-timeline" />
```

### `date` (optional)
The date for which to display the timeline.

```tsx
date?: Date
```

**Default:** Current date

## Types

### `Period`
```tsx
interface Period {
  start: Date;
  end: Date;
  layer?: number;
  id?: string | number;
}
```

### `BusinessHoursPeriod`
```tsx
interface BusinessHoursPeriod {
  start: number; // 0-23
  end: number;   // 0-24
}
```

### `CurrentTimeSettings`
```tsx
interface CurrentTimeSettings {
  formatTime?: string;
  component?: React.ComponentType<{ timeLabel: string }>;
  showTime?: boolean;
  showLine?: boolean;
}
```

### `TimeLabelsSettings`
```tsx
interface TimeLabelsSettings {
  component?: (hour: number) => React.ReactElement;
  position?: 'left' | 'right';
}
```

## Examples

Visit our interactive documentation to see all examples in action:

**[📖 View Live Examples](https://stangerr.github.io/day-timeline)**

### Available Examples:
- **Base**: Basic timeline functionality
- **Pre-selected Period**: Timeline with default selected time
- **Current Time Indicator**: Timeline with current time display
- **Time Intervals**: Different interval configurations (30min/60min)
- **Business Hours**: Custom business hours and full-day timelines
- **Timeslot Height**: Different height configurations
- **Selected Component**: Custom components for selected time slots
- **Time Labels**: Custom time label formats and positions
- **Periods**: Display existing events, meetings, and bookings

## Advanced Features

### Cross-Day Periods
The component handles periods that span multiple days, showing only the relevant portion for the current date.

### Layered Events
Use the `layer` property in periods to control z-index and display overlapping events.

### Custom Styling
The component uses CSS custom properties for easy theming and customization.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - see LICENSE file for details.

## Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

**Built with ❤️ by Crafted Kit**
