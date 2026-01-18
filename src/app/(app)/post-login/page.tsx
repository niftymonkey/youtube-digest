import { redirect } from "next/navigation";
import { hasDigests } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PostLoginPage() {
  const digestsExist = await hasDigests();

  if (digestsExist) {
    redirect("/digests");
  } else {
    redirect("/home");
  }
}
