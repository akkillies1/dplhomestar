import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, location, message }: ContactEmailRequest = await req.json();

    // Validate inputs
    if (!name || !email || !phone || !location || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get required configuration from Edge Function secrets
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    const BREVO_SENDER_EMAIL = Deno.env.get("BREVO_SENDER_EMAIL");
    const CONTACT_FORM_RECIPIENT = Deno.env.get("CONTACT_FORM_RECIPIENT");
    const COMPANY_NAME = Deno.env.get("COMPANY_NAME") || "The DCode";

    // Validate required secrets are configured
    if (!BREVO_API_KEY) {
      console.error("BREVO_API_KEY is not configured in Edge Function secrets");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!BREVO_SENDER_EMAIL) {
      console.error("BREVO_SENDER_EMAIL is not configured in Edge Function secrets");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!CONTACT_FORM_RECIPIENT) {
      console.error("CONTACT_FORM_RECIPIENT is not configured in Edge Function secrets");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email using Brevo API
    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: COMPANY_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          { email: CONTACT_FORM_RECIPIENT, name: COMPANY_NAME }
        ],
        replyTo: {
          email: email,
          name: name,
        },
        subject: `New Project Inquiry from ${name}`,
        textContent: `New Project Inquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\n\nMessage:\n${message}\n\n---\nReply directly to this email to respond to ${name} at ${email}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #0E0E0E; margin-bottom: 20px; border-bottom: 2px solid #D4B483; padding-bottom: 10px;">New Project Inquiry</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #0E0E0E;">Name:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${name}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #0E0E0E;">Email:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${email}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #0E0E0E;">Phone:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${phone}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #0E0E0E;">Location:</strong>
                <p style="color: #666; margin: 5px 0 0 0;">${location}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #0E0E0E;">Message:</strong>
                <p style="color: #666; margin: 5px 0 0 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
              
              <p style="color: #999; font-size: 12px; margin: 0;">
                Reply directly to this email to respond to ${name} at ${email}
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>${COMPANY_NAME} - Elevate, Don't Excess.</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Error from Brevo API:", JSON.stringify(data, null, 2));
      console.error("Response status:", emailResponse.status);
      throw new Error(data.message || "Failed to send email");
    }

    // Log detailed response for debugging
    console.log("=== EMAIL SEND ATTEMPT ===");
    console.log("Brevo API Response:", JSON.stringify(data, null, 2));
    console.log("Email configuration:", {
      sender: BREVO_SENDER_EMAIL,
      recipient: CONTACT_FORM_RECIPIENT,
      messageId: data.messageId,
      responseStatus: emailResponse.status,
    });
    console.log("=== END EMAIL LOG ===");

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: data.messageId,
      debug: {
        sender: BREVO_SENDER_EMAIL,
        recipient: CONTACT_FORM_RECIPIENT,
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-brevo-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
