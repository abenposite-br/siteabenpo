import Image from "next/image";
import Link from "next/link";
import LogoImg from "@/img/logo.jpeg";
import { LEAD_RECIPIENT_EMAIL } from "@/lib/constants";
import { Mail, ArrowUpRight } from "lucide-react";

const navigationLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Eventos", href: "#eventos" },
  { label: "Fotos", href: "#galeria" },
];

const associadosLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Se associar", href: "#associar" },
  { label: "Galeria", href: "#galeria" },
];

const institucionalLinks = [
  { label: "Diretoria", href: "#diretoria" },
  { label: "Contato", href: "#associar" },
  { label: "Nossa história", href: "#sobre" },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="inline-flex items-center gap-1 text-[0.9375rem] leading-relaxed text-emerald-100/80 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white">
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blobs__blob -left-24 top-0 h-72 w-72 bg-emerald-500/10" />
        <div className="bg-blobs__blob -right-16 bottom-0 h-64 w-64 bg-teal-400/10" />
      </div>

      <div className="section-container relative">
        <div className="border-b border-white/10 py-14 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Link
                href="/"
                className="inline-flex items-center gap-3 transition-opacity duration-300 hover:opacity-90"
              >
                <Image
                  src={LogoImg}
                  alt="Logo ABENPO"
                  sizes="40px"
                  className="h-10 w-auto rounded-xl bg-white p-1 ring-1 ring-white/20"
                />
                <div>
                  <span className="block text-base font-bold tracking-tight">
                    ABENPO
                  </span>
                  <span className="block text-xs text-emerald-100/70">
                    Enfermagem em Podiatria Clínica
                  </span>
                </div>
              </Link>

              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-emerald-100/85">
                Associação Brasileira de Enfermagem em Podiatria Clínica —
                representando enfermeiros especialistas e habilitados em todo o
                Brasil desde 2020.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={`mailto:${LEAD_RECIPIENT_EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-emerald-50 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <Mail className="size-4 text-emerald-300" aria-hidden="true" />
                  {LEAD_RECIPIENT_EMAIL}
                </a>

                <a
                  href="https://www.instagram.com/abenpo.oficial?igsh=aGRtM2dyYXIwenhi&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-emerald-50 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  <svg
                    className="size-4 text-emerald-300"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @abenpo.oficial
                </a>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
              <FooterLinkGroup title="Navegação" links={navigationLinks} />
              <FooterLinkGroup title="Associados" links={associadosLinks} />
              <FooterLinkGroup
                title="Institucional"
                links={institucionalLinks}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-emerald-100/70">
            © {year} ABENPO. Todos os direitos reservados.
          </p>

          <Link
            href="#associar"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 transition-colors duration-300 hover:text-white"
          >
            Quero me associar
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
