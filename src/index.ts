/**
 * @typedef {Object} Period
 * @property {Date} start - The start time of the period
 * @property {Date} end - The end time of the period
 * @property {string} [title] - Optional title for the period
 * @property {string|number} [id] - Optional unique identifier for the period
 */

/**
 * DayTimeline Component
 * A React component for selecting time periods within a day, similar to Outlook's event creation interface.
 * 
 * @typedef {Object} DayTimelineProps
 * @property {Period[]} [periods] - Array of pre-defined time periods to display
 * @property {function(Period): void} [onChange] - Callback triggered when a user modifies a time period.
 * This function is called when the user:
 * - Drags to create a new time slot
 * - Clicks on an empty area to create a new time slot
 * - Modifies an existing time slot by dragging its edges
 * 
 * The callback receives a Period object representing the newly created or modified time period.
 * @property {boolean} [readonly] - If true, the timeline will be in read-only mode and cannot be modified
 */

export * from './DayTimeline/DayTimeline';
export * from './DayTimeline/DayTimeline.types';
export { DayTimeline } from './DayTimeline/DayTimeline';
