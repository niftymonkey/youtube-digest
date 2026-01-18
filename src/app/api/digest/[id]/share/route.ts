import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { toggleDigestSharing } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await withAuth();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Digest ID is required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { isShared, title } = body;

    if (typeof isShared !== "boolean") {
      return NextResponse.json(
        { error: "isShared must be a boolean" },
        { status: 400 }
      );
    }

    const result = await toggleDigestSharing(user.id, id, isShared, title);

    if (!result) {
      return NextResponse.json({ error: "Digest not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[SHARE DIGEST] Error:", error);
    return NextResponse.json({ error: "Failed to update sharing" }, { status: 500 });
  }
}
