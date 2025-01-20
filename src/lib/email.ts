import * as postmark from "postmark"

export class EmailService {
  private client: postmark.ServerClient

  constructor() {
    const apiKey = "bcb976d7-4b15-482a-97c7-2c2d9dd62994"
    if (!apiKey) {
      throw new Error("POSTMARK_API_KEY is not set in environment variables")
    }
    this.client = new postmark.ServerClient(apiKey)
  }

  private generateGoogleCalendarLink(title: string, description: string, startTime: Date, endTime: Date) {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[:-]/g, "").split(".")[0] + "Z"
    }

    const params = {
      action: "TEMPLATE",
      text: title,
      details: description,
      dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
    }

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")

    return `https://calendar.google.com/calendar/render?${queryString}`
  }

  async sendConfirmationEmail(
    patientEmail: string,
    patientName: string,
    appointmentType: string,
    startTime: Date,
    endTime: Date,
    date: Date,
  ) {
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const formattedTime = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    const calendarLink = this.generateGoogleCalendarLink(
      `Dental Appointment - ${appointmentType}`,
      `Appointment for ${patientName}`,
      startTime,
      endTime,
    )

    await this.client.sendEmail({
      From: "appointments@mysonder.tech",
      To: patientEmail,
      Subject: "Your Dental Appointment Confirmation",
      TextBody: `
        Dear ${patientName},

        Your ${appointmentType} appointment has been confirmed for ${formattedDate} at ${formattedTime}.

        Add to your calendar: ${calendarLink}

        Thank you for choosing our services.
        
        Best regards,
        Your Dental Team
      `,
      HtmlBody: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Dental Appointment Confirmation</title>
            <style>
              @media only screen and (max-width: 620px) {
                table.body h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                .wrapper {
                  padding: 32px !important;
                }
                .content {
                  padding: 24px !important;
                }
                .button {
                  width: 100% !important;
                }
              }
            </style>
          </head>
          <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; -webkit-text-size-adjust: none; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">
            <table class="body" style="background-color: #f6f9fc; border-collapse: separate; width: 100%; padding: 0; margin: 0; height: 100%;">
              <tr>
                <td style="vertical-align: top;">
                  <div class="wrapper" style="max-width: 600px; margin: 0 auto; padding: 64px;">
                    <!-- Logo -->
                    <div style="text-align: center; margin-bottom: 32px;">
                      <h1 style="color: #4F46E5; font-size: 28px; font-weight: bold;">Smile Studio</h1>
                    </div>
                    
                    <!-- Content -->
                    <div class="content" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 40px;">
                      <h1 style="color: #0F172A; font-size: 24px; font-weight: bold; margin: 0 0 24px; text-align: center;">
                        Appointment Confirmation
                      </h1>
                      
                      <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                        Dear ${patientName},
                      </p>
                      
                      <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                        Your <strong>${appointmentType}</strong> appointment has been confirmed for:
                      </p>
                      
                      <div style="background-color: #F8FAFC; border-radius: 4px; color: #0F172A; font-size: 18px; font-weight: bold; margin: 0 0 24px; padding: 16px; text-align: center;">
                        ${formattedDate} at ${formattedTime}
                      </div>
                      
                      <!-- Button -->
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${calendarLink}" class="button" style="background-color: #4F46E5; border-radius: 4px; color: white; display: inline-block; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 32px; transition: background-color 0.2s;">
                          Add to Calendar
                        </a>
                      </div>
                      
                      <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                        Thank you for choosing our services. If you need to reschedule or have any questions, please don't hesitate to contact us.
                      </p>
                      
                      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;">
                      
                      <p style="color: #64748B; font-size: 14px; margin: 0; text-align: center;">
                        Smile Studio<br>
                        Your trusted dental care partner
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
  }

  async sendReminderEmail(
    patientEmail: string,
    patientName: string,
    appointmentType: string,
    startTime: Date,
    date: Date,
  ) {
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const formattedTime = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    await this.client.sendEmail({
      From: "appointments@mysonder.tech",
      To: patientEmail,
      Subject: "Reminder: Your Dental Appointment Tomorrow",
      TextBody: `
        Dear ${patientName},

        This is a friendly reminder about your ${appointmentType} appointment tomorrow, ${formattedDate} at ${formattedTime}.

        Please let us know if you need to reschedule.

        Best regards,
        Your Dental Team
      `,
      HtmlBody: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Dental Appointment Reminder</title>
            <style>
              @media only screen and (max-width: 620px) {
                table.body h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                .wrapper {
                  padding: 32px !important;
                }
                .content {
                  padding: 24px !important;
                }
              }
            </style>
          </head>
          <body style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; -webkit-text-size-adjust: none; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important;">
            <table class="body" style="background-color: #f6f9fc; border-collapse: separate; width: 100%; padding: 0; margin: 0; height: 100%;">
              <tr>
                <td style="vertical-align: top;">
                  <div class="wrapper" style="max-width: 600px; margin: 0 auto; padding: 64px;">
                    <!-- Logo -->
                    <div style="text-align: center; margin-bottom: 32px;">
                      <h1 style="color: #4F46E5; font-size: 28px; font-weight: bold;">Smile Studio</h1>
                    </div>
                    
                    <!-- Content -->
                    <div class="content" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 40px;">
                      <h1 style="color: #0F172A; font-size: 24px; font-weight: bold; margin: 0 0 24px; text-align: center;">
                        Appointment Reminder
                      </h1>
                      
                      <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                        Dear ${patientName},
                      </p>
                      
                      <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                        This is a friendly reminder about your <strong>${appointmentType}</strong> appointment tomorrow:
                      </p>
                      
                      <div style="background-color: #F8FAFC; border-radius: 4px; color: #0F172A; font-size: 18px; font-weight: bold; margin: 0 0 24px; padding: 16px; text-align: center;">
                        ${formattedDate} at ${formattedTime}
                      </div>
                      
                      <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                        If you need to reschedule or have any questions, please don't hesitate to contact us.
                      </p>
                      
                      <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;">
                      
                      <p style="color: #64748B; font-size: 14px; margin: 0; text-align: center;">
                        Smile Studio<br>
                        Your trusted dental care partner
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
  }
}

