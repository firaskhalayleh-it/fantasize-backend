import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;

}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const mailOptions = {
    from: `"Fantasize" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw error;
  }
}


export function orderConfirmationTemplate(orderId: string, userName: string): string {
  return `
     <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <link href="https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Uncial Antiqua', cursive; /* Fantasy Font */
      background-color: #f0f0f5; /* Light fantasy background */
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background: linear-gradient(to right, #f0e1c9, #d5c5a6);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      border: 2px solid #d4af37; /* Golden touch */
    }

    h1 {
      font-size: 32px;
      color: #4b2e83; /* Deep purple */
      text-align: center;
      margin-bottom: 20px;
      text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 18px;
      color: #444;
      line-height: 1.6;
    }

    .order-id {
      font-weight: bold;
      color: #d4af37; /* Golden accent for the order ID */
    }

    .cta-button {
      display: block;
      text-align: center;
      margin-top: 30px;
    }

    .cta-button a {
      text-decoration: none;
      background-color: #4b2e83;
      color: #fff;
      padding: 12px 25px;
      font-size: 18px;
      border-radius: 8px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease;
    }

    .cta-button a:hover {
      background-color: #673ab7; /* Lighter purple on hover */
    }

    footer {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #777;
    }

    .footer-text {
      font-size: 16px;
      margin-top: 20px;
      font-style: italic;
      color: #4b2e83;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>Order Confirmation</h1>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Thank you for your order. Your order ID is <span class="order-id">${orderId}</span>.</p>
    <p>We are working to get your order ready. You will receive an update when your order is shipped.</p>
    
    <div class="cta-button">
      <a href="https://i.pinimg.com/736x/b7/96/86/b79686064b726112248a1a2190b4b429.jpg">View Your Order</a>
    </div>
    
    <footer>
      <p class="footer-text">"May your journey with us be as magical as your new purchase."</p>
    </footer>
  </div>
</body>
</html>

    `;
}


export function passwordResetTemplate(resetToken: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }

        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo img {
          max-width: 150px;
          height: auto;
        }

        h1 {
          color: #ff4444;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }

        .message {
          margin-bottom: 30px;
          font-size: 16px;
        }

        .token-container {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 25px;
          text-align: center;
        }

        .token {
          font-family: monospace;
          font-size: 16px;
          color: #495057;
          word-break: break-all;
          margin-bottom: 10px;
        }

        .copy-button {
          background-color: #ff4444;
          color: #ffffff;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
          text-decoration: none;
          display: inline-block;
        }

        .copy-button:hover {
          background-color: #ff6666;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #6c757d;
        }

        .warning {
          color: #dc3545;
          font-size: 14px;
          margin-top: 20px;
          text-align: center;
        }

        @media only screen and (max-width: 480px) {
          body {
            padding: 10px;
          }

          .container {
            padding: 20px;
          }

          h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <!-- Replace with your logo -->
          <img src="https://your-logo-url.com/logo.png" alt="Company Logo">
        </div>
        
        <h1>Password Reset Request</h1>
        
        <div class="message">
          <p>Hello,</p>
          <p>We received a request to reset your password. To proceed with the password reset, please use the token below:</p>
        </div>

        <div class="token-container">
          <div class="token" id="resetToken">${resetToken}</div>
          <button class="copy-button" onclick="copyToken()">
            Copy Token
          </button>
        </div>

        <div class="message">
          <p>For your security:</p>
          <ul>
            <li>This token will expire in one hour</li>
            <li>Use this token to reset your password on our website</li>
            <li>Never share this token with anyone</li>
          </ul>
        </div>

        <div class="warning">
          If you didn't request this password reset, please ignore this email or contact our support team if you have concerns.
        </div>

        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>

      <script>
        function copyToken() {
          const tokenText = document.getElementById('resetToken').textContent;
          navigator.clipboard.writeText(tokenText).then(() => {
            const button = document.querySelector('.copy-button');
            button.textContent = 'Copied!';
            setTimeout(() => {
              button.textContent = 'Copy Token';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy:', err);
          });
        }
      </script>
    </body>
    </html>
  `;
}




export function welcomeTemplate(userName: string): string {
  return `
      <h1>Welcome to Fantasize, ${userName}!</h1>
      <p>Thank you for joining our community of dreamers and adventurers.</p>
    `;
}
