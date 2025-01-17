
import * as postmark from 'postmark';

export class EmailService {
  private client: postmark.ServerClient;

  constructor() {
    const apiKey = "bcb976d7-4b15-482a-97c7-2c2d9dd62994";
    if (!apiKey) {
      throw new Error('POSTMARK_API_KEY is not set in environment variables');
    }
    this.client = new postmark.ServerClient(apiKey);
  }

  async sendPasswordResetEmail(userEmail: string, resetCode: string) {
    const resetLink = `${process.env.NEXTAUTH_URL}/forgot-password/${resetCode}`;
    
    try {
      await this.client.sendEmail({
        From: "noreply@mysonder.tech",
        To: userEmail,
        Subject: "Reset Your Smile Studio Password",
        TextBody: `
          Hello,
          
          You recently requested to reset your password for your Smile Studio account. Click the link below to reset it:
          
          ${resetLink}
          
          If you did not request a password reset, please ignore this email or contact support if you have concerns.
          
          This password reset link is only valid for 15 minutes.
          
          Best regards,
          The Smile Studio Team
        `,
        HtmlBody: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <title>Reset Your Password</title>
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
                    padding: 0 !important;
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
                        <h1> Smile Studio</h1>
                      </div>
                      
                      <!-- Content -->
                      <div class="content" style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 40px;">
                        <h1 style="color: #0F172A; font-size: 24px; font-weight: bold; margin: 0 0 24px; text-align: center;">
                          Reset Your Password
                        </h1>
                        
                        <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                          Hello,
                        </p>
                        
                        <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                          We received a request to reset the password for your Smile Studio account. Click the button below to set a new password:
                        </p>
                        
                        <!-- Button -->
                        <div style="text-align: center; margin: 32px 0;">
                          <a href="${resetLink}" style="background-color: #4F46E5; border-radius: 4px; color: white; display: inline-block; font-size: 16px; font-weight: bold; text-decoration: none; padding: 12px 32px; transition: background-color 0.2s;">
                            Reset Password
                          </a>
                        </div>
                        
                        <p style="color: #475569; font-size: 16px; margin: 0 0 24px;">
                          If the button above doesn't work, you can also copy and paste this link into your browser:
                        </p>
                        
                        <p style="background-color: #F8FAFC; border-radius: 4px; color: #64748B; font-size: 14px; margin: 0 0 24px; padding: 12px; word-break: break-all;">
                          ${resetLink}
                        </p>
                        
                        <p style="color: #475569; font-size: 14px; margin: 0 0 24px;">
                          This password reset link will expire in 15 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.
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
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send reset email');
    }
  }
}