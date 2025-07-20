import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, name, amount, txnId, date } = await req.json();
    if (!email || !amount || !txnId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your WasteX Payment Receipt',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; background: #f5f7fa; padding: 32px 0;">
          <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(34,197,94,0.08); overflow: hidden;">
            <div style="background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%); padding: 24px 0; text-align: center;">
              <img src="https://i.imgur.com/4M34hi2.png" alt="WasteX Logo" style="height: 48px; margin-bottom: 8px;" />
              <h2 style="color: #fff; margin: 0; font-size: 1.5rem; font-weight: 600;">Thank you for your donation!</h2>
            </div>
            <div style="padding: 32px 24px 24px 24px;">
              <p style="font-size: 1.1rem; color: #222; margin-bottom: 16px;">Hi${name ? ' ' + name : ''},</p>
              <p style="color: #444; margin-bottom: 24px;">We have received your payment. Here is your official receipt:</p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px 18px; margin-bottom: 24px;">
                <table style="width: 100%; font-size: 1rem; color: #166534;">
                  <tr>
                    <td style="padding: 6px 0;">Amount:</td>
                    <td style="font-weight: 600; text-align: right;">₹${amount}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">Transaction ID:</td>
                    <td style="font-family: monospace; text-align: right;">${txnId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">Date:</td>
                    <td style="text-align: right;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0;">Status:</td>
                    <td style="color: #16a34a; font-weight: 500; text-align: right;">Completed</td>
                  </tr>
                </table>
              </div>
              <p style="color: #444; margin-bottom: 16px;">If you have any questions, simply reply to this email. We appreciate your support in making cities cleaner and greener!</p>
              <div style="margin-top: 32px; text-align: center;">
                <span style="display: inline-block; background: #22c55e; color: #fff; font-weight: 500; padding: 8px 24px; border-radius: 8px; font-size: 1rem; letter-spacing: 1px;">WasteX</span>
                <div style="margin-top: 12px; color: #888; font-size: 0.95rem;">&copy; ${new Date().getFullYear()} WasteX. All rights reserved.</div>
              </div>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
} 