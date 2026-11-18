import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateDocumentation, PLAN_LIMITS, type DocType } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 90;

const LANGUAGES = new Set([
  "typescript", "javascript", "python", "php", "go", "rust", "java",
  "c++", "c#", "ruby", "swift", "kotlin", "bash", "sql", "html",
  "css", "r", "scala",
]);
const DOC_TYPES = new Set<DocType>(["full", "readme", "api", "inline"]);
const MAX_CODE_LENGTH = 100_000;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Please sign in to generate documentation." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = body as { code?: unknown; language?: unknown; docType?: unknown };
  const code = typeof input.code === "string" ? input.code : "";
  const language = typeof input.language === "string" ? input.language.toLowerCase() : "";
  const docType = typeof input.docType === "string" ? input.docType as DocType : "full";

  if (!code.trim()) {
    return NextResponse.json({ error: "Paste some source code before generating documentation." }, { status: 400 });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: "The submitted code is too large. The maximum is 100,000 characters." }, { status: 413 });
  }
  if (!LANGUAGES.has(language)) {
    return NextResponse.json({ error: "Please select a supported programming language." }, { status: 400 });
  }
  if (!DOC_TYPES.has(docType)) {
    return NextResponse.json({ error: "Please select a valid documentation format." }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

    const subscription = user.subscription;
    const plan = subscription?.status === "ACTIVE" ? subscription.plan : "FREE";
    const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.FREE;
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const used = await db.usageLog.count({
      where: { userId, type: "doc_generation", createdAt: { gte: monthStart } },
    });
    if (used >= limit) {
      return NextResponse.json({
        error: `Your ${plan} plan limit of ${limit} documents per month has been reached. Please upgrade or try again next month.`,
        usage: { used, limit, remaining: 0 },
      }, { status: 429 });
    }

    const result = await generateDocumentation(code, language, docType);
    const title = `${language.toUpperCase()} · ${docType.toUpperCase()} documentation`;

    const [document] = await db.$transaction([
      db.document.create({
        data: { userId, title, language, inputCode: code, outputDoc: result.documentation },
        select: { id: true },
      }),
      db.usageLog.create({
        data: { userId, type: "doc_generation", tokens: result.tokensUsed },
      }),
    ]);

    return NextResponse.json({
      documentation: result.documentation,
      documentId: document.id,
      usage: { used: used + 1, limit, remaining: Math.max(0, limit - used - 1) },
    });
  } catch (error) {
    console.error("Docs AI generation error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Documentation generation failed. Please try again.",
    }, { status: 502 });
  }
}
