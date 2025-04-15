import { format } from 'date-fns';

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s]+$/
export const PW_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/
export const NO_DATA_MATCHED = "No Data Match with Filter...";

// Variables for calendar
export const TODAY = new Date();
export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const YEAR_CHANGE = ['prevYear', 'nextYear'];

// ENUM in DB
export const TASK_STATUS = ['Not Started', 'In Progress', 'Completed'];

export function formatDateTime (isoString){
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long'
    }).format(new Date(isoString), 'dd/MM/yyyy hh:mm tt')
}