import { useEffect, useState } from "react";
import { PieChart, RefreshCw, TrendingUp, TrendingDown, Wallet, AlertCircle, Users } from "lucide-react";
import { obterTotais } from "../api";
import type { ConsultaTotais as Totais } from "../types";
import { formatarMoeda, iniciais } from "../utils";

function classeSaldo(saldo: number): string {
  return saldo < 0 ? "saldo-negativo" : "saldo-positivo";
}

// Tela de totais: cartões com o total geral no topo e uma tabela com o total de cada pessoa.
export function ConsultaTotais() {
  const [dados, setDados] = useState<Totais | null>(null);
  const [erro, setErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);

  async function carregar() {
    setAtualizando(true);
    try {
      setDados(await obterTotais());
      setErro("");
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const temPessoas = dados !== null && dados.pessoas.length > 0;

  return (
    <section className="cartao">
      <div className="secao-cabecalho">
        <div className="secao-titulo">
          <span className="icone-titulo">
            <PieChart size={20} />
          </span>
          <h2>Consulta de Totais</h2>
        </div>
        <button className="botao-secundario" onClick={carregar} disabled={atualizando}>
          <RefreshCw size={15} className={atualizando ? "icone-girando" : undefined} />
          Atualizar
        </button>
      </div>

      {erro && (
        <p className="mensagem mensagem-erro">
          <AlertCircle size={16} />
          {erro}
        </p>
      )}

      {dados && (
        <div className="resumo-cards">
          <div className="resumo-card card-receita">
            <span className="resumo-icone">
              <TrendingUp size={20} />
            </span>
            <div className="resumo-rotulo">Total de receitas</div>
            <div className="resumo-valor">{formatarMoeda(dados.totalReceitasGeral)}</div>
          </div>
          <div className="resumo-card card-despesa">
            <span className="resumo-icone">
              <TrendingDown size={20} />
            </span>
            <div className="resumo-rotulo">Total de despesas</div>
            <div className="resumo-valor">{formatarMoeda(dados.totalDespesasGeral)}</div>
          </div>
          <div className="resumo-card card-saldo">
            <span className="resumo-icone">
              <Wallet size={20} />
            </span>
            <div className="resumo-rotulo">Saldo líquido</div>
            <div className={`resumo-valor ${classeSaldo(dados.saldoGeral)}`}>
              {formatarMoeda(dados.saldoGeral)}
            </div>
          </div>
        </div>
      )}

      {dados && !temPessoas ? (
        <div className="estado-vazio">
          <Users size={40} strokeWidth={1.5} />
          <p>Nenhuma pessoa cadastrada ainda.</p>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th className="numero">Receitas</th>
                <th className="numero">Despesas</th>
                <th className="numero">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {dados?.pessoas.map((pessoa) => (
                <tr key={pessoa.pessoaId}>
                  <td>
                    <div className="celula-pessoa">
                      <span className="avatar">{iniciais(pessoa.nome)}</span>
                      {pessoa.nome}
                    </div>
                  </td>
                  <td className="numero saldo-positivo">{formatarMoeda(pessoa.totalReceitas)}</td>
                  <td className="numero saldo-negativo">{formatarMoeda(pessoa.totalDespesas)}</td>
                  <td className={`numero ${classeSaldo(pessoa.saldo)}`}>{formatarMoeda(pessoa.saldo)}</td>
                </tr>
              ))}
            </tbody>
            {temPessoas && (
              <tfoot>
                <tr className="linha-total-geral">
                  <td>Total geral</td>
                  <td className="numero">{formatarMoeda(dados!.totalReceitasGeral)}</td>
                  <td className="numero">{formatarMoeda(dados!.totalDespesasGeral)}</td>
                  <td className={`numero ${classeSaldo(dados!.saldoGeral)}`}>
                    {formatarMoeda(dados!.saldoGeral)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </section>
  );
}
