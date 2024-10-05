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
        console.log(`Email sent to ${options.to}`);
        return true;
    } catch (error) {
        console.error(`Error sending email to ${options.to}:`, error);
        throw error;
        return false;
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


export function passwordResetTemplate(resetLink: string): string {
    return `
      <h1>Password Reset</h1>
      <p>You can reset your password by clicking the link below:</p>
      <a href="${resetLink}">Reset Password</a>
    `;
}
