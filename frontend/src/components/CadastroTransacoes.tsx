import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeftRight,
  User,
  FileText,
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  AlertCircle,
  Info,
  Receipt,
} from "lucide-react";
import { transacoesApi } from "../api/transacoes";
import { pessoasApi } from "../api/pessoas";
import { ApiError } from "../api/client";
import type { Pessoa, Transacao, TipoTransacao } from "../types";
import { formatarMoeda, iniciais } from "../utils/formatters";

/**
 * Tela de cadastro de transações: formulário de criação + listagem (sem edição/deleção,
 * conforme especificação). A regra "menor de idade só pode despesa" é refletida aqui na UI
 * (desabilitando a opção "Receita") e é validada de novo pelo backend, que é a fonte da verdade.
 */
export function CadastroTransacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoaId, setPessoaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const pessoaSelecionada = useMemo(
    () => pessoas.find((p) => p.id === pessoaId),
    [pessoas, pessoaId]
  );
  const pessoaEhMenorDeIdade = pessoaSelecionada !== undefined && pessoaSelecionada.idade < 18;

  async function carregarDados() {
    const [listaPessoas, listaTransacoes] = await Promise.all([
      pessoasApi.listar(),
      transacoesApi.listar(),
    ]);
    setPessoas(listaPessoas);
    setTransacoes(listaTransacoes);
  }

  useEffect(() => {
    carregarDados().catch((e) => setErro(e instanceof ApiError ? e.message : "Falha ao carregar dados."));
  }, []);

  // Se a pessoa selecionada for menor de idade e o tipo escolhido for Receita,
  // força de volta para Despesa — mantém o formulário sempre consistente com a regra de negócio.
  useEffect(() => {
    if (pessoaEhMenorDeIdade && tipo === "Receita") {
      setTipo("Despesa");
    }
  }, [pessoaEhMenorDeIdade, tipo]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!pessoaId || !descricao.trim() || valor === "") {
      setErro("Preencha pessoa, descrição e valor.");
      return;
    }

    setCarregando(true);
    try {
      await transacoesApi.criar({
        descricao: descricao.trim(),
        valor: Number(valor),
        tipo,
        pessoaId,
      });
      setDescricao("");
      setValor("");
      await carregarDados();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Falha ao cadastrar transação.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <section className="cartao">
      <div className="secao-cabecalho">
        <div className="secao-titulo">
          <span className="icone-titulo">
            <ArrowLeftRight size={20} />
          </span>
          <h2>Cadastro de Transações</h2>
        </div>
      </div>

      <form className="form-linha" onSubmit={handleSubmit}>
        <div className="campo campo-pessoa">
          <span className="campo-icone">
            <User size={16} />
          </span>
          <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
            <option value="">Selecione a pessoa</option>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome} ({pessoa.idade} anos)
              </option>
            ))}
          </select>
        </div>

        <div className="campo campo-descricao">
          <span className="campo-icone">
            <FileText size={16} />
          </span>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="campo campo-valor">
          <span className="campo-icone">
            <DollarSign size={16} />
          </span>
          <input
            type="number"
            placeholder="Valor"
            min={0.01}
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <div className="campo campo-tipo">
          <span className="campo-icone">
            {tipo === "Receita" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoTransacao)}>
            <option value="Despesa">Despesa</option>
            <option value="Receita" disabled={pessoaEhMenorDeIdade}>
              Receita
            </option>
          </select>
        </div>

        <button type="submit" className="botao" disabled={carregando || pessoas.length === 0}>
          <Plus size={17} />
          Adicionar
        </button>
      </form>

      {pessoaEhMenorDeIdade && (
        <p className="mensagem mensagem-aviso">
          <ShieldAlert size={16} />
          {pessoaSelecionada?.nome} é menor de idade: apenas despesas podem ser cadastradas.
        </p>
      )}
      {pessoas.length === 0 && (
        <p className="mensagem mensagem-aviso">
          <Info size={16} />
          Cadastre uma pessoa antes de lançar transações.
        </p>
      )}
      {erro && (
        <p className="mensagem mensagem-erro">
          <AlertCircle size={16} />
          {erro}
        </p>
      )}

      {transacoes.length === 0 ? (
        <div className="estado-vazio">
          <Receipt size={40} strokeWidth={1.5} />
          <p>Nenhuma transação cadastrada ainda.</p>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>Pessoa</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th className="numero">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>
                    <div className="celula-pessoa">
                      <span className="avatar">{iniciais(transacao.pessoaNome)}</span>
                      {transacao.pessoaNome}
                    </div>
                  </td>
                  <td>{transacao.descricao}</td>
                  <td>
                    {transacao.tipo === "Receita" ? (
                      <span className="badge badge-receita">
                        <TrendingUp size={12} />
                        Receita
                      </span>
                    ) : (
                      <span className="badge badge-despesa">
                        <TrendingDown size={12} />
                        Despesa
                      </span>
                    )}
                  </td>
                  <td className="numero">
                    <span className={transacao.tipo === "Receita" ? "saldo-positivo" : "saldo-negativo"}>
                      {transacao.tipo === "Receita" ? "+" : "−"} {formatarMoeda(transacao.valor)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
