"use client";

import { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import LogoImg from "@/img/logo.jpeg";
import {
  LogOut,
  CreditCard,
  BookOpen,
  Video,
  GraduationCap,
  Sparkles,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof CreditCard;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/area-associado/dashboard", label: "Carteirinha", icon: CreditCard },
  {
    href: "/area-associado/dashboard/artigos",
    label: "Artigos",
    icon: BookOpen,
  },
  { href: "/area-associado/dashboard/videos", label: "Vídeos", icon: Video },
  {
    href: "/area-associado/dashboard/treinamentos",
    label: "Treinamentos",
    icon: GraduationCap,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const raw = localStorage.getItem("abenpo-associado-login");
    if (!raw) {
      router.replace("/area-associado/login");
      return;
    }
    let parsed: typeof user = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      router.replace("/area-associado/login");
      return;
    }
    if (!cancelled) {
      setUser(parsed);
      setReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("abenpo-associado-login");
    router.push("/area-associado/login");
  };

  if (!ready || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-500">
        Carregando...
      </div>
    );
  }

  const isActive = (href: string) => {
    if (href === "/area-associado/dashboard") {
      return pathname === "/area-associado/dashboard";
    }
    return pathname.startsWith(href);
  };

  const firstName =
    user.name.split(" ").filter(Boolean)[0] ?? "Associado";

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-zinc-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/area-associado/dashboard"
                className="flex items-center gap-2.5"
              >
                <Image
                  src={LogoImg}
                  alt="Logo ABENPO"
                  sizes="36px"
                  className="w-9 h-auto rounded-xl bg-white p-1 ring-1 ring-emerald-100 shadow-sm"
                />
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-base font-bold tracking-tight text-zinc-950">
                    ABENPO
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-800/80">
                    Área do Associado
                  </span>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-3.5 py-1.5 rounded-2xl ring-1 ring-emerald-100">
              <Sparkles className="size-4 text-emerald-600" />
              <span className="text-sm text-zinc-700">
                Olá,{" "}
                <span className="font-bold text-zinc-900">{firstName}</span>!
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-red-600 hover:border-red-200 transition-colors shrink-0"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        <aside className="lg:w-64 lg:shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-zinc-100 p-4 sm:p-5 lg:p-6 lg:sticky lg:top-16 lg:self-start lg:min-h-[calc(100vh-4rem)]">
          <div className="lg:hidden md:hidden mb-3 px-1 flex items-center gap-2 text-sm text-zinc-700">
            <Sparkles className="size-4 text-emerald-600 shrink-0" />
            Olá, <span className="font-bold text-zinc-900">{firstName}</span>
          </div>
          <nav className="flex gap-2 lg:flex-col overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="size-4.5 shrink-0" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
