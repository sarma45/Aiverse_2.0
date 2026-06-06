import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import { NextResponse } from "next/server";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return user;
}

export async function requireAdmin(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  return user;
}
