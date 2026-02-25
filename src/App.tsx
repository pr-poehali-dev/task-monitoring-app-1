import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "manager" | "executor";
type Screen =
  | "login"
  | "tasks"
  | "camera"
  | "review"
  | "profile"
  | "new-task"
  | "notifications"
  | "manager-profile"
  | "task-detail";

type TaskStatus = "new" | "in_progress" | "review" | "approved" | "rejected";

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

const TASKS: Task[] = [
  {
    id: 1,
    title: "Уборка торгового зала",
    description: "Провести полную уборку торгового зала, протереть витрины и стеллажи",
    assignee: "Анна Петрова",
    assigneeAvatar: "АП",
    status: "review",
    priority: "high",
    deadline: "Сегодня, 18:00",
    location: "ТЦ Европейский, зал 3",
    photoRequired: true,
    photoUrl: "https://images.unsplash.com/photo-1613235788198-4d3e37b1ed72?w=400&q=80",
    createdAt: "26 фев, 10:00",
    category: "Уборка",
  },
  {
    id: 2,
    title: "Инвентаризация склада",
    description: "Пересчитать товары на складе и внести данные в систему",
    assignee: "Дмитрий Козлов",
    assigneeAvatar: "ДК",
    status: "in_progress",
    priority: "medium",
    deadline: "Завтра, 12:00",
    location: "Склад №2, ул. Промышленная 15",
    photoRequired: true,
    createdAt: "25 фев, 09:00",
    category: "Склад",
  },
  {
    id: 3,
    title: "Проверка оборудования",
    description: "Осмотреть и проверить работоспособность кассового оборудования",
    assignee: "Мария Сидорова",
    assigneeAvatar: "МС",
    status: "approved",
    priority: "low",
    deadline: "26 фев, 15:00",
    location: "Офис на Тверской, 12",
    photoRequired: true,
    photoUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    createdAt: "24 фев, 14:00",
    category: "Оборудование",
  },
  {
    id: 4,
    title: "Расстановка товаров",
    description: "Выложить новый товар согласно планограмме",
    assignee: "Анна Петрова",
    assigneeAvatar: "АП",
    status: "new",
    priority: "high",
    deadline: "27 фев, 10:00",
    location: "ТЦ Европейский, зал 1",
    photoRequired: true,
    createdAt: "26 фев, 11:30",
    category: "Мерчандайзинг",
  },
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

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("manager");
  const [activeTab, setActiveTab] = useState<"tasks" | "camera" | "review" | "profile" | "notifications">("tasks");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", deadline: "", location: "", priority: "medium" as "high" | "medium" | "low", category: "" });
  const [cameraStep, setCameraStep] = useState<"intro" | "photo" | "location" | "done">("intro");
  const [reviewTab, setReviewTab] = useState<"pending" | "approved">("pending");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredTasks = tasks.filter((t) => filterStatus === "all" || t.status === filterStatus);

  function handleLogin(selectedRole: Role) {
    setRole(selectedRole);
    setScreen("tasks");
    setActiveTab("tasks");
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
        <LoginScreen
          onLogin={handleLogin}
          showRoleSelect={showRoleSelect}
          setShowRoleSelect={setShowRoleSelect}
          email={loginEmail}
          setEmail={setLoginEmail}
          password={loginPassword}
          setPassword={setLoginPassword}
        />
      )}

      {screen !== "login" && (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {screen === "tasks" && (
              <TasksScreen
                tasks={filteredTasks}
                allTasks={tasks}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                role={role}
                onTaskClick={(t) => { setSelectedTask(t); setScreen("task-detail"); }}
                onNewTask={() => setScreen("new-task")}
                stats={stats}
              />
            )}
            {screen === "task-detail" && selectedTask && (
              <TaskDetailScreen
                task={selectedTask}
                role={role}
                onBack={() => setScreen("tasks")}
                onApprove={handleApprove}
                onReject={handleReject}
                onStartWork={(id) => {
                  setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "in_progress" } : t));
                  setScreen("tasks");
                }}
              />
            )}
            {screen === "camera" && (
              <CameraScreen step={cameraStep} setStep={setCameraStep} tasks={tasks} setTasks={setTasks} />
            )}
            {screen === "review" && (
              <ReviewScreen
                tasks={tasks}
                tab={reviewTab}
                setTab={setReviewTab}
                onApprove={handleApprove}
                onReject={handleReject}
                onTaskClick={(t) => { setSelectedTask(t); setScreen("task-detail"); }}
              />
            )}
            {screen === "notifications" && (
              <NotificationsScreen notifications={notifications} onMarkAll={markAllRead} />
            )}
            {screen === "manager-profile" && (
              <ManagerProfileScreen stats={stats} tasks={tasks} />
            )}
            {screen === "profile" && (
              <ExecutorProfileScreen tasks={tasks} />
            )}
            {screen === "new-task" && (
              <NewTaskScreen
                newTask={newTask}
                setNewTask={setNewTask}
                onCreate={handleCreateTask}
                onBack={() => setScreen("tasks")}
              />
            )}
          </div>
          <BottomNav activeTab={activeTab} onNav={handleNav} role={role} unreadCount={unreadCount} />
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin, showRoleSelect, setShowRoleSelect, email, setEmail, password, setPassword }: {
  onLogin: (role: Role) => void;
  showRoleSelect: boolean;
  setShowRoleSelect: (v: boolean) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
}) {
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

        {!showRoleSelect ? (
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.ru" className="input-field" />
            </div>
            <div>
              <label className="field-label">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field" />
            </div>
            <button onClick={() => setShowRoleSelect(true)} className="btn-primary w-full mt-2">
              Войти
              <Icon name="ArrowRight" size={18} />
            </button>
            <p className="text-center text-white/40 text-xs">
              Забыли пароль? <span className="text-violet-400 cursor-pointer">Восстановить</span>
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-scale-in">
            <p className="text-white/60 text-center text-sm mb-5">Выберите вашу роль в системе</p>
            <button onClick={() => onLogin("manager")} className="role-card group">
              <div className="role-icon bg-gradient-to-br from-violet-500 to-indigo-600">
                <Icon name="LayoutDashboard" size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-base">Менеджер</div>
                <div className="text-white/50 text-xs">Создаю задачи и проверяю отчёты</div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </button>
            <button onClick={() => onLogin("executor")} className="role-card group">
              <div className="role-icon bg-gradient-to-br from-cyan-500 to-blue-600">
                <Icon name="Hammer" size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-semibold text-base">Исполнитель</div>
                <div className="text-white/50 text-xs">Выполняю задачи и отправляю фото</div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </button>
            <button onClick={() => setShowRoleSelect(false)} className="text-white/40 text-xs w-full text-center mt-2 hover:text-white/60 transition-colors">
              ← Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TasksScreen({ tasks, allTasks, filterStatus, setFilterStatus, role, onTaskClick, onNewTask, stats }: {
  tasks: Task[];
  allTasks: Task[];
  filterStatus: TaskStatus | "all";
  setFilterStatus: (s: TaskStatus | "all") => void;
  role: Role;
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
          <button
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="task-card animate-fade-in w-full text-left"
            style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
          >
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
                  <span className="flex items-center gap-1">
                    <Icon name="MapPin" size={11} />
                    {task.location.split(",")[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={11} />
                    {task.deadline}
                  </span>
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

function TaskDetailScreen({ task, role, onBack, onApprove, onReject, onStartWork }: {
  task: Task;
  role: Role;
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
          <div className="p-3 flex items-center gap-2 text-xs text-white/40">
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

function CameraScreen({ step, setStep, tasks, setTasks }: {
  step: "intro" | "photo" | "location" | "done";
  setStep: (s: "intro" | "photo" | "location" | "done") => void;
  tasks: Task[];
  setTasks: (fn: (prev: Task[]) => Task[]) => void;
}) {
  const myTask = tasks.find((t) => t.status === "in_progress") || tasks[0];

  function handleSubmit() {
    if (myTask) {
      setTasks((prev) => prev.map((t) => t.id === myTask.id ? {
        ...t,
        status: "review",
        photoUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80"
      } : t));
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
                <p className="text-white/30 text-xs">Наведите на объект</p>
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
          <button onClick={() => setStep("intro")} className="btn-secondary w-full mt-4">
            Новый отчёт
          </button>
        </div>
      )}
    </div>
  );
}

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
                    <Icon name="MapPin" size={11} />
                    GPS ✓
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
                    <Icon name="Check" size={15} />
                    Утвердить
                  </button>
                  <button onClick={() => onReject(task.id)} className="btn-danger flex-1 text-sm py-2">
                    <Icon name="X" size={15} />
                    Отклонить
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
          <div
            key={n.id}
            className={`notif-card animate-fade-in`}
            style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
          >
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

function ManagerProfileScreen({ stats, tasks }: {
  stats: { total: number; approved: number; inProgress: number; review: number; approvalRate: number };
  tasks: Task[];
}) {
  const employees = [
    { name: "Анна Петрова", avatar: "АП", tasks: tasks.filter((t) => t.assignee === "Анна Петрова"), color: "from-pink-500 to-rose-600" },
    { name: "Дмитрий Козлов", avatar: "ДК", tasks: tasks.filter((t) => t.assignee === "Дмитрий Козлов"), color: "from-cyan-500 to-blue-600" },
    { name: "Мария Сидорова", avatar: "МС", tasks: tasks.filter((t) => t.assignee === "Мария Сидорова"), color: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="screen-content animate-fade-in">
      <div className="screen-header">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Профиль</h1>
          <p className="text-white/50 text-sm">Менеджер</p>
        </div>
      </div>

      <div className="manager-hero mb-6">
        <div className="manager-avatar">АМ</div>
        <div>
          <h2 className="text-white font-display font-bold text-lg">Алексей Михайлов</h2>
          <p className="text-white/50 text-sm">Старший менеджер</p>
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
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${emp.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {emp.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{emp.name}</p>
                  <p className="text-white/40 text-xs">Задач: {emp.tasks.length} · Выполнено: {done}</p>
                </div>
                <span className="text-emerald-400 font-bold text-sm">{rate}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExecutorProfileScreen({ tasks }: { tasks: Task[] }) {
  const myTasks = tasks.filter((t) => t.assignee === "Анна Петрова");
  const done = myTasks.filter((t) => t.status === "approved").length;
  const rate = myTasks.length > 0 ? Math.round((done / myTasks.length) * 100) : 0;

  return (
    <div className="screen-content animate-fade-in">
      <div className="screen-header">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Профиль</h1>
          <p className="text-white/50 text-sm">Исполнитель</p>
        </div>
      </div>

      <div className="manager-hero mb-6">
        <div className="executor-avatar">АП</div>
        <div>
          <h2 className="text-white font-display font-bold text-lg">Анна Петрова</h2>
          <p className="text-white/50 text-sm">Старший специалист</p>
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

      <div className="glass-card p-5 mb-4">
        <h3 className="text-white font-semibold mb-3">Моя эффективность</h3>
        <div className="space-y-3">
          {[
            { label: "Выполнение в срок", val: 87 },
            { label: "Одобрение с первого раза", val: rate },
            { label: "Фото-отчёты", val: 100 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">{item.label}</span>
                <span className="text-white font-semibold">{item.val}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewTaskScreen({ newTask, setNewTask, onCreate, onBack }: {
  newTask: { title: string; description: string; assignee: string; deadline: string; location: string; priority: "high" | "medium" | "low"; category: string };
  setNewTask: (fn: (prev: typeof newTask) => typeof newTask) => void;
  onCreate: () => void;
  onBack: () => void;
}) {
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
          <textarea className="input-field resize-none" rows={3} placeholder="Подробное описание задачи..." value={newTask.description} onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))} />
        </div>
        <div>
          <label className="field-label">Исполнитель</label>
          <input className="input-field" placeholder="Имя исполнителя" value={newTask.assignee} onChange={(e) => setNewTask((p) => ({ ...p, assignee: e.target.value }))} />
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
              <button
                key={p.key}
                onClick={() => setNewTask((prev) => ({ ...prev, priority: p.key }))}
                className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all ${newTask.priority === p.key ? p.active : p.inactive}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={onCreate}
          disabled={!newTask.title}
          className="btn-primary w-full mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name="Plus" size={18} />
          Создать задачу
        </button>
      </div>
    </div>
  );
}

function BottomNav({ activeTab, onNav, role, unreadCount }: {
  activeTab: string;
  onNav: (tab: "tasks" | "camera" | "review" | "profile" | "notifications") => void;
  role: Role;
  unreadCount: number;
}) {
  const allItems: { key: "tasks" | "camera" | "review" | "profile" | "notifications"; icon: string; label: string; roles?: Role[] }[] = [
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
        <button
          key={item.key}
          onClick={() => onNav(item.key)}
          className={`nav-item ${activeTab === item.key ? "nav-item-active" : "nav-item-inactive"}`}
        >
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
