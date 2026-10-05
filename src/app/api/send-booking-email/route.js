import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const SERVICE_LABELS = {
  "website-saas": "Website & SaaS",
  automation: "AI Automation",
  "paid-ad": "Paid Ads",
  other: "Something else",
};

function serviceLabel(value) {
  return SERVICE_LABELS[value] || value;
}

function bookingConfirmationEmailHtml({
  name,
  service,
  preferredDate,
  preferredTime,
}) {
  const firstName = (name || "there").trim().split(" ")[0];

  return `
  <div style="background-color:#f4f4f7; padding:40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(107, 70, 193, 0.1);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg, #120A28 0%, #4C3A9E 100%); padding:40px 32px; text-align:center;">
        <p style="margin:0; color:#ffffff; font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; opacity:0.9;">
          HIGH-ER ENTERPRISES
        </p>
        <h1 style="margin:12px 0 0; color:#ffffff; font-size:26px; font-weight:800; letter-spacing:-0.5px;">
          Booking Received, ${firstName}
        </h1>
      </div>

      <!-- Body -->
      <div style="padding:36px 32px 8px;">
        <p style="margin:0 0 16px; color:#1f2937; font-size:15px; line-height:1.6;">
          Thank you for reaching out. We've received your request and will get back to you shortly to confirm the time.
        </p>

        <p style="margin:0 0 20px; color:#1f2937; font-size:15px; line-height:1.6;">
          Here's a quick summary of what you submitted:
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:12px 0; border-bottom:1px solid #e5e7eb;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#FF8C38; margin-right:12px;"></span>
              <span style="color:#1f2937; font-size:14px; font-weight:600;">Service: ${service ? serviceLabel(service) : "Not specified"}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0; border-bottom:1px solid #e5e7eb;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#6B46C1; margin-right:12px;"></span>
              <span style="color:#1f2937; font-size:14px; font-weight:600;">Preferred Date: ${preferredDate || "Flexible"}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#FF8C38; margin-right:12px;"></span>
              <span style="color:#1f2937; font-size:14px; font-weight:600;">Preferred Time: ${preferredTime || "Flexible"}</span>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 28px; color:#4b5563; font-size:14px; line-height:1.6;">
          We'll review your request and respond as soon as possible.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:24px 32px; text-align:center; border-top:1px solid #e5e7eb;">
        <p style="margin:0; color:#6b7280; font-size:12px; font-weight:500;">
          HIGH-ER ENTERPRISES · Website & SaaS · Ai Automation · Paid Ads.
        </p>
        <p style="margin:6px 0 0; color:#9ca3af; font-size:11px;">
          You're receiving this because you submitted a booking request.
        </p>
      </div>

    </div>
  </div>`;
}

function bookingNotificationEmailHtml({
  name,
  email,
  phone,
  service,
  preferredDate,
  preferredTime,
  message,
}) {
  return `
  <div style="background-color:#f4f4f7; padding:40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(107, 70, 193, 0.1);">

      <div style="background:linear-gradient(135deg, #120A28 0%, #4C3A9E 100%); padding:36px 32px; text-align:center;">
        <p style="margin:0; color:#ffffff; font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; opacity:0.9;">
          New Booking
        </p>
        <h1 style="margin:10px 0 0; color:#ffffff; font-size:24px; font-weight:800;">
          ${name}
        </h1>
      </div>

      <div style="padding:32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280; font-size:13px;">Email</span><br/>
              <span style="color:#111827; font-size:15px; font-weight:600;">${email}</span>
            </td>
          </tr>
          ${
            phone
              ? `<tr>
            <td style="padding:10px 0; border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280; font-size:13px;">Phone</span><br/>
              <span style="color:#111827; font-size:15px; font-weight:600;">${phone}</span>
            </td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280; font-size:13px;">Service</span><br/>
              <span style="color:#111827; font-size:15px; font-weight:600;">${serviceLabel(service)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid #e5e7eb;">
              <span style="color:#6b7280; font-size:13px;">Preferred Date & Time</span><br/>
              <span style="color:#111827; font-size:15px; font-weight:600;">
                ${preferredDate || "Not specified"} ${preferredTime ? `• ${preferredTime}` : ""}
              </span>
            </td>
          </tr>
          ${
            message
              ? `<tr>
            <td style="padding:10px 0;">
              <span style="color:#6b7280; font-size:13px;">Message</span><br/>
              <span style="color:#111827; font-size:15px; line-height:1.5;">${message}</span>
            </td>
          </tr>`
              : ""
          }
        </table>
      </div>

      <div style="background:#f9fafb; padding:20px 32px; text-align:center; border-top:1px solid #e5e7eb;">
        <p style="margin:0; color:#6b7280; font-size:12px;">
          HIGH-ER ENTERPRISES · Booking Notification
        </p>
      </div>

    </div>
  </div>`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      service,
      preferredDate,
      preferredTime,
      message,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    console.log(
      "Resend key present:",
      !!process.env.RESEND_API_KEY,
      process.env.RESEND_API_KEY?.slice(0, 6),
    );

    // 1. Confirmation to the person
    const { error: confirmError } = await resend.emails.send({
      from: "HIGH-ER ENTERPRISES <info@higherenterprises.co.uk>",
      to: email,
      subject: "We received your booking request",
      html: bookingConfirmationEmailHtml({
        name,
        service,
        preferredDate,
        preferredTime,
      }),
    });

    if (confirmError) {
      console.error("Resend confirmation email error:", confirmError);
      throw new Error(
        confirmError.message || "Failed to send confirmation email",
      );
    }

    // 2. Notification to you
    const { error: notifyError } = await resend.emails.send({
      from: "HIGH-ER ENTERPRISES <info@higherenterprises.co.uk>",
      to: "info@higherenterprises.co.uk",
      subject: `New Booking from ${name}`,
      html: bookingNotificationEmailHtml({
        name,
        email,
        phone,
        service,
        preferredDate,
        preferredTime,
        message,
      }),
    });

    if (notifyError) {
      console.error("Resend notification email error:", notifyError);
      throw new Error(
        notifyError.message || "Failed to send notification email",
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 },
    );
  }
}
