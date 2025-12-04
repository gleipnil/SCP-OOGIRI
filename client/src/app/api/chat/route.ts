import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const google = createGoogleGenerativeAI({
    // custom settings if needed
});

export async function POST(req: Request) {
    const { messages, reportContent } = await req.json();
    const contentStr = typeof reportContent === 'string' ? reportContent : JSON.stringify(reportContent);

    const systemPrompt = `
You are a cold, emotionless Game Master (GM) for the SCP Foundation.
The player is a D-Class personnel (disposable test subject) sent to explore or experiment on an SCP object.
Your goal is to guide the player through a text-based adventure based on the provided SCP Report.

**CONTEXT:**
The player is interacting with the following SCP Object:
${contentStr}

**RULES:**
1. **Persona**: You are the Foundation. You are cold, clinical, and objective. Do not break character. Do not be helpful unless it serves the experiment.
2. **Description**: Focus on sensory details (sight, sound, smell, touch). Make it eerie, unsettling, and clinical. Use the style of SCP logs.
3. **Unknown Nature**: Do NOT reveal the "true nature" or the specific anomaly details of the SCP immediately. Describe the *phenomenon* as the player perceives it. The player knows NOTHING.
4. **Consequences**:
   - If the player's actions trigger a "kill agent" or "immediate death" condition described in the report, output **[DEAD END]** at the start of your response and describe their demise vividly.
   - If the player successfully contains the object or completes the experiment goals (as implied by the report), output **[CLEAR]** at the start of your response.
5. **Turn Limit**: The experiment must end within 16 turns. If the player hasn't finished by turn 16, terminate the experiment (kill them or remove them).
6. **Safety**: This is a horror game. You are PERMITTED to describe violence, gore, and psychological horror as it pertains to the SCP universe. Do not hold back on the horror elements.

**FORMAT:**
- Keep responses concise (under 3 paragraphs).
- End each response with "What do you do?" or a similar prompt, unless it's a [DEAD END] or [CLEAR].
`;

    const result = streamText({
        model: (google as any)('gemini-2.5-flash-lite', {
            safetySettings: [
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            ]
        }),
        system: systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
