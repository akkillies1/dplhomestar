import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on function restart)
// In production, use Redis or Supabase table for persistence
const rateLimitMap = new Map<string, { attempts: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 3;

interface PinValidationRequest {
    pin: string;
    clientIp?: string;
}

const handler = async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { pin, clientIp }: PinValidationRequest = await req.json();

        // Get client IP (use provided or extract from headers)
        const ip = clientIp || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

        // Check rate limiting
        const now = Date.now();
        const rateLimit = rateLimitMap.get(ip);

        if (rateLimit) {
            // Reset if window expired
            if (now > rateLimit.resetTime) {
                rateLimitMap.delete(ip);
            } else if (rateLimit.attempts >= MAX_ATTEMPTS) {
                console.log(`Rate limit exceeded for IP: ${ip}`);
                return new Response(
                    JSON.stringify({ valid: false }),
                    {
                        status: 200, // Return 200 to avoid revealing rate limit info
                        headers: { "Content-Type": "application/json", ...corsHeaders },
                    }
                );
            }
        }

        // Get PIN from environment
        const ADMIN_ACCESS_PIN = Deno.env.get("ADMIN_ACCESS_PIN");

        if (!ADMIN_ACCESS_PIN) {
            console.error("ADMIN_ACCESS_PIN not configured in Edge Function secrets");
            return new Response(
                JSON.stringify({ valid: false }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json", ...corsHeaders },
                }
            );
        }

        // Validate PIN
        const isValid = pin === ADMIN_ACCESS_PIN;

        // Update rate limit tracking
        if (!isValid) {
            const current = rateLimitMap.get(ip) || { attempts: 0, resetTime: now + RATE_LIMIT_WINDOW };
            rateLimitMap.set(ip, {
                attempts: current.attempts + 1,
                resetTime: current.resetTime,
            });
            console.log(`Invalid PIN attempt from IP: ${ip}, attempts: ${current.attempts + 1}`);
        } else {
            // Clear rate limit on successful validation
            rateLimitMap.delete(ip);
            console.log(`Valid PIN from IP: ${ip}`);
        }

        return new Response(
            JSON.stringify({ valid: isValid }),
            {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    } catch (error: any) {
        console.error("Error in validate-admin-pin function:", error);
        return new Response(
            JSON.stringify({ valid: false }),
            {
                status: 200, // Always return 200 to avoid info leakage
                headers: { "Content-Type": "application/json", ...corsHeaders },
            }
        );
    }
};

serve(handler);
