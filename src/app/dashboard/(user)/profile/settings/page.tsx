import RouteHeading from "@/components/route-heading";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Analytics } from "../analytics/_components/analytics";
import EditProfileForm from "../_components/edit-profile-form";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;
  const articles = await prisma.article.findMany({
    include: { category: true, bookmark: true },
  });

  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      user_info: {
        select: {
          birthdate: true,
          phoneNumber: true,
          address: {
            select: { city: true, country: true, street: true, zip: true },
          },
          bookmark: { select: { article: { select: { category: true } } } },
        },
      },
      author: true,
      accounts: { select: { password: true } },
    },
  });

  const map = new Map();
  userInfo?.user_info?.bookmark.forEach((bookmark) => {
    bookmark.article.category.forEach((cat) => {
      const count = map.get(cat.name) || 0;
      map.set(cat.name, count + 1);
    });
  });

  const data = Array.from(map, ([category, bookmarks]) => ({
    category,
    bookmarks,
  }));

  if (!userInfo) {
    notFound();
  }

  return (
    <div suppressContentEditableWarning suppressHydrationWarning>
      <RouteHeading label="User settings" />
      <div className="">
        <div className="pt-4">
          <EditProfileForm user={userInfo} />
        </div>
      </div>
    </div>
  );
}
