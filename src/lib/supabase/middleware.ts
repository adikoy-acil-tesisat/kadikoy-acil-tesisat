import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes("your_supabase");
}

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase yapılandırılmamışsa kimlik doğrulaması yapılamaz.
  // Geliştirme ortamında panele bakabilmek için serbest bırakıyoruz;
  // production'da ASLA serbest bırakmıyoruz, yoksa admin paneli herkese açılır.
  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseKey)) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin paneli yapılandırılmamış.", { status: 503 });
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin sayfalarına erişim kontrolü
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname === "/admin/giris") {
      if (user) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return supabaseResponse;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/admin/giris", request.url));
    }
  }

  return supabaseResponse;
}
