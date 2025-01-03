
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private oauth2Client: OAuth2Client;

  constructor(refreshToken: string) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_URL) {
      throw new Error('Missing required Google OAuth configuration');
    }

    this.oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    });

    this.oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    this.oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        this.oauth2Client.setCredentials({
          refresh_token: tokens.refresh_token
        });
      }
    });

    this.calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  async scheduleAppointment({
    email,
    startTime,
    endTime,
    summary,
    description
  }: {
    email: string;
    startTime: Date;
    endTime: Date;
    summary: string;
    description: string;
  }): Promise<string> {
    try {
      // Ensure token is fresh
      await this.oauth2Client.getAccessToken();

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary,
          description,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          attendees: [{ email }],
          reminders: {
            useDefault: true
          }
        }
      });

      if (!response.data.id) {
        throw new Error('Failed to create calendar event: No event ID returned');
      }

      return response.data.id;
    } catch (error) {
      console.error('Calendar Service Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to schedule appointment: ${error.message}`);
      }
      throw new Error('Failed to schedule appointment: Unknown error');
    }
  }

  async deleteAppointment(eventId: string): Promise<void> {
    try {
      await this.oauth2Client.getAccessToken();
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
    } catch (error) {
      console.error('Delete Calendar Event Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to delete appointment: ${error.message}`);
      }
      throw new Error('Failed to delete appointment: Unknown error');
    }
  }
}

