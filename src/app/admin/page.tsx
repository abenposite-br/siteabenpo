"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  AlertCircle,
  LogOut,
  Download,
  Search,
  Filter,
  Target,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Plus,
  Calendar,
  MapPin,
  ExternalLink,
  UsersRound,
  BookOpen,
  Video,
  GraduationCap,
  FileText,
  Ban,
  ShieldCheck,
} from "lucide-react";

type Lead = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  interesse: string;
  createdAt: string;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  url: string;
};

type Associate = {
  id: string;
  name: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
};

type Article = {
  id: string;
  title: string;
  url: string;
  description?: string;
  image?: string;
  createdAt: string;
};

type VideoItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
};

type Training = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  videoUrl?: string;
  createdAt: string;
};

type AdminTab =
  | "events"
  | "leads"
  | "associates"
  | "articles"
  | "videos"
  | "trainings";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const [activeTab, setActiveTab] = useState<AdminTab>("leads");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(true);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    date: "",
    location: "",
    url: "",
  });

  const [associates, setAssociates] = useState<Associate[]>([]);
  const [associatesLoading, setAssociatesLoading] = useState(true);
  const [assocBusca, setAssocBusca] = useState("");
  const [assocStatusFilter, setAssocStatusFilter] = useState<
    "todos" | "ativos" | "inativos"
  >("todos");

  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articleFormData, setArticleFormData] = useState({
    title: "",
    url: "",
  });

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoFormData, setVideoFormData] = useState({
    title: "",
    description: "",
    url: "",
  });

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [trainingsLoading, setTrainingsLoading] = useState(true);
  const [trainingFormData, setTrainingFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    videoUrl: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [busca, setBusca] = useState("");
  const [filtroInteresse, setFiltroInteresse] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<
    "mais-recentes" | "mais-antigos" | "nome"
  >("mais-recentes");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("abenpo-admin-login");
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
      fetchEvents();
      fetchAssociates();
      fetchArticles();
      fetchVideos();
      fetchTrainings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const showMessage = (
    type: "success" | "error",
    text: string,
    duration = 4000,
  ) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === "abenpo" && loginData.password === "abenpo@1212") {
      localStorage.setItem("abenpo-admin-login", "true");
      setIsLoggedIn(true);
    } else {
      showMessage("error", "Usuário ou senha incorretos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("abenpo-admin-login");
    setIsLoggedIn(false);
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error("Erro ao carregar leads:", error);
      showMessage("error", "Erro ao carregar interesses");
    } finally {
      setLeadsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      showMessage("error", "Erro ao carregar eventos");
    } finally {
      setEventsLoading(false);
    }
  };

  const fetchAssociates = async () => {
    setAssociatesLoading(true);
    try {
      const res = await fetch("/api/associates");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setAssociates(
        data.map((a: Associate) => ({
          id: a.id,
          name: a.name ?? "",
          phone: a.phone ?? "",
          email: a.email ?? "",
          active: typeof a.active === "boolean" ? a.active : true,
          createdAt: a.createdAt ?? new Date().toISOString(),
        })),
      );
    } catch (error) {
      console.error("Erro ao carregar associados:", error);
      showMessage("error", "Erro ao carregar associados");
    } finally {
      setAssociatesLoading(false);
    }
  };

  const fetchArticles = async () => {
    setArticlesLoading(true);
    try {
      const res = await fetch("/api/articles");
      if (!res.ok) throw new Error();
      setArticles(await res.json());
    } catch (error) {
      console.error("Erro ao carregar artigos:", error);
      showMessage("error", "Erro ao carregar artigos");
    } finally {
      setArticlesLoading(false);
    }
  };

  const fetchVideos = async () => {
    setVideosLoading(true);
    try {
      const res = await fetch("/api/videos");
      if (!res.ok) throw new Error();
      setVideos(await res.json());
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      showMessage("error", "Erro ao carregar vídeos");
    } finally {
      setVideosLoading(false);
    }
  };

  const fetchTrainings = async () => {
    setTrainingsLoading(true);
    try {
      const res = await fetch("/api/trainings");
      if (!res.ok) throw new Error();
      setTrainings(await res.json());
    } catch (error) {
      console.error("Erro ao carregar treinamentos:", error);
      showMessage("error", "Erro ao carregar treinamentos");
    } finally {
      setTrainingsLoading(false);
    }
  };

  const handleLeadDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este interesse?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      showMessage("success", "Interesse excluído com sucesso!", 3000);
      fetchLeads();
    } catch {
      showMessage("error", "Erro ao excluir interesse");
    }
  };

  const interessesDisponiveis = useMemo(() => {
    const set = new Set(leads.map((l) => l.interesse).filter(Boolean));
    return Array.from(set).sort();
  }, [leads]);

  const leadsFiltrados = useMemo(() => {
    let lista = [...leads];

    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      lista = lista.filter(
        (l) =>
          l.nome.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.whatsapp.toLowerCase().includes(q) ||
          l.interesse.toLowerCase().includes(q),
      );
    }

    if (filtroInteresse !== "todos") {
      lista = lista.filter((l) => l.interesse === filtroInteresse);
    }

    switch (ordenacao) {
      case "mais-recentes":
        lista.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "mais-antigos":
        lista.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "nome":
        lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        break;
    }

    return lista;
  }, [leads, busca, filtroInteresse, ordenacao]);

  const estatisticas = useMemo(() => {
    const total = leads.length;
    const porInteresse = interessesDisponiveis.map((interesse) => ({
      interesse,
      total: leads.filter((l) => l.interesse === interesse).length,
    }));
    porInteresse.sort((a, b) => b.total - a.total);
    return { total, porInteresse };
  }, [leads, interessesDisponiveis]);

  const estatisticasAssociados = useMemo(() => {
    const total = associates.length;
    const ativos = associates.filter((a) => a.active).length;
    const inativos = total - ativos;
    return { total, ativos, inativos };
  }, [associates]);

  const associatesFiltrados = useMemo(() => {
    let lista = [...associates];
    if (assocStatusFilter === "ativos") lista = lista.filter((a) => a.active);
    if (assocStatusFilter === "inativos")
      lista = lista.filter((a) => !a.active);
    if (assocBusca.trim()) {
      const q = assocBusca.trim().toLowerCase();
      lista = lista.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q),
      );
    }
    lista.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return lista;
  }, [associates, assocBusca, assocStatusFilter]);

  const exportLeadsCSV = () => {
    if (leadsFiltrados.length === 0) return;
    const header = ["Nome", "E-mail", "WhatsApp", "Interesse", "Data/Hora"];
    const rows = leadsFiltrados.map((l) => [
      `"${l.nome.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${(l.whatsapp || "").replace(/"/g, '""')}"`,
      `"${l.interesse.replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleString("pt-BR")}"`,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interesses-abenpo-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title || !eventFormData.date || !eventFormData.location) {
      showMessage("error", "Preencha título, data e local do evento.");
      return;
    }
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventFormData),
      });
      if (!res.ok) throw new Error("Failed to create");
      showMessage("success", "Evento criado com sucesso!", 3000);
      setEventFormData({ title: "", date: "", location: "", url: "" });
      fetchEvents();
    } catch {
      showMessage("error", "Erro ao criar evento");
    }
  };

  const handleEventDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      showMessage("success", "Evento excluído com sucesso!", 3000);
      fetchEvents();
    } catch {
      showMessage("error", "Erro ao excluir evento");
    }
  };

  const handleToggleAssociateActive = async (
    id: string,
    current: boolean,
    name: string,
  ) => {
    const action = current ? "desativar" : "ativar";
    if (
      !confirm(
        `Tem certeza que deseja ${action} o associado "${name}"?${
          current
            ? " Ele NÃO poderá mais acessar a área do associado."
            : " Ele voltará a ter acesso normal."
        }`,
      )
    )
      return;
    try {
      const res = await fetch(`/api/associates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !current }),
      });
      if (!res.ok) throw new Error("Failed");
      setAssociates((list) =>
        list.map((a) => (a.id === id ? { ...a, active: !current } : a)),
      );
      showMessage(
        "success",
        `Associado ${current ? "desativado" : "ativado"} com sucesso!`,
        3000,
      );
    } catch {
      showMessage("error", "Erro ao atualizar status do associado");
    }
  };

  const handleAssociateDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o associado "${name}"?`))
      return;
    try {
      const res = await fetch(`/api/associates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Associado excluído com sucesso!", 3000);
      fetchAssociates();
    } catch {
      showMessage("error", "Erro ao excluir associado");
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleFormData.title || !articleFormData.url) {
      showMessage("error", "Preencha título e URL do artigo.");
      return;
    }
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleFormData),
      });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Artigo cadastrado com sucesso!", 3000);
      setArticleFormData({ title: "", url: "" });
      fetchArticles();
    } catch {
      showMessage("error", "Erro ao cadastrar artigo");
    }
  };

  const handleArticleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artigo?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Artigo excluído com sucesso!", 3000);
      fetchArticles();
    } catch {
      showMessage("error", "Erro ao excluir artigo");
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFormData.title || !videoFormData.url) {
      showMessage("error", "Preencha título e URL do vídeo.");
      return;
    }
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoFormData),
      });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Vídeo cadastrado com sucesso!", 3000);
      setVideoFormData({ title: "", description: "", url: "" });
      fetchVideos();
    } catch {
      showMessage("error", "Erro ao cadastrar vídeo");
    }
  };

  const handleVideoDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este vídeo?")) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Vídeo excluído com sucesso!", 3000);
      fetchVideos();
    } catch {
      showMessage("error", "Erro ao excluir vídeo");
    }
  };

  const handleTrainingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainingFormData.title || !trainingFormData.fileUrl) {
      showMessage("error", "Preencha título e URL do material.");
      return;
    }
    try {
      const res = await fetch("/api/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trainingFormData),
      });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Treinamento cadastrado com sucesso!", 3000);
      setTrainingFormData({
        title: "",
        description: "",
        fileUrl: "",
        videoUrl: "",
      });
      fetchTrainings();
    } catch {
      showMessage("error", "Erro ao cadastrar treinamento");
    }
  };

  const handleTrainingDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este treinamento?")) return;
    try {
      const res = await fetch(`/api/trainings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      showMessage("success", "Treinamento excluído com sucesso!", 3000);
      fetchTrainings();
    } catch {
      showMessage("error", "Erro ao excluir treinamento");
    }
  };

  const limparFiltros = () => {
    setBusca("");
    setFiltroInteresse("todos");
    setOrdenacao("mais-recentes");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              ← Voltar ao site
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-6 text-center">
            Painel de Administração
          </h1>
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
              {message.text}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">
                Usuário
              </label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-lg"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const TabButton = ({
    id,
    label,
    icon: Icon,
    count,
  }: {
    id: AdminTab;
    label: string;
    icon: typeof Calendar;
    count?: number;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap ${
        activeTab === id
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-200"
          : "bg-transparent text-zinc-700 hover:bg-white"
      }`}
    >
      <Icon className="size-4.5" />
      {label}
      {typeof count === "number" && count > 0 && (
        <span
          className={`ml-0.5 inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
            activeTab === id ? "bg-white/20" : "bg-zinc-200 text-zinc-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-emerald-700 text-white py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="text-sm sm:text-base font-bold flex items-center gap-1"
          >
            ← Voltar ao site
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-center">
            Painel ABENPO
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 px-3 sm:px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="size-5" />
            ) : (
              <AlertCircle className="size-5" />
            )}
            {message.text}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-zinc-100 rounded-3xl overflow-x-auto">
          <TabButton
            id="events"
            label="Eventos"
            icon={Calendar}
            count={events.length}
          />
          <TabButton
            id="leads"
            label="Interesses"
            icon={Target}
            count={leads.length}
          />
          <TabButton
            id="associates"
            label="Associados"
            icon={UsersRound}
            count={associates.length}
          />
          <TabButton
            id="articles"
            label="Artigos"
            icon={BookOpen}
            count={articles.length}
          />
          <TabButton
            id="videos"
            label="Vídeos"
            icon={Video}
            count={videos.length}
          />
          <TabButton
            id="trainings"
            label="Treinamentos"
            icon={GraduationCap}
            count={trainings.length}
          />
        </div>

        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <Plus className="size-6 text-emerald-700" />
                Novo Evento
              </h2>
              <form
                onSubmit={handleEventSubmit}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Título do Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Ex: Congresso ABENPO 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventFormData.date}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Local *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.location}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        location: e.target.value,
                      })
                    }
                    placeholder="Ex: Hotel Recife, Recife-PE"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Link (URL / inscrição)
                  </label>
                  <input
                    type="url"
                    value={eventFormData.url}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="size-4" />
                    Cadastrar Evento
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <Calendar className="size-6 text-zinc-700" />
                Eventos Cadastrados
                <span className="text-sm font-semibold text-zinc-500 ml-1">
                  ({events.length})
                </span>
              </h2>
              {eventsLoading ? (
                <div className="text-center py-12 text-zinc-500">
                  Carregando...
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <Calendar className="size-12 mx-auto mb-3 text-zinc-300" />
                  <p className="font-semibold text-zinc-600">
                    Nenhum evento cadastrado
                  </p>
                  <p className="text-sm mt-1">
                    Use o formulário acima para adicionar.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-zinc-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                          <Calendar className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-zinc-900 text-lg mb-2">
                            {event.title}
                          </h3>
                          <div className="grid gap-2 text-sm sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-zinc-600">
                              <Clock className="size-4 text-zinc-400 shrink-0" />
                              <span>
                                {new Date(event.date).toLocaleString("pt-BR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-600">
                              <MapPin className="size-4 text-zinc-400 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                          {event.url && (
                            <a
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              Acessar link <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEventDelete(event.id)}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                        title="Excluir evento"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Total
                  </span>
                  <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Target className="size-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-zinc-900">
                  {estatisticas.total}
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Interesses cadastrados
                </p>
              </div>
              {estatisticas.porInteresse.slice(0, 2).map((item, idx) => (
                <div
                  key={item.interesse}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                      Top {idx + 1}
                    </span>
                    <div
                      className={`inline-flex size-10 items-center justify-center rounded-2xl ${
                        idx === 0
                          ? "bg-teal-50 text-teal-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <Target className="size-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-zinc-900">
                    {item.total}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                    {item.interesse}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por nome, e-mail, WhatsApp ou interesse..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                  {busca && (
                    <button
                      onClick={() => setBusca("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-200 text-zinc-500"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => setFiltrosAbertos((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
                  >
                    <Filter className="size-4" />
                    Filtros
                    {filtrosAbertos ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </button>
                  <button
                    onClick={exportLeadsCSV}
                    disabled={leadsFiltrados.length === 0}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="size-4" />
                    <span className="hidden sm:inline">Exportar</span> CSV
                  </button>
                </div>
              </div>
              {filtrosAbertos && (
                <div className="mt-5 pt-5 border-t border-zinc-100 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      Filtrar por interesse
                    </label>
                    <select
                      value={filtroInteresse}
                      onChange={(e) => setFiltroInteresse(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="todos">Todos os interesses</option>
                      {interessesDisponiveis.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={ordenacao}
                      onChange={(e) =>
                        setOrdenacao(
                          e.target.value as
                            | "mais-recentes"
                            | "mais-antigos"
                            | "nome",
                        )
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="mais-recentes">Mais recentes</option>
                      <option value="mais-antigos">Mais antigos</option>
                      <option value="nome">Nome (A-Z)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      onClick={limparFiltros}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      <X className="size-4" /> Limpar todos os filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                    Interesses
                    <span className="ml-2 text-sm font-semibold text-zinc-500">
                      {leadsFiltrados.length} de {leads.length}
                    </span>
                  </h2>
                  {(busca || filtroInteresse !== "todos") && (
                    <p className="text-sm text-zinc-500 mt-1">
                      Exibindo resultados filtrados
                    </p>
                  )}
                </div>
              </div>
              {leadsLoading ? (
                <div className="text-center py-16 text-zinc-500">
                  Carregando...
                </div>
              ) : leadsFiltrados.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <Target className="size-12 mx-auto mb-3 text-zinc-300" />
                  <p className="font-semibold text-zinc-600">
                    {leads.length === 0
                      ? "Nenhum interesse ainda"
                      : "Nenhum resultado para os filtros selecionados"}
                  </p>
                  <p className="text-sm mt-1">
                    {leads.length === 0
                      ? "Os formulários preenchidos no site aparecerão aqui."
                      : "Tente ajustar os filtros."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {leadsFiltrados.map((lead) => (
                    <div
                      key={lead.id}
                      className="border border-zinc-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <div className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                            <User className="size-4" />
                          </div>
                          <h3 className="font-bold text-zinc-900 text-base">
                            {lead.nome}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/80">
                            <Target className="size-3" /> {lead.interesse}
                          </span>
                        </div>
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-2 text-zinc-600 hover:text-emerald-700 transition-colors min-w-0"
                          >
                            <Mail className="size-4 text-zinc-400 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </a>
                          {lead.whatsapp ? (
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-zinc-600 hover:text-emerald-700 transition-colors"
                            >
                              <Phone className="size-4 text-zinc-400 shrink-0" />
                              <span>{lead.whatsapp}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 text-zinc-400">
                              <Phone className="size-4 shrink-0" />
                              <span className="italic">
                                WhatsApp não informado
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs mt-3">
                          <Clock className="size-3.5 shrink-0" />
                          <span>
                            {new Date(lead.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`mailto:${lead.email}`}
                          className="p-2 text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Enviar e-mail"
                        >
                          <Mail className="size-5" />
                        </a>
                        <button
                          onClick={() => handleLeadDelete(lead.id)}
                          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "associates" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Total
                  </span>
                  <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <UsersRound className="size-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-zinc-900">
                  {estatisticasAssociados.total}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Cadastrados</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Ativos
                  </span>
                  <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                    <ShieldCheck className="size-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-zinc-900">
                  {estatisticasAssociados.ativos}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Acesso liberado</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
                    Inativos
                  </span>
                  <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
                    <Ban className="size-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-zinc-900">
                  {estatisticasAssociados.inativos}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Acesso bloqueado</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <div className="flex flex-col sm:flex-row gap-3 mb-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                  <input
                    value={assocBusca}
                    onChange={(e) => setAssocBusca(e.target.value)}
                    placeholder="Buscar por nome, e-mail ou telefone..."
                    className="w-full pl-12 pr-10 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                  {assocBusca && (
                    <button
                      onClick={() => setAssocBusca("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-200 text-zinc-500"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="inline-flex rounded-2xl border border-zinc-200 bg-zinc-50 p-1">
                    {(["todos", "ativos", "inativos"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setAssocStatusFilter(f)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                          assocStatusFilter === f
                            ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                            : "text-zinc-600 hover:text-zinc-900"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                  Associados
                  <span className="ml-2 text-sm font-semibold text-zinc-500">
                    {associatesFiltrados.length} de {associates.length}
                  </span>
                </h2>
              </div>
              {associatesLoading ? (
                <div className="text-center py-16 text-zinc-500">
                  Carregando...
                </div>
              ) : associatesFiltrados.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <UsersRound className="size-12 mx-auto mb-3 text-zinc-300" />
                  <p className="font-semibold text-zinc-600">
                    Nenhum associado encontrado
                  </p>
                  <p className="text-sm mt-1">
                    Os cadastros realizados na área do associado aparecerão
                    aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {associatesFiltrados.map((a) => (
                    <div
                      key={a.id}
                      className="border border-zinc-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div
                          className={`inline-flex size-12 items-center justify-center rounded-2xl shrink-0 ${
                            a.active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-zinc-100 text-zinc-500"
                          }`}
                        >
                          <User className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-bold text-zinc-900 text-lg">
                              {a.name}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
                                a.active
                                  ? "bg-green-50 text-green-700 ring-green-200"
                                  : "bg-zinc-100 text-zinc-600 ring-zinc-200"
                              }`}
                            >
                              {a.active ? (
                                <ShieldCheck className="size-3" />
                              ) : (
                                <Ban className="size-3" />
                              )}
                              {a.active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <div className="grid gap-2 text-sm sm:grid-cols-2">
                            <a
                              href={`mailto:${a.email}`}
                              className="flex items-center gap-2 text-zinc-600 hover:text-emerald-700 transition-colors min-w-0"
                            >
                              <Mail className="size-4 text-zinc-400 shrink-0" />
                              <span className="truncate">{a.email}</span>
                            </a>
                            {a.phone ? (
                              <a
                                href={`https://wa.me/${a.phone.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-zinc-600 hover:text-emerald-700 transition-colors"
                              >
                                <Phone className="size-4 text-zinc-400 shrink-0" />
                                <span>{a.phone}</span>
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 text-zinc-400">
                                <Phone className="size-4 shrink-0" />
                                <span className="italic">
                                  Telefone não informado
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-zinc-400 text-xs mt-3">
                            <Clock className="size-3.5 shrink-0" />
                            <span>
                              Cadastrado em{" "}
                              {new Date(a.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleToggleAssociateActive(a.id, a.active, a.name)
                          }
                          title={
                            a.active
                              ? "Desativar acesso"
                              : "Ativar acesso"
                          }
                          className={`p-2 rounded-xl transition-all ${
                            a.active
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {a.active ? (
                            <Ban className="size-5" />
                          ) : (
                            <ShieldCheck className="size-5" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleAssociateDelete(a.id, a.name)
                          }
                          className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <Plus className="size-6 text-emerald-700" />
                Novo Artigo
              </h2>
              <form
                onSubmit={handleArticleSubmit}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Título do Artigo *
                  </label>
                  <input
                    type="text"
                    required
                    value={articleFormData.title}
                    onChange={(e) =>
                      setArticleFormData({
                        ...articleFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Ex: Laserterapia em Podiatria"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    URL do Artigo *
                  </label>
                  <input
                    type="url"
                    required
                    value={articleFormData.url}
                    onChange={(e) =>
                      setArticleFormData({
                        ...articleFormData,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="size-4" />
                    Cadastrar Artigo
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <FileText className="size-6 text-zinc-700" />
                Artigos Cadastrados
                <span className="text-sm font-semibold text-zinc-500 ml-1">
                  ({articles.length})
                </span>
              </h2>
              {articlesLoading ? (
                <div className="text-center py-12 text-zinc-500">
                  Carregando...
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <FileText className="size-12 mx-auto mb-3 text-zinc-300" />
                  <p className="font-semibold text-zinc-600">
                    Nenhum artigo cadastrado
                  </p>
                  <p className="text-sm mt-1">
                    Artigos publicados aparecerão na área do associado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className="border border-zinc-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                          <FileText className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-zinc-900 text-base mb-2 leading-snug line-clamp-2">
                            {art.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1 text-zinc-500">
                              <Clock className="size-3.5" />
                              {new Date(
                                art.createdAt,
                              ).toLocaleDateString("pt-BR")}
                            </span>
                            <a
                              href={art.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              Abrir <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleArticleDelete(art.id)}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                        title="Excluir artigo"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "videos" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <Plus className="size-6 text-emerald-700" />
                Novo Vídeo
              </h2>
              <form
                onSubmit={handleVideoSubmit}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Título do Vídeo *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoFormData.title}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Ex: Técnicas de avaliação podal"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoFormData.url}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        url: e.target.value,
                      })
                    }
                    placeholder="Link do YouTube / Vimeo"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={videoFormData.description}
                    onChange={(e) =>
                      setVideoFormData({
                        ...videoFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Sobre o que é este vídeo..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-y"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="size-4" />
                    Cadastrar Vídeo
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <Video className="size-6 text-zinc-700" />
                Vídeos Cadastrados
                <span className="text-sm font-semibold text-zinc-500 ml-1">
                  ({videos.length})
                </span>
              </h2>
              {videosLoading ? (
                <div className="text-center py-12 text-zinc-500">
                  Carregando...
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <Video className="size-12 mx-auto mb-3 text-zinc-300" />
                  <p className="font-semibold text-zinc-600">
                    Nenhum vídeo cadastrado
                  </p>
                  <p className="text-sm mt-1">
                    Os vídeos publicados aparecerão na área do associado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {videos.map((v) => (
                    <div
                      key={v.id}
                      className="border border-zinc-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                          <Video className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-zinc-900 text-base mb-1.5 leading-snug">
                            {v.title}
                          </h3>
                          {v.description && (
                            <p className="text-sm text-zinc-600 mb-2 line-clamp-2">
                              {v.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1 text-zinc-500">
                              <Clock className="size-3.5" />
                              {new Date(
                                v.createdAt,
                              ).toLocaleDateString("pt-BR")}
                            </span>
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              Abrir <ExternalLink className="size-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleVideoDelete(v.id)}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                        title="Excluir vídeo"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "trainings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <Plus className="size-6 text-emerald-700" />
                Novo Treinamento
              </h2>
              <form
                onSubmit={handleTrainingSubmit}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Título do Treinamento *
                  </label>
                  <input
                    type="text"
                    required
                    value={trainingFormData.title}
                    onChange={(e) =>
                      setTrainingFormData({
                        ...trainingFormData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Ex: Curso de Onicomicose"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    URL do Material (PDF / Drive) *
                  </label>
                  <input
                    type="url"
                    required
                    value={trainingFormData.fileUrl}
                    onChange={(e) =>
                      setTrainingFormData({
                        ...trainingFormData,
                        fileUrl: e.target.value,
                      })
                    }
                    placeholder="https://docs.google.com/... ou link do PDF"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    URL do Vídeo (opcional)
                  </label>
                  <input
                    type="url"
                    value={trainingFormData.videoUrl}
                    onChange={(e) =>
                      setTrainingFormData({
                        ...trainingFormData,
                        videoUrl: e.target.value,
                      })
                    }
                    placeholder="YouTube / Vimeo"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-zinc-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={trainingFormData.description}
                    onChange={(e) =>
                      setTrainingFormData({
                        ...trainingFormData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Sobre o que é este treinamento, carga horária, instrutor..."
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-y"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <Plus className="size-4" />
                    Cadastrar Treinamento
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                <GraduationCap className="size-6 text-zinc-700" />
                Treinamentos Cadastrados
                <span className="text-sm font-semibold text-zinc-500 ml-1">
                  ({trainings.length})
                </span>
              </h2>
              {trainingsLoading ? (
                <div className="text-center py-12 text-zinc-500">
                  Carregando...
                </div>
              ) : trainings.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-2xl">
                  <GraduationCap className="size-12 mx-auto mb-3 text-zinc-300" />
                  <p className="font-semibold text-zinc-600">
                    Nenhum treinamento cadastrado
                  </p>
                  <p className="text-sm mt-1">
                    Os treinamentos aparecerão na área do associado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                  {trainings.map((t) => (
                    <div
                      key={t.id}
                      className="border border-zinc-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                          <GraduationCap className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-zinc-900 text-base mb-1.5 leading-snug">
                            {t.title}
                          </h3>
                          {t.description && (
                            <p className="text-sm text-zinc-600 mb-2 line-clamp-2">
                              {t.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1 text-zinc-500">
                              <Clock className="size-3.5" />
                              {new Date(
                                t.createdAt,
                              ).toLocaleDateString("pt-BR")}
                            </span>
                            <a
                              href={t.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              Material <ExternalLink className="size-3.5" />
                            </a>
                            {t.videoUrl && (
                              <a
                                href={t.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-800"
                              >
                                Vídeo <ExternalLink className="size-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTrainingDelete(t.id)}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                        title="Excluir treinamento"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
