// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      documents: { orderBy: { createdAt: "desc" }, take: 10 },
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
  const docsThisMonth = user?._count.usageLogs ?? 0;

  return (
    <DashboardClient
      user={{
        name: session.user.name ?? "Developer",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }}
      plan={plan}
      docsThisMonth={docsThisMonth}
      recentDocs={user?.documents ?? []}
    />
  );
}
