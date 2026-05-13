// lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `${prompts[docType]}

\`\`\`${language}
${code}
\`\`\``,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const tokensUsed =
    message.usage.input_tokens + message.usage.output_tokens;

  return { documentation: text, tokensUsed };
}

export const PLAN_LIMITS: Record<string, number> = {
  FREE: 5,
  SOLO: 50,
  TEAM: 999999,
  ENTERPRISE: 999999,
};
