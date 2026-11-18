// lib/claude.ts
export type DocGenerationResult = {
  documentation: string;
  tokensUsed: number;
};

const DOC_TYPES = ["readme", "inline", "api", "full"] as const;
export type DocType = (typeof DOC_TYPES)[number];

export async function generateDocumentation(
  code: string,
  language: string,
  docType: DocType = "full"
): Promise<DocGenerationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Documentation generation is not configured. Please contact support.");
  }

  const prompts: Record<DocType, string> = {
    readme: `Generate a comprehensive README.md for this ${language} code. Include a project overview, installation steps only when they can be inferred, usage examples grounded in the code, and configuration options. Clearly mark unknown details rather than inventing them.`,
    inline: `Add useful inline comments and language-appropriate documentation annotations to this ${language} code. Preserve behavior and syntax. Return the complete annotated source code.`,
    api: `Generate an API reference for this ${language} code. Document public functions, classes, parameters, return values, exceptions where evident, and grounded usage examples. Do not invent APIs.`,
    full: `You are an expert technical writer. Analyze this ${language} source code and produce a structured document containing a README, API reference, and an annotated-code section. Ground every technical claim in the supplied code and clearly label anything that cannot be determined.`,
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `${prompts[docType]}\n\n\`\`\`${language}\n${code}\n\`\`\``,
      }],
      max_tokens: 4096,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Groq generation failed:", response.status, error?.error?.message);
    throw new Error(response.status === 429
      ? "The AI service is busy. Please try again shortly."
      : "The AI service could not generate documentation. Please try again.");
  }

  const data = await response.json();
  const documentation = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!documentation) throw new Error("The AI service returned an empty result.");

  return {
    documentation,
    tokensUsed: Number(data.usage?.total_tokens ?? 0),
  };
}

export const PLAN_LIMITS: Record<string, number> = {
  FREE: 5,
  SOLO: 50,
  TEAM: 999999,
  ENTERPRISE: 999999,
};
