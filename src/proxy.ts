import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16'da `middleware` konvansiyonu deprecate edildi, yerini `proxy` aldı.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
