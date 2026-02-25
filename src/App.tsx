import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "admin" | "manager" | "executor";
type Screen =
  | "login"
  | "tasks"
  | "camera"
  | "review"
  | "profile"
  | "new-task"
  | "notifications"
  | "manager-profile"
  | "task-detail"
  | "admin";

type TaskStatus = "new" | "in_progress" | "review" | "approved" | "rejected";

interface AppUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar: string;
  department: string;
  active: boolean;
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  status: TaskStatus;
  priority: "high" | "medium" | "low";
  deadline: string;
  location: string;
  photoRequired: boolean;
  photoUrl?: string;
  createdAt: string;
  category: string;
}

interface Notification {
  id: number;
  text: string;
  time: string;
  type: "success" | "warning" | "info";
  read: boolean;
}

const INITIAL_USERS: AppUser[] = [
  { id: 1, name: "Администратор", email: "admin@taskphoto.ru", password: "admin123", role: "admin", avatar: "АД", department: "Администрация", active: true, createdAt: "01 янв, 2026" },
  { id: 2, name: "Алексей Михайлов", email: "manager@taskphoto.ru", password: "manager123", role: "manager", avatar: "АМ", department: "Управление", active: true, createdAt: "10 янв, 2026" },
  { id: 3, name: "Анна Петрова", email: "anna@taskphoto.ru", password: "anna123", role: "executor", avatar: "АП", department: "Торговый зал", active: true, createdAt: "15 янв, 2026" },
  { id: 4, name: "Дмитрий Козлов", email: "dmitry@taskphoto.ru", password: "dmitry123", role: "executor", avatar: "ДК", department: "Склад", active: true, createdAt: "15 янв, 2026" },
  { id: 5, name: "Мария Сидорова", email: "maria@taskphoto.ru", password: "maria123", role: "executor", avatar: "МС", department: "Оборудование", active: true, createdAt: "20 янв, 2026" },
];

const TASKS: Task[] = [
  { id: 1, title: "Уборка торгового зала", description: "Провести полную уборку торгового зала, протереть витрины и стеллажи", assignee: "Анна Петрова", assigneeAvatar: "АП", status: "review", priority: "high", deadline: "Сегодня, 18:00", location: "ТЦ Европейский, зал 3", photoRequired: true, photoUrl: "https://images.unsplash.com/photo-1613235788198-4d3e37b1ed72?w=400&q=80", createdAt: "26 фев, 10:00", category: "Уборка" },
  { id: 2, title: "Инвентаризация склада", description: "Пересчитать товары на складе и внести данные в систему", assignee: "Дмитрий Козлов", assigneeAvatar: "ДК", status: "in_progress", priority: "medium", deadline: "Завтра, 12:00", location: "Склад №2, ул. Промышленная 15", photoRequired: true, createdAt: "25 фев, 09:00", category: "Склад" },
  { id: 3, title: "Проверка оборудования", description: "Осмотреть и проверить работоспособность кассового оборудования", assignee: "Мария Сидорова", assigneeAvatar: "МС", status: "approved", priority: "low", deadline: "26 фев, 15:00", location: "Офис на Тверской, 12", photoRequired: true, photoUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", createdAt: "24 фев, 14:00", category: "Оборудование" },
  { id: 4, title: "Расстановка товаров", description: "Выложить новый товар согласно планограмме", assignee: "Анна Петрова", assigneeAvatar: "АП", status: "new", priority: "high", deadline: "27 фев, 10:00", location: "ТЦ Европейский, зал 1", photoRequired: true, createdAt: "26 фев, 11:30", category: "Мерчандайзинг" },
];

const NOTIFICATIONS: Notification[] = [
  { id: 1, text: "Анна Петрова отправила фото на проверку", time: "10 мин назад", type: "info", read: false },
  { id: 2, text: "Задача 'Проверка оборудования' утверждена", time: "1 час назад", type: "success", read: false },
  { id: 3, text: "Дмитрий Козлов приступил к инвентаризации", time: "2 часа назад", type: "info", read: true },
  { id: 4, text: "Новая задача назначена вам", time: "3 часа назад", type: "warning", read: true },
];

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; icon: string }> = {
  new: { label: "Новая", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30", icon: "Plus" },
  in_progress: { label: "В работе", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", icon: "Play" },
  review: { label: "На проверке", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/30", icon: "Eye" },
  approved: { label: "Утверждена", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: "CheckCircle" },
  rejected: { label: "Отклонена", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: "XCircle" },
};

const PRIORITY_CONFIG = {
  high: { label: "Высокий", color: "text-red-400", dot: "bg-red-400" },
  medium: { label: "Средний", color: "text-amber-400", dot: "bg-amber-400" },
  low: { label: "Низкий", color: "text-emerald-400", dot: "bg-emerald-400" },
};

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string; icon: string }> = {
  admin: { label: "Администратор", color: "text-rose-400", bg: "bg-rose-400/10 border-rose-400/30", icon: "Shield" },
  manager: { label: "Менеджер", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/30", icon: "LayoutDashboard" },
  executor: { label: "Исполнитель", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/30", icon: "Hammer" },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<"tasks" | "camera" | "review" | "profile" | "notifications">("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", deadline: "", location: "", priority: "medium" as "high" | "medium" | "low", category: "" });
  const [cameraStep, setCameraStep] = useState<"intro" | "photo" | "location" | "done">("intro");
  const [reviewTab, setReviewTab] = useState<"pending" | "approved">("pending");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredTasks = tasks.filter((t) => filterStatus === "all" || t.status === filterStatus);
  const role = currentUser?.role ?? "executor";

  function handleLogin(user: AppUser) {
    setCurrentUser(user);
    setScreen(user.role === "admin" ? "admin" : "tasks");
    setActiveTab("tasks");
  }

  function handleLogout() {
    setCurrentUser(null);
    setScreen("login");
  }

  function handleNav(tab: "tasks" | "camera" | "review" | "profile" | "notifications") {
    setActiveTab(tab);
    if (tab === "tasks") setScreen("tasks");
    else if (tab === "camera") { setScreen("camera"); setCameraStep("intro"); }
    else if (tab === "review") setScreen("review");
    else if (tab === "notifications") setScreen("notifications");
    else if (tab === "profile") setScreen(role === "manager" ? "manager-profile" : "profile");
  }

  function handleApprove(taskId: number) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "approved" } : t));
  }

  function handleReject(taskId: number) {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "rejected" } : t));
  }

  function handleCreateTask() {
    if (!newTask.title) return;
    const created: Task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee || "Не назначен",
      assigneeAvatar: newTask.assignee ? newTask.assignee.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "НН",
      status: "new",
      priority: newTask.priority,
      deadline: newTask.deadline || "Без срока",
      location: newTask.location || "Не указано",
      photoRequired: true,
      createdAt: "Только что",
      category: newTask.category || "Общее",
    };
    setTasks((prev) => [created, ...prev]);
    setNewTask({ title: "", description: "", assignee: "", deadline: "", location: "", priority: "medium", category: "" });
    setScreen("tasks");
    setActiveTab("tasks");
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const stats = {
    total: tasks.length,
    approved: tasks.filter((t) => t.status === "approved").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    approvalRate: Math.round((tasks.filter((t) => t.status === "approved").length / tasks.length) * 100),
  };

  return (
    <div className="app-shell font-body">
      {screen === "login" && (
        <LoginScreen users={users} onLogin={handleLogin} />
      )}

      {screen === "admin" && currentUser && (
        <AdminScreen
          currentUser={currentUser}
          users={users}
          setUsers={setUsers}
          onLogout={handleLogout}
        />
      )}

      {screen !== "login" && screen !== "admin" && currentUser && (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {screen === "tasks" && (
              <TasksScreen tasks={filteredTasks} allTasks={tasks} filterStatus={filterStatus} setFilterStatus={setFilterStatus} role={role as "manager" | "executor"} onTaskClick={(t) => { setSelectedTask(t); setScreen("task-detail"); }} onNewTask={() => setScreen("new-task")} stats={stats} />
            )}
            {screen === "task-detail" && selectedTask && (
              <TaskDetailScreen task={selectedTask} role={role as "manager" | "executor"} onBack={() => setScreen("tasks")} onApprove={handleApprove} onReject={handleReject} onStartWork={(id) => { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "in_progress" } : t)); setScreen("tasks"); }} />
            )}
            {screen === "camera" && (
              <CameraScreen step={cameraStep} setStep={setCameraStep} tasks={tasks} setTasks={setTasks} />
            )}
            {screen === "review" && (
              <ReviewScreen tasks={tasks} tab={reviewTab} setTab={setReviewTab} onApprove={handleApprove} onReject={handleReject} onTaskClick={(t) => { setSelectedTask(t); setScreen("task-detail"); }} />
            )}
            {screen === "notifications" && (
              <NotificationsScreen notifications={notifications} onMarkAll={markAllRead} />
            )}
            {screen === "manager-profile" && (
              <ManagerProfileScreen stats={stats} tasks={tasks} currentUser={currentUser} onLogout={handleLogout} />
            )}
            {screen === "profile" && (
              <ExecutorProfileScreen tasks={tasks} currentUser={currentUser} onLogout={handleLogout} />
            )}
            {screen === "new-task" && (
              <NewTaskScreen newTask={newTask} setNewTask={setNewTask} onCreate={handleCreateTask} onBack={() => setScreen("tasks")} users={users} />
            )}
          </div>
          <BottomNav activeTab={activeTab} onNav={handleNav} role={role as "manager" | "executor"} unreadCount={unreadCount} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════ LOGIN ═══════════════════════════════ */

function LoginScreen({ users, onLogin }: { users: AppUser[]; onLogin: (u: AppUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit() {
    if (!email || !password) {
      setError("Введите email и пароль");
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        setError("Данный профиль в системе не зарегистрирован");
        setLoading(false);
        return;
      }
      if (!found.active) {
        setError("Ваш аккаунт деактивирован. Обратитесь к администратору");
        setLoading(false);
        return;
      }
      setLoading(false);
      onLogin(found);
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="login-bg flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <div className="login-logo mx-auto mb-5 animate-float">
            <Icon name="Camera" size={32} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-black text-white mb-2 tracking-tight">TaskPhoto</h1>
          <p className="text-white/60 text-sm">Фотомониторинг выполнения задач</p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="you@company.ru"
              className={`input-field ${error ? "input-field-error" : ""}`}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="field-label">Пароль</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className={`input-field pr-12 ${error ? "input-field-error" : ""}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error animate-scale-in">
              <Icon name="AlertCircle" size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full mt-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="login-spinner" />
                Проверка...
              </>
            ) : (
              <>
                Войти
                <Icon name="ArrowRight" size={18} />
              </>
            )}
          </button>
        </div>

        <div className="mt-5 glass-card p-4">
          <p className="text-white/40 text-xs text-center mb-3 font-semibold uppercase tracking-wider">Демо-доступ</p>
          <div className="space-y-2">
            {[
              { label: "Администратор", email: "admin@taskphoto.ru", pass: "admin123", color: "text-rose-400" },
              { label: "Менеджер", email: "manager@taskphoto.ru", pass: "manager123", color: "text-violet-400" },
              { label: "Исполнитель", email: "anna@taskphoto.ru", pass: "anna123", color: "text-cyan-400" },
            ].map((d) => (
              <button
                key={d.email}
                onClick={() => { setEmail(d.email); setPassword(d.pass); setError(""); }}
                className="demo-chip"
              >
                <span className={`text-xs font-semibold ${d.color}`}>{d.label}</span>
                <span className="text-white/30 text-xs">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ ADMIN ═══════════════════════════════ */

function AdminScreen({ currentUser, users, setUsers, onLogout }: {
  currentUser: AppUser;
  users: AppUser[];
  setUsers: (fn: (prev: AppUser[]) => AppUser[]) => void;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<"users" | "new">("users");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "executor" as Role, department: "" });
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  function handleAddUser() {
    setFormError("");
    if (!newUser.name || !newUser.email || !newUser.password) {
      setFormError("Заполните все обязательные поля");
      return;
    }
    if (users.find((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      setFormError("Пользователь с таким email уже существует");
      return;
    }
    const avatar = newUser.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const created: AppUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      avatar,
      department: newUser.department || "Не указан",
      active: true,
      createdAt: new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setUsers((prev) => [...prev, created]);
    setNewUser({ name: "", email: "", password: "", role: "executor", department: "" });
    setSuccessMsg(`Пользователь "${created.name}" успешно добавлен`);
    setTab("users");
    setTimeout(() => setSuccessMsg(""), 3000);
  }

  function toggleActive(id: number) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u));
  }

  function handleDelete(id: number) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="app-shell font-body">
      <div className="screen-content animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="admin-badge-icon">
              <Icon name="Shield" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black text-white">Администратор</h1>
              <p className="text-white/40 text-xs">{currentUser.name}</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-back" title="Выйти">
            <Icon name="LogOut" size={17} className="text-white/60" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard label="Всего" value={users.length} color="from-rose-500 to-pink-600" icon="Users" />
          <StatCard label="Активных" value={users.filter((u) => u.active).length} color="from-emerald-500 to-teal-600" icon="UserCheck" />
          <StatCard label="Ролей" value={3} color="from-violet-500 to-indigo-600" icon="Shield" />
        </div>

        {/* Success */}
        {successMsg && (
          <div className="admin-success animate-scale-in mb-4">
            <Icon name="CheckCircle" size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-sm">{successMsg}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="tab-switch mb-5">
          <button onClick={() => setTab("users")} className={`tab-btn ${tab === "users" ? "tab-active" : "tab-inactive"}`}>
            <Icon name="Users" size={15} />
            Пользователи
            <span className="tab-count">{users.length}</span>
          </button>
          <button onClick={() => setTab("new")} className={`tab-btn ${tab === "new" ? "tab-active" : "tab-inactive"}`}>
            <Icon name="UserPlus" size={15} />
            Добавить
          </button>
        </div>

        {/* Users list */}
        {tab === "users" && (
          <div className="space-y-3">
            {users.map((u, i) => (
              <div key={u.id} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                <div className="flex items-center gap-3">
                  <div className={`user-avatar-admin ${u.active ? "opacity-100" : "opacity-40"}`}
                    style={{ background: u.role === "admin" ? "linear-gradient(135deg,#f43f5e,#e11d48)" : u.role === "manager" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>
                    {u.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-semibold truncate ${u.active ? "text-white" : "text-white/40"}`}>{u.name}</p>
                      {!u.active && <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2 py-0.5">Откл.</span>}
                    </div>
                    <p className="text-white/40 text-xs truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`status-badge text-xs ${ROLE_CONFIG[u.role].bg} ${ROLE_CONFIG[u.role].color}`}>
                        <Icon name={ROLE_CONFIG[u.role].icon} size={10} />
                        {ROLE_CONFIG[u.role].label}
                      </span>
                      <span className="text-white/30 text-xs">{u.department}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {u.id !== currentUser.id && (
                      <>
                        <button
                          onClick={() => toggleActive(u.id)}
                          className={`user-action-btn ${u.active ? "text-amber-400 bg-amber-400/10" : "text-emerald-400 bg-emerald-400/10"}`}
                          title={u.active ? "Деактивировать" : "Активировать"}
                        >
                          <Icon name={u.active ? "UserX" : "UserCheck"} size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(u.id)}
                          className="user-action-btn text-red-400 bg-red-400/10"
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </>
                    )}
                    {u.id === currentUser.id && (
                      <span className="text-white/20 text-xs px-1">Вы</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/30">
                  <span className="flex items-center gap-1"><Icon name="Calendar" size={11} />Добавлен: {u.createdAt}</span>
                  <span className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${u.active ? "bg-emerald-400" : "bg-red-400"}`} />
                    {u.active ? "Активен" : "Отключён"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add user form */}
        {tab === "new" && (
          <div className="space-y-4 animate-scale-in">
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Icon name="UserPlus" size={18} className="text-violet-400" />
                Новый пользователь
              </h3>

              <div>
                <label className="field-label">Полное имя *</label>
                <input className="input-field" placeholder="Иванов Иван Иванович" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Email *</label>
                <input type="email" className="input-field" placeholder="ivanov@company.ru" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Пароль *</label>
                <input type="text" className="input-field" placeholder="Придумайте пароль" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Отдел / Должность</label>
                <input className="input-field" placeholder="Например: Торговый зал" value={newUser.department} onChange={(e) => setNewUser((p) => ({ ...p, department: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Роль</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["admin", "manager", "executor"] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setNewUser((p) => ({ ...p, role: r }))}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${newUser.role === r ? `${ROLE_CONFIG[r].bg} ${ROLE_CONFIG[r].color}` : "border-white/10 text-white/40 bg-white/5"}`}
                    >
                      <Icon name={ROLE_CONFIG[r].icon} size={16} />
                      {ROLE_CONFIG[r].label}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="login-error">
                  <Icon name="AlertCircle" size={15} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}

              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.password}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon name="UserPlus" size={18} />
                Добавить пользователя
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Icon name="Trash2" size={24} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">Удалить пользователя?</h3>
            <p className="text-white/50 text-sm text-center mb-6">
              {users.find((u) => u.id === deleteId)?.name} будет удалён из системы. Это действие нельзя отменить.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Отмена</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════ TASKS ═══════════════════════════════ */

function TasksScreen({ tasks, allTasks, filterStatus, setFilterStatus, role, onTaskClick, onNewTask, stats }: {
  tasks: Task[];
  allTasks: Task[];
  filterStatus: TaskStatus | "all";
  setFilterStatus: (s: TaskStatus | "all") => void;
  role: "manager" | "executor";
  onTaskClick: (t: Task) => void;
  onNewTask: () => void;
  stats: { total: number; approved: number; inProgress: number; review: number; approvalRate: number };
}) {
  const filters: { key: TaskStatus | "all"; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "new", label: "Новые" },
    { key: "in_progress", label: "В работе" },
    { key: "review", label: "На проверке" },
    { key: "approved", label: "Утверждены" },
  ];

  return (
    <div className="screen-content">
      <div className="screen-header">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Задачи</h1>
          <p className="text-white/50 text-sm">{role === "manager" ? "Все задачи команды" : "Мои задачи"}</p>
        </div>
        {role === "manager" && (
          <button onClick={onNewTask} className="btn-icon-primary">
            <Icon name="Plus" size={20} className="text-white" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Всего" value={stats.total} color="from-violet-500 to-indigo-600" icon="List" />
        <StatCard label="В работе" value={stats.inProgress} color="from-amber-500 to-orange-600" icon="Play" />
        <StatCard label="Одобрено" value={`${stats.approvalRate}%`} color="from-emerald-500 to-teal-600" icon="CheckCircle" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)} className={`filter-chip ${filterStatus === f.key ? "filter-chip-active" : ""}`}>
            {f.label}
            {f.key !== "all" && (
              <span className={`filter-count ${filterStatus === f.key ? "bg-white/20" : "bg-white/10"}`}>
                {allTasks.filter((t) => t.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => (
          <button key={task.id} onClick={() => onTaskClick(task)} className="task-card animate-fade-in w-full text-left" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
            <div className="flex items-start gap-3">
              <div className="task-avatar">{task.assigneeAvatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`status-badge ${STATUS_CONFIG[task.status].bg} ${STATUS_CONFIG[task.status].color}`}>
                    <Icon name={STATUS_CONFIG[task.status].icon} size={11} />
                    {STATUS_CONFIG[task.status].label}
                  </span>
                  <span className={`priority-dot ${PRIORITY_CONFIG[task.priority].dot}`} />
                </div>
                <h3 className="text-white font-semibold text-sm leading-tight mb-1 truncate">{task.title}</h3>
                <div className="flex items-center gap-3 text-white/40 text-xs">
                  <span className="flex items-center gap-1"><Icon name="MapPin" size={11} />{task.location.split(",")[0]}</span>
                  <span className="flex items-center gap-1"><Icon name="Clock" size={11} />{task.deadline}</span>
                </div>
              </div>
              {task.photoUrl && (
                <div className="task-thumb">
                  <img src={task.photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </button>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Задач нет</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  return (
    <div className={`stat-card bg-gradient-to-br ${color}`}>
      <Icon name={icon} size={18} className="text-white/70 mb-2" />
      <div className="text-white font-display font-black text-xl">{value}</div>
      <div className="text-white/70 text-xs">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════ TASK DETAIL ═══════════════════════════════ */

function TaskDetailScreen({ task, role, onBack, onApprove, onReject, onStartWork }: {
  task: Task;
  role: "manager" | "executor";
  onBack: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onStartWork: (id: number) => void;
}) {
  const status = STATUS_CONFIG[task.status];

  return (
    <div className="screen-content animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-back">
          <Icon name="ArrowLeft" size={18} className="text-white" />
        </button>
        <h2 className="font-display text-xl font-black text-white">Детали задачи</h2>
      </div>

      <div className="glass-card p-5 mb-4">
        <div className={`status-badge-lg ${status.bg} ${status.color} mb-4`}>
          <Icon name={status.icon} size={14} />
          {status.label}
        </div>
        <h2 className="text-white font-display font-bold text-xl mb-2">{task.title}</h2>
        <p className="text-white/60 text-sm leading-relaxed">{task.description}</p>
      </div>

      <div className="glass-card p-5 mb-4 space-y-4">
        <DetailRow icon="User" label="Исполнитель" value={task.assignee} />
        <DetailRow icon="MapPin" label="Местоположение" value={task.location} />
        <DetailRow icon="Clock" label="Срок выполнения" value={task.deadline} />
        <DetailRow icon="Tag" label="Категория" value={task.category} />
        <DetailRow icon="Flag" label="Приоритет" value={PRIORITY_CONFIG[task.priority].label} valueColor={PRIORITY_CONFIG[task.priority].color} />
        <DetailRow icon="Calendar" label="Создана" value={task.createdAt} />
      </div>

      {task.photoUrl ? (
        <div className="glass-card overflow-hidden mb-4">
          <div className="p-4 border-b border-white/10 flex items-center gap-2">
            <Icon name="Camera" size={16} className="text-violet-400" />
            <span className="text-white/70 text-sm font-semibold">Фото отчёт</span>
          </div>
          <img src={task.photoUrl} alt="Фото выполнения" className="w-full h-52 object-cover" />
          <div className="p-3 flex items-center gap-2 text-xs">
            <Icon name="MapPin" size={12} className="text-emerald-400" />
            <span className="text-emerald-400">Геолокация подтверждена</span>
          </div>
        </div>
      ) : (
        <div className="glass-card p-5 mb-4 flex items-center gap-3 border border-dashed border-white/20">
          <Icon name="Camera" size={22} className="text-white/30" />
          <div>
            <p className="text-white/50 text-sm">Фото ещё не прикреплено</p>
            <p className="text-white/30 text-xs">Исполнитель отправит фото при выполнении</p>
          </div>
        </div>
      )}

      <div className="space-y-3 pb-4">
        {role === "executor" && task.status === "new" && (
          <button onClick={() => onStartWork(task.id)} className="btn-primary w-full">
            <Icon name="Play" size={18} />
            Приступить к выполнению
          </button>
        )}
        {role === "manager" && task.status === "review" && (
          <div className="flex gap-3">
            <button onClick={() => { onApprove(task.id); onBack(); }} className="btn-success flex-1">
              <Icon name="Check" size={18} />
              Утвердить
            </button>
            <button onClick={() => { onReject(task.id); onBack(); }} className="btn-danger flex-1">
              <Icon name="X" size={18} />
              Отклонить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, valueColor }: { icon: string; label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="detail-icon-wrap">
        <Icon name={icon} size={15} className="text-violet-400" />
      </div>
      <div>
        <p className="text-white/40 text-xs">{label}</p>
        <p className={`text-sm font-medium ${valueColor || "text-white"}`}>{value}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ CAMERA ═══════════════════════════════ */

function CameraScreen({ step, setStep, tasks, setTasks }: {
  step: "intro" | "photo" | "location" | "done";
  setStep: (s: "intro" | "photo" | "location" | "done") => void;
  tasks: Task[];
  setTasks: (fn: (prev: Task[]) => Task[]) => void;
}) {
  const myTask = tasks.find((t) => t.status === "in_progress") || tasks[0];

  function handleSubmit() {
    if (myTask) {
      setTasks((prev) => prev.map((t) => t.id === myTask.id ? { ...t, status: "review", photoUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" } : t));
    }
    setStep("done");
  }

  return (
    <div className="screen-content animate-fade-in">
      <div className="screen-header">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Камера</h1>
          <p className="text-white/50 text-sm">Фото-отчёт о выполнении</p>
        </div>
      </div>

      {step === "intro" && (
        <div className="space-y-4 animate-scale-in">
          {myTask && (
            <div className="glass-card p-4 border border-violet-500/30">
              <p className="text-white/50 text-xs mb-1">Текущая задача</p>
              <p className="text-white font-semibold">{myTask.title}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                <Icon name="MapPin" size={12} className="text-emerald-400" />
                <span>{myTask.location}</span>
              </div>
            </div>
          )}
          <div className="camera-zone" onClick={() => setStep("photo")}>
            <div className="camera-zone-inner">
              <div className="camera-shutter-btn">
                <Icon name="Camera" size={32} className="text-white" />
              </div>
              <p className="text-white/70 text-sm mt-4">Нажмите для съёмки</p>
              <p className="text-white/40 text-xs mt-1">Камера подтвердит геолокацию</p>
            </div>
          </div>
          <div className="steps-row">
            {["Фото", "Геолокация", "Отправка"].map((s, i) => (
              <div key={s} className="step-item">
                <div className={`step-num ${i === 0 ? "step-active" : "step-inactive"}`}>{i + 1}</div>
                <span className="text-white/50 text-xs">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === "photo" && (
        <div className="animate-scale-in">
          <div className="camera-preview mb-4">
            <div className="camera-preview-inner">
              <div className="camera-frame-corner tl" />
              <div className="camera-frame-corner tr" />
              <div className="camera-frame-corner bl" />
              <div className="camera-frame-corner br" />
              <div className="text-center">
                <Icon name="Camera" size={48} className="text-white/30 mb-3" />
                <p className="text-white/50 text-sm">Камера активна</p>
              </div>
            </div>
          </div>
          <button onClick={() => setStep("location")} className="btn-primary w-full">
            <Icon name="Aperture" size={18} />
            Сделать снимок
          </button>
        </div>
      )}

      {step === "location" && (
        <div className="animate-scale-in space-y-4">
          <div className="location-map-zone">
            <div className="text-center">
              <div className="location-ping">
                <Icon name="MapPin" size={28} className="text-white" />
              </div>
              <p className="text-white/70 text-sm mt-3">Определение местоположения</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="location-info-card">
                <Icon name="Navigation" size={14} className="text-emerald-400 mb-1" />
                <span className="text-emerald-400 text-xs font-semibold">Подтверждено</span>
                <p className="text-white/60 text-xs mt-1">GPS активен</p>
              </div>
              <div className="location-info-card">
                <Icon name="MapPin" size={14} className="text-violet-400 mb-1" />
                <span className="text-violet-400 text-xs font-semibold">Совпадает</span>
                <p className="text-white/60 text-xs mt-1">Объект верный</p>
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} className="btn-primary w-full">
            <Icon name="Send" size={18} />
            Отправить на проверку
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="animate-scale-in text-center py-8">
          <div className="done-circle mx-auto mb-5">
            <Icon name="CheckCircle" size={48} className="text-emerald-400" />
          </div>
          <h3 className="font-display text-xl font-black text-white mb-2">Отчёт отправлен!</h3>
          <p className="text-white/50 text-sm mb-6">Менеджер проверит фото и геолокацию</p>
          <div className="glass-card p-4 text-left space-y-2">
            {["Фото прикреплено", "Геолокация подтверждена", "Статус: На проверке"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <Icon name="Check" size={14} className="text-emerald-400" />
                <span className="text-white/70">{item}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("intro")} className="btn-secondary w-full mt-4">Новый отчёт</button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════ REVIEW ═══════════════════════════════ */

function ReviewScreen({ tasks, tab, setTab, onApprove, onReject, onTaskClick }: {
  tasks: Task[];
  tab: "pending" | "approved";
  setTab: (t: "pending" | "approved") => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onTaskClick: (t: Task) => void;
}) {
  const pending = tasks.filter((t) => t.status === "review");
  const approved = tasks.filter((t) => t.status === "approved");
  const current = tab === "pending" ? pending : approved;

  return (
    <div className="screen-content animate-fade-in">
      <div className="screen-header">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Проверка</h1>
          <p className="text-white/50 text-sm">Фото-отчёты исполнителей</p>
        </div>
        {pending.length > 0 && <div className="badge-counter">{pending.length}</div>}
      </div>

      <div className="tab-switch mb-5">
        <button onClick={() => setTab("pending")} className={`tab-btn ${tab === "pending" ? "tab-active" : "tab-inactive"}`}>
          На проверке {pending.length > 0 && <span className="tab-count">{pending.length}</span>}
        </button>
        <button onClick={() => setTab("approved")} className={`tab-btn ${tab === "approved" ? "tab-active" : "tab-inactive"}`}>
          Утверждены {approved.length > 0 && <span className="tab-count">{approved.length}</span>}
        </button>
      </div>

      <div className="space-y-4">
        {current.map((task, i) => (
          <div key={task.id} className="glass-card overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}>
            {task.photoUrl && (
              <div className="relative">
                <img src={task.photoUrl} alt="" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="task-avatar-sm">{task.assigneeAvatar}</div>
                    <span className="text-white text-sm font-semibold">{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400 bg-black/40 rounded-full px-2 py-1">
                    <Icon name="MapPin" size={11} />GPS ✓
                  </div>
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-1">{task.title}</h3>
              <p className="text-white/50 text-xs mb-3">{task.location}</p>
              {tab === "pending" ? (
                <div className="flex gap-2">
                  <button onClick={() => onApprove(task.id)} className="btn-success flex-1 text-sm py-2">
                    <Icon name="Check" size={15} />Утвердить
                  </button>
                  <button onClick={() => onReject(task.id)} className="btn-danger flex-1 text-sm py-2">
                    <Icon name="X" size={15} />Отклонить
                  </button>
                  <button onClick={() => onTaskClick(task)} className="btn-ghost px-3">
                    <Icon name="Eye" size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <Icon name="CheckCircle" size={16} />
                  <span>Утверждено</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {current.length === 0 && (
          <div className="text-center py-12 text-white/30">
            <Icon name="CheckSquare" size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">{tab === "pending" ? "Нет задач на проверке" : "Нет утверждённых задач"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ NOTIFICATIONS ═══════════════════════════════ */

function NotificationsScreen({ notifications, onMarkAll }: { notifications: Notification[]; onMarkAll: () => void }) {
  const icons: Record<string, string> = { success: "CheckCircle", warning: "AlertTriangle", info: "Bell" };
  const colors: Record<string, string> = { success: "text-emerald-400", warning: "text-amber-400", info: "text-violet-400" };
  const bgs: Record<string, string> = { success: "bg-emerald-400/10", warning: "bg-amber-400/10", info: "bg-violet-400/10" };

  return (
    <div className="screen-content animate-fade-in">
      <div className="screen-header">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Уведомления</h1>
          <p className="text-white/50 text-sm">{notifications.filter((n) => !n.read).length} непрочитанных</p>
        </div>
        <button onClick={onMarkAll} className="text-violet-400 text-xs font-semibold">Прочитать все</button>
      </div>
      <div className="space-y-2">
        {notifications.map((n, i) => (
          <div key={n.id} className={`notif-card animate-fade-in ${n.read ? "opacity-60" : ""}`} style={{ animationDelay: `${i * 0.05}s`, opacity: n.read ? 0.6 : 0 }}>
            <div className={`notif-icon ${bgs[n.type]}`}>
              <Icon name={icons[n.type]} size={18} className={colors[n.type]} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${n.read ? "text-white/60" : "text-white"}`}>{n.text}</p>
              <p className="text-white/30 text-xs mt-1">{n.time}</p>
            </div>
            {!n.read && <div className="notif-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ PROFILES ═══════════════════════════════ */

function ManagerProfileScreen({ stats, tasks, currentUser, onLogout }: {
  stats: { total: number; approved: number; inProgress: number; review: number; approvalRate: number };
  tasks: Task[];
  currentUser: AppUser;
  onLogout: () => void;
}) {
  const employees = [
    { name: "Анна Петрова", avatar: "АП", tasks: tasks.filter((t) => t.assignee === "Анна Петрова"), color: "from-pink-500 to-rose-600" },
    { name: "Дмитрий Козлов", avatar: "ДК", tasks: tasks.filter((t) => t.assignee === "Дмитрий Козлов"), color: "from-cyan-500 to-blue-600" },
    { name: "Мария Сидорова", avatar: "МС", tasks: tasks.filter((t) => t.assignee === "Мария Сидорова"), color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="screen-content animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Профиль</h1>
          <p className="text-white/50 text-sm">Менеджер</p>
        </div>
        <button onClick={onLogout} className="btn-back" title="Выйти">
          <Icon name="LogOut" size={17} className="text-white/60" />
        </button>
      </div>

      <div className="manager-hero mb-6">
        <div className="manager-avatar">{currentUser.avatar}</div>
        <div>
          <h2 className="text-white font-display font-bold text-lg">{currentUser.name}</h2>
          <p className="text-white/50 text-sm">{currentUser.department}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs">В сети</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Всего задач" value={stats.total} color="from-violet-500 to-indigo-600" icon="List" />
        <StatCard label="% одобрения" value={`${stats.approvalRate}%`} color="from-emerald-500 to-teal-600" icon="TrendingUp" />
        <StatCard label="На проверке" value={stats.review} color="from-violet-500 to-purple-700" icon="Eye" />
        <StatCard label="В работе" value={stats.inProgress} color="from-amber-500 to-orange-600" icon="Play" />
      </div>

      <h3 className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-3">Отчёт по сотрудникам</h3>
      <div className="space-y-3">
        {employees.map((emp) => {
          const done = emp.tasks.filter((t) => t.status === "approved").length;
          const rate = emp.tasks.length > 0 ? Math.round((done / emp.tasks.length) * 100) : 0;
          return (
            <div key={emp.name} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${emp.color} flex items-center justify-center text-white font-bold text-sm`}>{emp.avatar}</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{emp.name}</p>
                  <p className="text-white/40 text-xs">Задач: {emp.tasks.length} · Выполнено: {done}</p>
                </div>
                <span className="text-emerald-400 font-bold text-sm">{rate}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${rate}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExecutorProfileScreen({ tasks, currentUser, onLogout }: {
  tasks: Task[];
  currentUser: AppUser;
  onLogout: () => void;
}) {
  const myTasks = tasks.filter((t) => t.assignee === currentUser.name);
  const done = myTasks.filter((t) => t.status === "approved").length;
  const rate = myTasks.length > 0 ? Math.round((done / myTasks.length) * 100) : 0;

  return (
    <div className="screen-content animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Профиль</h1>
          <p className="text-white/50 text-sm">Исполнитель</p>
        </div>
        <button onClick={onLogout} className="btn-back" title="Выйти">
          <Icon name="LogOut" size={17} className="text-white/60" />
        </button>
      </div>

      <div className="manager-hero mb-6">
        <div className="executor-avatar">{currentUser.avatar}</div>
        <div>
          <h2 className="text-white font-display font-bold text-lg">{currentUser.name}</h2>
          <p className="text-white/50 text-sm">{currentUser.department}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs">В сети</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Мои задачи" value={myTasks.length} color="from-cyan-500 to-blue-600" icon="List" />
        <StatCard label="Выполнено" value={done} color="from-emerald-500 to-teal-600" icon="CheckCircle" />
        <StatCard label="Рейтинг" value={`${rate}%`} color="from-violet-500 to-indigo-600" icon="Star" />
      </div>

      <div className="glass-card p-5">
        <h3 className="text-white font-semibold mb-3">Моя эффективность</h3>
        <div className="space-y-3">
          {[{ label: "Выполнение в срок", val: 87 }, { label: "Одобрение с первого раза", val: rate }, { label: "Фото-отчёты", val: 100 }].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{item.label}</span>
                <span className="text-white font-semibold">{item.val}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" style={{ width: `${item.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ NEW TASK ═══════════════════════════════ */

function NewTaskScreen({ newTask, setNewTask, onCreate, onBack, users }: {
  newTask: { title: string; description: string; assignee: string; deadline: string; location: string; priority: "high" | "medium" | "low"; category: string };
  setNewTask: (fn: (prev: typeof newTask) => typeof newTask) => void;
  onCreate: () => void;
  onBack: () => void;
  users: AppUser[];
}) {
  const executors = users.filter((u) => u.role === "executor" && u.active);
  const priorities: { key: "high" | "medium" | "low"; label: string; active: string; inactive: string }[] = [
    { key: "high", label: "Высокий", active: "border-red-500/50 bg-red-500/10 text-red-400", inactive: "border-white/10 text-white/40 bg-white/5" },
    { key: "medium", label: "Средний", active: "border-amber-500/50 bg-amber-500/10 text-amber-400", inactive: "border-white/10 text-white/40 bg-white/5" },
    { key: "low", label: "Низкий", active: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400", inactive: "border-white/10 text-white/40 bg-white/5" },
  ];

  return (
    <div className="screen-content animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="btn-back">
          <Icon name="ArrowLeft" size={18} className="text-white" />
        </button>
        <h2 className="font-display text-xl font-black text-white">Новая задача</h2>
      </div>

      <div className="space-y-4 pb-4">
        <div>
          <label className="field-label">Название задачи *</label>
          <input className="input-field" placeholder="Например: Уборка склада №1" value={newTask.title} onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Описание</label>
          <textarea className="input-field resize-none" rows={3} placeholder="Подробное описание..." value={newTask.description} onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Исполнитель</label>
          <select className="input-field" value={newTask.assignee} onChange={(e) => setNewTask((p) => ({ ...p, assignee: e.target.value }))}>
            <option value="">— Выберите исполнителя —</option>
            {executors.map((u) => (
              <option key={u.id} value={u.name}>{u.name} ({u.department})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Срок выполнения</label>
          <input className="input-field" placeholder="Например: Завтра, 18:00" value={newTask.deadline} onChange={(e) => setNewTask((p) => ({ ...p, deadline: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Местоположение</label>
          <input className="input-field" placeholder="Адрес или название объекта" value={newTask.location} onChange={(e) => setNewTask((p) => ({ ...p, location: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Категория</label>
          <input className="input-field" placeholder="Уборка, склад, оборудование..." value={newTask.category} onChange={(e) => setNewTask((p) => ({ ...p, category: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Приоритет</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button key={p.key} onClick={() => setNewTask((prev) => ({ ...prev, priority: p.key }))} className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${newTask.priority === p.key ? p.active : p.inactive}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onCreate} disabled={!newTask.title} className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed">
          <Icon name="Plus" size={18} />
          Создать задачу
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ BOTTOM NAV ═══════════════════════════════ */

function BottomNav({ activeTab, onNav, role, unreadCount }: {
  activeTab: string;
  onNav: (tab: "tasks" | "camera" | "review" | "profile" | "notifications") => void;
  role: "manager" | "executor";
  unreadCount: number;
}) {
  const allItems: { key: "tasks" | "camera" | "review" | "profile" | "notifications"; icon: string; label: string; roles?: ("manager" | "executor")[] }[] = [
    { key: "tasks", icon: "LayoutGrid", label: "Задачи" },
    { key: "camera", icon: "Camera", label: "Камера", roles: ["executor"] },
    { key: "review", icon: "Eye", label: "Проверка", roles: ["manager"] },
    { key: "notifications", icon: "Bell", label: "Уведомления" },
    { key: "profile", icon: "User", label: "Профиль" },
  ];

  const items = allItems.filter((i) => !i.roles || i.roles.includes(role));

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button key={item.key} onClick={() => onNav(item.key)} className={`nav-item ${activeTab === item.key ? "nav-item-active" : "nav-item-inactive"}`}>
          <div className="relative">
            <Icon name={item.icon} size={22} />
            {item.key === "notifications" && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </div>
          <span className="text-xs mt-0.5">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
