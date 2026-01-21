import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from 'zod';

// Initialize Redis for Rate Limiting
// Fallback to null if not configured (development only)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// Create a new ratelimiter, that allows 10 requests per 60 seconds
const ratelimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(10, "60 s"),
        analytics: true,
    })
    : null;

const PROFILE_CONTEXT = `
NAME: Santanu Sarkar
TITLE: Business Technology Strategy & Risk Management
LOCATION: Charlotte, North Carolina Area
CONTACT: sarkar.santanu@outlook.com | 704-779-8782
LINKEDIN: www.linkedin.com/in/santanu-sarkar-20306921

SUMMARY:
Operational Excellence leader with expertise around strategy development, business process assessment, program management, and technology implementation. Skillful in conducting and motivating multidisciplinary teams towards the achievement of business goals. Outstanding track record of managing and delivering multiple project teams across geographies.

EXPERIENCE:

1. Bank of America (Charlotte, NC)
   - Senior Vice President (Feb 2021 - Present)
   - Vice President - Manager Financial Business Support (Dec 2017 - Feb 2021)
   - Role: Manage End User Computing Tools Risk by developing automated solutions to inventory, govern and manage risk.

2. Deloitte (Charlotte, NC)
   - Manager (April 2016 - Dec 2017)
   - Role: Advised Corporate Operation Risk group of a Top 4 US Bank. Helped client close regulatory concerns.
   - Activities: Policy enhancements, control testing for EUC Tools (CCAR, Reg Reporting, SOX), technology assessment for automation, developed End User Guidance documents, mentored consultant teams.

3. PwC (Charlotte, NC)
   - Senior Associate - Advisory Financial Services (Feb 2015 - Feb 2016)
   - Role: Developed playbook for large transformation program (legacy mainframe to COTs). Assessed processes, identified gaps, defined governance structure/workflows.
   - Project: Developed Requirements Management Strategy for specific Auto Financing client. Created best practices and training materials for business analysts.

4. Cognizant (Charlotte, NC)
   - Senior Manager (Feb 2008 - Feb 2015)

5. Infosys Limited
   - Programmer Analyst (Nov 2002 - Feb 2008)

EDUCATION:
- Duke University - The Fuqua School of Business: MBA in Strategy, Marketing (2013 - 2014)
- Visvesvaraya Technological University: BE, Chemical (1998 - 2002)

SKILLS:
- Product Management, Professional Services, Coaching & Mentoring, Strategy/Technology Consulting.
- Business Process Assessment and Automation, Program/Change Management.
- Strategic Planning, Marketing, Pre-Sales, Business Development.
- Offshore Development.

CERTIFICATIONS:
- Alteryx Designer Core Certified
- AI/ML in Financial Services
- Tableau Desktop Specialist
- Medallia Customer Experience Professional
`;

const SYSTEM_PROMPT = `
You are an AI Professional Assistant representing Santanu Sarkar. Your sole purpose is to answer questions about Santanu's professional career, skills, background, and experience based on the provided context.

RULES:
1. REPRESENTATION: Speak in the first person plural ("We") or third person ("Santanu", "He") as appropriate, but preferably as a helpful assistant representing him. Tone: Professional, polite, engaging, and precise.
2. SOURCE TRUTH: Use ONLY the provided context to answer questions. Do not hallucinate experiences not listed.
3. OFF-TOPIC GUARDRAIL: If the user asks about ANYTHING unrelated to Santanu's professional life (e.g., sports, politics, weather, general world knowledge, cooking, etc.), you MUST politely decline.
   - Example Refusal: "I'm sorry, but I can only answer questions related to Santanu's professional background and career. Is there anything else you'd like to know about his experience?"
   - Do not try to answer the off-topic question.
4. If you don't find the answer in the context, admit it: "I don't have that specific information in my records, but I can tell you about [related topic]..."

CONTEXT:
${PROFILE_CONTEXT}
`;

export async function POST(req: Request) {
    // 1. Rate Limit Check
    if (ratelimit) {
        const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a minute.' },
                { status: 429 }
            );
        }
    } else {
        // console.warn("WARN: Redis not configured. Rate limiting is DISABLED.");
    }

    try {
        const { messages } = await req.json();

        // Input Validation (Basic check, z used implicitly by AI SDK logic usually but good to keep explicit sanity check)
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // 2. Generate Streaming Response
        const result = streamText({
            model: openai('gpt-4o'), // Use 'gpt-4o' or appropriate model
            system: SYSTEM_PROMPT,
            messages,
            temperature: 0.7, // Slightly creative but grounded
            // 3. Non-Blocking Evaluation via onFinish callback
            onFinish: async ({ text: assistantResponse }) => {
                // --- GEMINI EVALUATION (Async Background) ---
                if (!process.env.GOOGLE_API_KEY) return;

                const lastUserMessage = messages[messages.length - 1].content;
                // Don't await this inside the main flow if we want it truly fire-and-forget, 
                // but onFinish is already after the stream is done, so it's safe to run here 
                // without delaying the visible response (client already has full text).
                // However, Vercel might kill the lambda. 
                // Best practice: Use `waitUntil` if on Vercel, or just accept that onFinish 
                // extends the lambda life slightly.

                try {
                    // console.log("Starting Background Gemini Evaluation...");
                    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                    const evalPrompt = `
              You are an Evaluator. Your task is to decide whether the Agent's response to the User is acceptable quality.
              
              CONTEXT:
              The Agent has been instructed to be professional and engaging, as if talking to a potential client or future employer.
              The Agent represents Santanu Sarkar, a Business Technology Strategy expert (Bank of America, Deloitte, PwC).
              
              USER QUESTION: "${lastUserMessage}"
              AGENT RESPONSE: "${assistantResponse}"
              
              Please evaluate the response. Reply with:
              1. VERDICT: [ACCEPTABLE / UNACCEPTABLE]
              2. REASON: [Brief explanation]
              `;

                    const evalResult = await model.generateContent(evalPrompt);
                    const response = await evalResult.response;
                    const evalText = response.text();

                    console.log("\n--- GEMINI EVALUATION (Async) ---");
                    console.log(evalText);
                    console.log("---------------------------------\n");

                    // Ideally we would send this to Sentry or a DB here
                } catch (evalError) {
                    console.error("Gemini Evaluation Failed:", evalError);
                }
            },
        });

        // Return the stream response
        return result.toDataStreamResponse();

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
