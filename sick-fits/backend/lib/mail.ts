import { createTransport, getTestMessageUrl } from "nodemailer";

const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
    <div style="
      border:1px solid black;
      padding:20px;
      font-family:sans-serif;
      line-height:2;
    ">
      <h2>Hello there!</h2>
      <p>${text}</p>
      <p>love, Owen</p>
    </div>
  `;
}

interface MailResponse {
  message: string;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transport.sendMail({
    to,
    from: "oladapo2011@gmail.com",
    subject: "Your Password Reset Token",
    html: makeANiceEmail(
      `Your password reset token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">
        Click here to reset
      </a>
    `
    ),
  })) as MailResponse;
  console.log(info);
  if (process.env.MAIL_USER.includes("ethereal.email")) {
    console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}
