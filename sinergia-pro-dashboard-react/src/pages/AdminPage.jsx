import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./AdminPage.css"; // Importa o CSS para esta página
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminPage() {
  // Consome o AuthContext para obter user e logout
  const authContext = useContext(AuthContext);
  const user = authContext?.user || { name: "Admin" }; // Garante que user não seja undefined
  const logout = authContext?.logout || (() => {
    // Fallback para logout se não estiver disponível no contexto
    console.warn("Logout function not available in AuthContext. Redirecting to /login.");
    window.location.href = "/login";
  });
  const navigate = useNavigate();

  // Estados gerais da página
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activePage, setActivePage] = useState("dashboard"); // Aba ativa
  const [period, setPeriod] = useState("mensal"); // Período do dashboard

  // Estados para dados financeiros e transações
  const [financialData, setFinancialData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [kpis, setKpis] = useState({
    totalReceita: 0,
    totalDespesa: 0,
    lucroLiquido: 0,
    sessoesPagas: 0,
  });

  // Estados dos formulários de cadastro
  const [receiptForm, setReceiptForm] = useState({
    descricao: "",
    valor: "",
    data: "",
    categoria: "Consultas",
    paciente: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    descricao: "",
    valor: "",
    data: "",
    categoria: "Infraestrutura",
  });

  const [invoiceForm, setInvoiceForm] = useState({
    numero: "",
    fornecedor: "",
    valor: "",
    data: "",
    descricao: "",
    arquivo: null, // Para upload de arquivo
  });

  // --- Dados Mock (para demonstração sem API) ---
  const mockFinancialData = {
    diario: [
      { data: "01/11", receita: 1200, despesa: 400, lucro: 800 },
      { data: "02/11", receita: 1500, despesa: 450, lucro: 1050 },
      { data: "03/11", receita: 1800, despesa: 500, lucro: 1300 },
      { data: "04/11", receita: 1400, despesa: 420, lucro: 980 },
      { data: "05/11", receita: 2000, despesa: 600, lucro: 1400 },
      { data: "06/11", receita: 1600, despesa: 480, lucro: 1120 },
      { data: "07/11", receita: 1900, despesa: 550, lucro: 1350 },
    ],
    semanal: [
      { semana: "Semana 1", receita: 8500, despesa: 2550, lucro: 5950 },
      { semana: "Semana 2", receita: 9200, despesa: 2760, lucro: 6440 },
      { semana: "Semana 3", receita: 8800, despesa: 2640, lucro: 6160 },
      { semana: "Semana 4", receita: 10100, despesa: 3030, lucro: 7070 },
    ],
    mensal: [
      { mes: "Jan", receita: 35000, despesa: 10500, lucro: 24500 },
      { mes: "Fev", receita: 38000, despesa: 11400, lucro: 26600 },
      { mes: "Mar", receita: 42000, despesa: 12600, lucro: 29400 },
      { mes: "Abr", receita: 39000, despesa: 11700, lucro: 27300 },
      { mes: "Mai", receita: 45000, despesa: 13500, lucro: 31500 },
      { mes: "Jun", receita: 48000, despesa: 14400, lucro: 33600 },
      { mes: "Jul", receita: 52000, despesa: 15600, lucro: 36400 },
      { mes: "Ago", receita: 50000, despesa: 15000, lucro: 35000 },
      { mes: "Set", receita: 48000, despesa: 14400, lucro: 33600 },
      { mes: "Out", receita: 51000, despesa: 15300, lucro: 35700 },
      { mes: "Nov", receita: 49000, despesa: 14700, lucro: 34300 },
    ],
    anual: [
      { ano: "2022", receita: 420000, despesa: 126000, lucro: 294000 },
      { ano: "2023", receita: 520000, despesa: 156000, lucro: 364000 },
      { ano: "2024", receita: 580000, despesa: 174000, lucro: 406000 },
      { ano: "2025", receita: 245000, despesa: 73500, lucro: 171500 },
    ],
  };

  const mockTransactions = [
    {
      id: 1,
      tipo: "receita",
      descricao: "Sessão Terapêutica - João Silva",
      valor: 150,
      data: "26/11/2025",
      categoria: "Consultas",
      paciente: "João Silva",
    },
    {
      id: 2,
      tipo: "despesa",
      descricao: "Aluguel do Consultório",
      valor: 2000,
      data: "26/11/2025",
      categoria: "Infraestrutura",
    },
    {
      id: 3,
      tipo: "receita",
      descricao: "Sessão Terapêutica - Maria Santos",
      valor: 150,
      data: "25/11/2025",
      categoria: "Consultas",
      paciente: "Maria Santos",
    },
    {
      id: 4,
      tipo: "despesa",
      descricao: "Material de Escritório",
      valor: 250,
      data: "25/11/2025",
      categoria: "Suprimentos",
    },
    {
      id: 5,
      tipo: "receita",
      descricao: "Sessão Terapêutica - Pedro Costa",
      valor: 150,
      data: "24/11/2025",
      categoria: "Consultas",
      paciente: "Pedro Costa",
    },
    {
      id: 6,
      tipo: "despesa",
      descricao: "Software de Gestão",
      valor: 500,
      data: "24/11/2025",
      categoria: "Tecnologia",
    },
    {
      id: 7,
      tipo: "receita",
      descricao: "Sessão Terapêutica - Ana Lima",
      valor: 150,
      data: "23/11/2025",
      categoria: "Consultas",
      paciente: "Ana Lima",
    },
    {
      id: 8,
      tipo: "despesa",
      descricao: "Treinamento de Equipe",
      valor: 800,
      data: "23/11/2025",
      categoria: "Desenvolvimento",
    },
  ];

  const mockInvoices = [
    {
      id: 1,
      numero: "NF-001",
      fornecedor: "Empresa A",
      valor: 1200,
      data: "26/11/2025",
      descricao: "Material de Consumo",
      arquivo: "nf_001.pdf",
    },
    {
      id: 2,
      numero: "NF-002",
      fornecedor: "Empresa B",
      valor: 800,
      data: "25/11/2025",
      descricao: "Serviços de Limpeza",
      arquivo: "nf_002.pdf",
    },
    {
      id: 3,
      numero: "NF-003",
      fornecedor: "Empresa C",
      valor: 500,
      data: "24/11/2025",
      descricao: "Manutenção de Equipamentos",
      arquivo: "nf_003.pdf",
    },
  ];

  const mockAdmins = [
    {
      id: 1,
      email: "admin@example.com",
      name: "Admin Master",
      role: "admin_master",
      is_approved: true,
    },
    {
      id: 2,
      email: "admin2@example.com",
      name: "Admin Financeiro",
      role: "admin",
      is_approved: true,
    },
    {
      id: 3,
      email: "admin3@example.com",
      name: "Admin Operacional",
      role: "admin",
      is_approved: false,
    },
  ];
  // --- Fim Dados Mock ---

  // Efeitos ao carregar a página e ao mudar o período
  useEffect(() => {
    fetchAdmins();
    loadFinancialData();
    setInvoices(mockInvoices); // Carrega as notas fiscais mock
    setTransactions(mockTransactions); // Carrega as transações mock
  }, []);

  useEffect(() => {
    loadFinancialData();
  }, [period]);

  // Função para carregar administradores (usando mock por enquanto)
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // Em um cenário real, aqui você faria uma chamada à API:
      // const response = await fetch("http://localhost:8000/api/admin/all-users", {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      //   },
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   setAdmins(data.filter((u) => u.role === "admin" || u.role === "admin_master"));
      // } else {
      //   setError("Erro ao carregar administradores da API.");
      // }

      // Usando dados mock para demonstração
      setAdmins(mockAdmins);
    } catch (err) {
      setError("Erro ao carregar administradores (mock ou API).");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar dados financeiros e calcular KPIs
  const loadFinancialData = () => {
    const data = mockFinancialData[period];
    setFinancialData(data);

    const totalReceita = data.reduce((sum, item) => sum + item.receita, 0);
    const totalDespesa = data.reduce((sum, item) => sum + item.despesa, 0);
    const lucroLiquido = totalReceita - totalDespesa;
    const sessoesPagas = mockTransactions.filter(
      (t) => t.tipo === "receita" && t.categoria === "Consultas"
    ).length;

    setKpis({
      totalReceita,
      totalDespesa,
      lucroLiquido,
      sessoesPagas,
    });
  };

  // --- Handlers para formulários ---
  const handleReceiptChange = (e) => {
    const { name, value } = e.target;
    setReceiptForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReceiptSubmit = (e) => {
    e.preventDefault();
    if (!receiptForm.descricao || !receiptForm.valor || !receiptForm.data) {
      setError("Preencha todos os campos obrigatórios para a receita!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    // Lógica para adicionar a receita (mock ou API)
    console.log("Nova Receita:", receiptForm);
    setSuccess("✅ Receita cadastrada com sucesso!");
    setReceiptForm({
      descricao: "",
      valor: "",
      data: "",
      categoria: "Consultas",
      paciente: "",
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.descricao || !expenseForm.valor || !expenseForm.data) {
      setError("Preencha todos os campos obrigatórios para a despesa!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    // Lógica para adicionar a despesa (mock ou API)
    console.log("Nova Despesa:", expenseForm);
    setSuccess("✅ Despesa cadastrada com sucesso!");
    setExpenseForm({
      descricao: "",
      valor: "",
      data: "",
      categoria: "Infraestrutura",
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleInvoiceChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "arquivo") {
      setInvoiceForm((prev) => ({ ...prev, arquivo: files[0] }));
    } else {
      setInvoiceForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInvoiceSubmit = (e) => {
    e.preventDefault();
    if (
      !invoiceForm.numero ||
      !invoiceForm.fornecedor ||
      !invoiceForm.valor ||
      !invoiceForm.data
    ) {
      setError("Preencha todos os campos obrigatórios para a nota fiscal!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    // Lógica para adicionar a nota fiscal (mock ou API)
    console.log("Nova Nota Fiscal:", invoiceForm);
    setSuccess("✅ Nota Fiscal cadastrada com sucesso!");
    setInvoiceForm({
      numero: "",
      fornecedor: "",
      valor: "",
      data: "",
      descricao: "",
      arquivo: null,
    });
    setTimeout(() => setSuccess(""), 3000);
  };
  // --- Fim Handlers para formulários ---

  // Função para exportar transações para CSV
  const exportToCSV = () => {
    const headers = ["ID", "Tipo", "Descrição", "Valor", "Data", "Categoria"];
    const rows = transactions.map((t) => [
      t.id,
      t.tipo,
      t.descricao,
      t.valor,
      t.data,
      t.categoria,
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_financeiro_${period}.csv`;
    a.click();
  };

  // Função para logout
  const handleLogout = () => {
  if (window.confirm("Tem certeza que deseja sair?")) {
    logout();
    navigate("/pages/LoginPage");
   }
  };

  const handleBack = () => {
  navigate("/pages/LoginPage");
  };

  // Cores para os gráficos (Recharts)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const categoryData = [
    { name: "Infraestrutura", value: 2000 },
    { name: "Suprimentos", value: 250 },
    { name: "Tecnologia", value: 500 },
    { name: "Desenvolvimento", value: 800 },
    { name: "Outros", value: 450 },
  ];

  return (
    <div className="admin-page-container">
      {/* HEADER COM BOTÕES DE AÇÃO */}
      <div className="admin-page-header">
        <div className="header-left">
          <h1>🔐 Painel do Administrador</h1>
          <p>Gerenciamento completo do sistema e financeiro</p>
        </div>
        <div className="header-right">
          <span className="user-info">👤 {user.name || "Admin"}</span>
          <button className="btn-back" onClick={handleBack} title="Voltar">
            ← Voltar
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </div>

      {/* MENSAGENS DE ERRO E SUCESSO */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button
            className="close-alert"
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
          <button
            className="close-alert"
            onClick={() => setSuccess("")}
          >
            ✕
          </button>
        </div>
      )}

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activePage === "dashboard" ? "active" : ""}`}
          onClick={() => setActivePage("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab-button ${activePage === "receitas" ? "active" : ""}`}
          onClick={() => setActivePage("receitas")}
        >
          📈 Receitas
        </button>
        <button
          className={`tab-button ${activePage === "despesas" ? "active" : ""}`}
          onClick={() => setActivePage("despesas")}
        >
          📉 Despesas
        </button>
        <button
          className={`tab-button ${activePage === "transacoes" ? "active" : ""}`}
          onClick={() => setActivePage("transacoes")}
        >
          💰 Transações
        </button>
        <button
          className={`tab-button ${activePage === "notas" ? "active" : ""}`}
          onClick={() => setActivePage("notas")}
        >
          📄 Notas Fiscais
        </button>
        <button
          className={`tab-button ${activePage === "admins" ? "active" : ""}`}
          onClick={() => setActivePage("admins")}
        >
          👥 Administradores
        </button>
      </div>

      {/* CONTEÚDO DA ABA: DASHBOARD */}
      {activePage === "dashboard" && (
        <div className="dashboard-container">
          <div className="kpi-grid">
            <div className="kpi-card kpi-receita">
              <div className="kpi-icon">📈</div>
              <div className="kpi-content">
                <h3>Receita Total</h3>
                <p className="kpi-value">R$ {kpis.totalReceita.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className="kpi-card kpi-despesa">
              <div className="kpi-icon">📉</div>
              <div className="kpi-content">
                <h3>Despesa Total</h3>
                <p className="kpi-value">R$ {kpis.totalDespesa.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className="kpi-card kpi-lucro">
              <div className="kpi-icon">💵</div>
              <div className="kpi-content">
                <h3>Lucro Líquido</h3>
                <p className="kpi-value">R$ {kpis.lucroLiquido.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className="kpi-card kpi-sessoes">
              <div className="kpi-icon">🎯</div>
              <div className="kpi-content">
                <h3>Sessões Pagas</h3>
                <p className="kpi-value">{kpis.sessoesPagas}</p>
              </div>
            </div>
          </div>

          <div className="filter-container">
            <label>📅 Período:</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div className="charts-grid">
            <div className="chart-container">
              <h3>📈 Evolução Financeira</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      period === "diario"
                        ? "data"
                        : period === "semanal"
                        ? "semana"
                        : period === "mensal"
                        ? "mes"
                        : "ano"
                    }
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    stroke="#00C49F"
                    name="Receita"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="despesa"
                    stroke="#FF8042"
                    name="Despesa"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="lucro"
                    stroke="#0088FE"
                    name="Lucro"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>📊 Comparativo Receita vs Despesa</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      period === "diario"
                        ? "data"
                        : period === "semanal"
                        ? "semana"
                        : period === "mensal"
                        ? "mes"
                        : "ano"
                    }
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Bar dataKey="receita" fill="#00C49F" name="Receita" />
                  <Bar dataKey="despesa" fill="#FF8042" name="Despesa" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>🥧 Distribuição de Despesas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA: CADASTRO DE RECEITAS */}
      {activePage === "receitas" && (
        <div className="form-container">
          <div className="form-header">
            <h2>📈 Cadastro de Receitas</h2>
            <p>Registre novas receitas do sistema</p>
          </div>

          <form className="admin-form" onSubmit={handleReceiptSubmit}>
            <div className="form-group">
              <label>Descrição *</label>
              <input
                type="text"
                name="descricao"
                value={receiptForm.descricao}
                onChange={handleReceiptChange}
                placeholder="Ex: Sessão Terapêutica"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Valor (R$) *</label>
                <input
                  type="number"
                  name="valor"
                  value={receiptForm.valor}
                  onChange={handleReceiptChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Data *</label>
                <input
                  type="date"
                  name="data"
                  value={receiptForm.data}
                  onChange={handleReceiptChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select
                  name="categoria"
                  value={receiptForm.categoria}
                  onChange={handleReceiptChange}
                >
                  <option value="Consultas">Consultas</option>
                  <option value="Avaliações">Avaliações</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Paciente (Opcional)</label>
              <input
                type="text"
                name="paciente"
                value={receiptForm.paciente}
                onChange={handleReceiptChange}
                placeholder="Nome do paciente"
              />
            </div>

            <button type="submit" className="btn-submit">
              ✅ Cadastrar Receita
            </button>
          </form>
        </div>
      )}

      {/* CONTEÚDO DA ABA: CADASTRO DE DESPESAS */}
      {activePage === "despesas" && (
        <div className="form-container">
          <div className="form-header">
            <h2>📉 Cadastro de Despesas</h2>
            <p>Registre as despesas da empresa</p>
          </div>

          <form className="admin-form" onSubmit={handleExpenseSubmit}>
            <div className="form-group">
              <label>Descrição *</label>
              <input
                type="text"
                name="descricao"
                value={expenseForm.descricao}
                onChange={handleExpenseChange}
                placeholder="Ex: Aluguel, Salários, etc"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Valor (R$) *</label>
                <input
                  type="number"
                  name="valor"
                  value={expenseForm.valor}
                  onChange={handleExpenseChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Data *</label>
                <input
                  type="date"
                  name="data"
                  value={expenseForm.data}
                  onChange={handleExpenseChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select
                  name="categoria"
                  value={expenseForm.categoria}
                  onChange={handleExpenseChange}
                >
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Suprimentos">Suprimentos</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Desenvolvimento">Desenvolvimento</option>
                  <option value="Salários">Salários</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-submit">
              ✅ Cadastrar Despesa
            </button>
          </form>
        </div>
      )}

      {/* CONTEÚDO DA ABA: TRANSAÇÕES */}
      {activePage === "transacoes" && (
        <div className="financeiro-container">
          <div className="financeiro-header">
            <h2>💰 Transações Financeiras</h2>
            <button className="export-button" onClick={exportToCSV}>
              📥 Exportar CSV
            </button>
          </div>

          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className={`type-${transaction.tipo}`}
                  >
                    <td>{transaction.id}</td>
                    <td>
                      <span className={`badge badge-${transaction.tipo}`}>
                        {transaction.tipo === "receita"
                          ? "💰 Receita"
                          : "💸 Despesa"}
                      </span>
                    </td>
                    <td>{transaction.descricao}</td>
                    <td className={`valor ${transaction.tipo}`}>
                      {transaction.tipo === "receita" ? "+" : "-"} R$ {transaction.valor.toLocaleString("pt-BR")}
                    </td>
                    <td>{transaction.data}</td>
                    <td>
                      <span className="category-badge">
                        {transaction.categoria}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA: NOTAS FISCAIS */}
      {activePage === "notas" && (
        <div className="notas-container">
          <div className="notas-header">
            <h2>📄 Gerenciamento de Notas Fiscais</h2>
          </div>

          <div className="form-container">
            <div className="form-header">
              <h3>➕ Cadastrar Nova Nota Fiscal</h3>
            </div>

            <form className="admin-form" onSubmit={handleInvoiceSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Número da NF *</label>
                  <input
                    type="text"
                    name="numero"
                    value={invoiceForm.numero}
                    onChange={handleInvoiceChange}
                    placeholder="Ex: NF-001"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Fornecedor *</label>
                  <input
                    type="text"
                    name="fornecedor"
                    value={invoiceForm.fornecedor}
                    onChange={handleInvoiceChange}
                    placeholder="Nome da empresa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Valor (R$) *</label>
                  <input
                    type="number"
                    name="valor"
                    value={invoiceForm.valor}
                    onChange={handleInvoiceChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data *</label>
                  <input
                    type="date"
                    name="data"
                    value={invoiceForm.data}
                    onChange={handleInvoiceChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  name="descricao"
                  value={invoiceForm.descricao}
                  onChange={handleInvoiceChange}
                  placeholder="Descrição dos produtos/serviços"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Arquivo (PDF/Imagem)</label>
                <input
                  type="file"
                  name="arquivo"
                  onChange={handleInvoiceChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <button type="submit" className="btn-submit">
                ✅ Cadastrar Nota Fiscal
              </button>
            </form>
          </div>

          <div className="notas-list">
            <h3>📋 Notas Fiscais Registradas</h3>
            <div className="notas-table-container">
              <table className="notas-table">
                <thead>
                  <tr>
                    <th>NF</th>
                    <th>Fornecedor</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <strong>{invoice.numero}</strong>
                      </td>
                      <td>{invoice.fornecedor}</td>
                      <td>R$ {invoice.valor.toLocaleString("pt-BR")}</td>
                      <td>{invoice.data}</td>
                      <td>{invoice.descricao}</td>
                      <td>
                        <button className="btn-small btn-download">
                          📥 Baixar
                        </button>
                        <button className="btn-small btn-delete">🗑️ Deletar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA: ADMINISTRADORES */}
      {activePage === "admins" && (
        <div className="admins-container">
          <h2>👥 Administradores do Sistema</h2>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="admins-list">
              <h3>Total de Administradores: {admins.length}</h3>
              {admins.length > 0 ? (
                <table className="admins-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Nome</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td>{admin.id}</td>
                        <td>{admin.email}</td>
                        <td>{admin.name}</td>
                        <td>
                          <span
                            className={`role-badge ${
                              admin.role === "admin_master" ? "master" : "admin"
                            }`}
                          >
                            {admin.role === "admin_master" ? "Master" : "Admin"}
                          </span>
                        </td>
                        <td>
                          {admin.is_approved ? (
                            <span className="status-approved">
                              ✅ Aprovado
                            </span>
                          ) : (
                            <span className="status-pending">
                              ⏳ Pendente
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Nenhum administrador encontrado.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPage;