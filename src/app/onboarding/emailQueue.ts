// emailQueue.ts

import nodemailer from 'nodemailer';

export const sendVerificationEmailBackground = async (userEmail: string, verificationToken: string) => {
  // Instead of sending the email immediately, you can use a task queue here to handle it later.
  // Below is just the simplified version for direct use.

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Email Verification',
    html: `<h1>Click <a href="${verificationUrl}">here</a> to verify your email address.</h1>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent in background');
  } catch (error) {
    console.error('Error sending email in background:', error);
    throw new Error('Failed to send verification email.');
  }
};
