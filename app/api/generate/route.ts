// app/api/generate/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateDocumentation, PLAN_LIMITS } from "@/lib/claude";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, language, docType } = await req.json();

  if (!code?.trim()) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  // Get user with subscription and usage
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      _count: {
        select: {
          usageLogs: {
            where: {
              createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              },
            },
          },
        },
      },
    },
  });

  const plan = user?.subscription?.plan ?? "FREE";
  const limit = PLAN_LIMITS[plan];
  const docsThisMonth = user?._count.usageLogs ?? 0;

  if (limit !== 999999 && docsThisMonth >= limit) {
    return NextResponse.json(
      { error: `Monthly limit of ${limit} docs reached. Please upgrade.` },
      { status: 429 }
    );
  }

  try {
    const { documentation, tokensUsed } = await generateDocumentation(
      code,
      language ?? "typescript",
      docType ?? "full"
    );

    // Save usage log and document
    await db.$transaction([
      db.usageLog.create({
        data: {
          userId: session.user.id,
          type: "doc_generation",
          tokens: tokensUsed,
        },
      }),
      db.document.create({
        data: {
          userId: session.user.id,
          title: `${language} · ${new Date().toLocaleDateString()}`,
          language: language ?? "typescript",
          inputCode: code,
          outputDoc: documentation,
        },
      }),
    ]);

    return NextResponse.json({ documentation });
  } catch (err: any) {
    console.error("Generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate documentation. Please try again." },
      { status: 500 }
    );
  }
}
