import { Resend } from "resend";

/**
 * Add to your .env.local:
 *   RESEND_API_KEY=your-resend-api-key
 */
export const resend = new Resend(process.env.RESEND_API_KEY);
