import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>('smtp');

// const transporter = nodemailer.createTransport({
//     host: smtp.host,
//     port: smtp.port,
//     secure: smtp.secure,
//     auth: {user: smtp.user, pass: smtp.pass},
// });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

async function SendEmail(payload: SendMailOptions) {
  return await transporter.sendMail(payload);
}

export default SendEmail;
