// lib/claude.ts
export type DocGenerationResult = {
  documentation: string;
  tokensUsed: number;
};

export async function generateDocumentation(
  code: string,
  language: string,
  docType: "readme" | "inline" | "api" | "full" = "full"
): Promise<DocGenerationResult> {
  const prompts: Record<string, string> = {
    readme: `Generate a comprehensive README.md for this ${language} code. Include: project overview, installation steps, usage examples, and configuration options.`,
    inline: `Add detailed inline comments and JSDoc/docstring annotations to this ${language} code. Explain what each function, class, and complex block does. Return the fully commented code.`,
    api: `Generate API reference documentation for this ${language} code. Document all public functions, parameters, return types, and include usage examples.`,
    full: `You are an expert technical writer. Analyze this ${language} code and generate complete documentation including:

1. **README.md** — Project overview, installation, usage, configuration
2. **API Reference** — All functions/methods with parameters, types, return values, examples
3. **Inline Comments** — Annotated version of the code with JSDoc/docstrings

Format everything in clean, well-structured Markdown.`,
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${prompts[docType]}\n\n\`\`\`${language}\n${code}\n\`\`\``,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message ?? "Gemini API error");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const tokensUsed = data.usageMetadata?.totalTokenCount ?? 0;

  return { documentation: text, tokensUsed };
}

export const PLAN_LIMITS: Record<string, number> = {
  FREE: 5,
  SOLO: 50,
  TEAM: 999999,
  ENTERPRISE: 999999,
};