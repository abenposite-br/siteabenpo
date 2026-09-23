import { GraduationCap } from "lucide-react";

const cursos = [
  {
    id: 1,
    title: "Especialização Lato Sensu",
    description:
      "Carga horária mínima: 360 horas/aula, incluindo atividades práticas presenciais. Formação destinada ao aprofundamento técnico-científico em Enfermagem em Podiatria Clínica.",
  },
  {
    id: 2,
    title: "Universidade do Estado do Rio de Janeiro (UERJ)",
    description:
      "Especialização em Enfermagem em Podiatria Clínica oferecida pela Universidade do Estado do Rio de Janeiro (UERJ), reconhecida pela excelência na formação de profissionais especializados.",
  },
  {
    id: 3,
    title: "Universidade do Estado do Amazonas (UEA)",
    description:
      "Curso de Especialização em Enfermagem em Podiatria Clínica oferecido pela Universidade do Estado do Amazonas (UEA), com foco na qualificação avançada e na prática clínica.",
  },
  {
    id: 4,
    title: "Curso de Habilitação",
    description:
      "Cursos de Habilitação em Enfermagem em Podiatria Clínica, com carga horária mínima de 180 horas/aula e atividades práticas presenciais, voltados ao desenvolvimento de competências específicas para a atuação profissional.",
  },
];

export function CursosSection() {
  return (
    <section id="cursos" className="section-spacing section-alt relative overflow-hidden">
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blobs__blob -top-32 left-[8%] h-96 w-96 bg-emerald-200/40" />
        <div className="bg-blobs__blob -bottom-40 right-[10%] h-80 w-80 bg-teal-100/60" />
        <div className="bg-blobs__blob top-1/3 right-1/3 h-64 w-[32rem] bg-emerald-50/60" />
      </div>

      <div className="section-container relative">
        <div className="section-header">
          <p className="section-eyebrow">Formação</p>
          <span className="section-divider section-divider--center" />
          <h2 className="section-title">Cursos e Especializações</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-14">
          {cursos.map((curso, index) => (
            <article
              key={curso.id}
              className="card-institutional p-8 opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="card-institutional__glow" />
              <div className="relative">
                <div className="icon-box icon-box--size-14 mb-6">
                  <GraduationCap className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {curso.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  {curso.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
