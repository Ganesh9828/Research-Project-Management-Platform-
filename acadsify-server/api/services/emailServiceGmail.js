import { google } from 'googleapis';
import { OAuth2 } from 'google-auth-library';
import { Base64 } from 'js-base64';

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * Creates a MIME email message.
 * @param {string} to Recipient email address
 * @param {string} from Sender email address
 * @param {string} subject Email subject
 * @param {string} text Plain text body
 * @param {string} html HTML body
 * @returns {string} Base64url encoded MIME message
 */
function createMimeMessage({ to, from, subject, text, html }) {
  const boundary = "__boundary__";

  let mimeParts = [];
  mimeParts.push(`Content-Type: multipart/alternative; boundary=${boundary}`);
  mimeParts.push(`MIME-Version: 1.0`);
  mimeParts.push(`to: ${to}`);
  mimeParts.push(`from: ${from}`);
  mimeParts.push(`subject: ${subject}`);
  mimeParts.push('');
  mimeParts.push(`--${boundary}`);
  mimeParts.push(`Content-Type: text/plain; charset="UTF-8"`);
  mimeParts.push('');
  mimeParts.push(text);
  mimeParts.push(`--${boundary}`);
  mimeParts.push(`Content-Type: text/html; charset="UTF-8"`);
  mimeParts.push('');
  mimeParts.push(html);
  mimeParts.push(`--${boundary}--`);

  const mimeMessage = mimeParts.join('\r\n');

  // Base64url encode the message
  return Base64.encodeURI(mimeMessage);
}

/**
 * Sends an email using Gmail API.
 * @param {Object} param0
 * @param {string} param0.to Recipient email address
 * @param {string} param0.subject Email subject
 * @param {string} param0.text Plain text body
 * @param {string} param0.html HTML body
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    const from = process.env.SMTP_USER || 'me';

    const raw = createMimeMessage({ to, from, subject, text, html });

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
      },
    });

    console.log('Email sent:', res.data.id);
    return res.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
