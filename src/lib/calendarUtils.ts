// ~/lib/calendarUtils.ts
interface CalendarEvent {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    location: string;
  }
  
  export function formatCalendarInvite(event: CalendarEvent) {
    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
  
    const encodedData = encodeURIComponent([
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateTime(event.startTime)}`,
      `DTEND:${formatDateTime(event.endTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n'));
  
    return {
      htmlLink: `data:text/calendar;charset=utf8,${encodedData}`,
      textLink: `data:text/calendar;charset=utf8,${encodedData}`
    };
  }