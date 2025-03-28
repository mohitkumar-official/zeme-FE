import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  try {
    console.log('Verifying token with client ID:', process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    console.log('Token verification successful');
    const payload = ticket.getPayload();
    console.log('Token payload:', payload);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
}; 