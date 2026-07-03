import { useState } from "react";
import { Users, ArrowLeftRight, PieChart } from "lucide-react";
import "./App.css";
import { CadastroPessoas } from "./components/CadastroPessoas";
import { CadastroTransacoes } from "./components/CadastroTransacoes";
import { ConsultaTotais } from "./components/ConsultaTotais";

type Aba = "pessoas" | "transacoes" | "totais";

const ABAS = [
  { id: "pessoas", rotulo: "Pessoas", Icone: Users },
  { id: "transacoes", rotulo: "Transações", Icone: ArrowLeftRight },
  { id: "totais", rotulo: "Totais", Icone: PieChart },
] as const;

function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("pessoas");

  return (
    <div className="container">
      <header className="app-header">
        <img className="app-logo" src="/expense.png" alt="Logo" />
        <div>
          <h1>Controle de Gastos Residenciais</h1>
          <p>Gerencie pessoas, transações e acompanhe os totais do domicílio</p>
        </div>
      </header>

      <nav className="abas">
        {ABAS.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            className={id === abaAtiva ? "aba aba-ativa" : "aba"}
            onClick={() => setAbaAtiva(id)}
          >
            <Icone size={17} />
            <span>{rotulo}</span>
          </button>
        ))}
      </nav>

      <main>
        {abaAtiva === "pessoas" && <CadastroPessoas />}
        {abaAtiva === "transacoes" && <CadastroTransacoes />}
        {abaAtiva === "totais" && <ConsultaTotais />}
      </main>
    </div>
  );
}

export default App;
