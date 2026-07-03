import { useState } from "react";
import { Wallet, Users, ArrowLeftRight, PieChart } from "lucide-react";
import "./App.css";
import { CadastroPessoas } from "./components/CadastroPessoas";
import { CadastroTransacoes } from "./components/CadastroTransacoes";
import { ConsultaTotais } from "./components/ConsultaTotais";

type Aba = "pessoas" | "transacoes" | "totais";

const ABAS: { id: Aba; rotulo: string; Icone: typeof Users }[] = [
  { id: "pessoas", rotulo: "Pessoas", Icone: Users },
  { id: "transacoes", rotulo: "Transações", Icone: ArrowLeftRight },
  { id: "totais", rotulo: "Totais", Icone: PieChart },
];

function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("pessoas");

  return (
    <div className="container">
      <header className="app-header">
        <div className="app-logo">
          <Wallet size={26} strokeWidth={2.2} />
        </div>
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
        {/* Cada aba é montada sob demanda: ao trocar de aba, o componente busca dados
            atualizados da API, garantindo que os totais reflitam pessoas/transações recém-criadas.
            A `key` reinicia a animação de entrada a cada troca de aba. */}
        {abaAtiva === "pessoas" && <CadastroPessoas key="pessoas" />}
        {abaAtiva === "transacoes" && <CadastroTransacoes key="transacoes" />}
        {abaAtiva === "totais" && <ConsultaTotais key="totais" />}
      </main>
    </div>
  );
}

export default App;
