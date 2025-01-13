// ~/lib/emailService.ts
import * as postmark from 'postmark';

export class EmailService {
  private client: postmark.ServerClient;

  constructor() {
    this.client = new postmark.ServerClient("bcb976d7-4b15-482a-97c7-2c2d9dd62994");
  }

  async sendConfirmationEmail(
    patientEmail: string,
    patientName: string,
    appointmentType: string,
    startTime: Date,
    date: Date
  ) {
    const formattedDate = date.toLocaleDateString();
    const formattedTime = startTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    await this.client.sendEmail({
      From: "appointments@mysonder.tech",
      To: patientEmail,
      Subject: "Appointment Confirmation",
      TextBody: `
        Dear ${patientName},

        Your ${appointmentType} appointment has been confirmed for ${formattedDate} at ${formattedTime}.

        Thank you for choosing our services.
        
        Best regards,
        Your Dental Team
      `,
      HtmlBody: `
        <p>Dear ${patientName},</p>
        <p>Your ${appointmentType} appointment has been confirmed for ${formattedDate} at ${formattedTime}.</p>
        <p>Thank you for choosing our services.</p>
        <p>Best regards,<br>Your Dental Team</p>
      `,
    });
  }

  async sendReminderEmail(
    patientEmail: string,
    patientName: string,
    appointmentType: string,
    startTime: Date,
    date: Date
  ) {
    const formattedDate = date.toLocaleDateString();
    const formattedTime = startTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    await this.client.sendEmail({
      From: "appointments@mysonder.tech",
      To: patientEmail,
      Subject: "Appointment Reminder",
      TextBody: `
        Dear ${patientName},

        This is a reminder of your upcoming ${appointmentType} appointment tomorrow at ${formattedTime}.

        We look forward to seeing you.

        Best regards,
        Your Dental Team
      `,
      HtmlBody: `
        <p>Dear ${patientName},</p>
        <p>This is a reminder of your upcoming ${appointmentType} appointment tomorrow at ${formattedTime}.</p>
        <p>We look forward to seeing you.</p>
        <p>Best regards,<br>Your Dental Team</p>
      `,
    });
  }
}