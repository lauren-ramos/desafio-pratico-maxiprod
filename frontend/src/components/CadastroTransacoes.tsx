import { useEffect, useState, type FormEvent } from "react";
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
import { listarPessoas, listarTransacoes, criarTransacao } from "../api";
import type { Pessoa, Transacao, TipoTransacao } from "../types";
import { formatarMoeda, iniciais } from "../utils";
import { Modal } from "./Modal";

// Tela de transações: lista e um popup para criar.
// Regra: pessoa menor de 18 anos só pode ter despesa. O front desabilita a opção
// "Receita" nesse caso, mas quem garante a regra de verdade é o back-end.
export function CadastroTransacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [criando, setCriando] = useState(false);
  const [pessoaId, setPessoaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<TipoTransacao>("Despesa");
  const [erro, setErro] = useState("");

  const pessoaSelecionada = pessoas.find((p) => p.id === Number(pessoaId));
  const menorDeIdade = pessoaSelecionada !== undefined && pessoaSelecionada.idade < 18;

  async function carregar() {
    setPessoas(await listarPessoas());
    setTransacoes(await listarTransacoes());
  }

  useEffect(() => {
    carregar();
  }, []);

  // Se escolher uma pessoa menor de idade, volta o tipo para Despesa.
  useEffect(() => {
    if (menorDeIdade) setTipo("Despesa");
  }, [menorDeIdade]);

  function abrirCriar() {
    setPessoaId("");
    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setErro("");
    setCriando(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (!pessoaId || !descricao.trim() || valor === "") {
      setErro("Preencha pessoa, descrição e valor.");
      return;
    }

    try {
      await criarTransacao({
        descricao: descricao.trim(),
        valor: Number(valor),
        tipo,
        pessoaId: Number(pessoaId),
      });
      setCriando(false);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <section className="cartao">
      <div className="secao-cabecalho">
        <div className="secao-titulo">
          <span className="icone-titulo">
            <ArrowLeftRight size={20} />
          </span>
          <h2>Transações</h2>
        </div>
        <button className="botao" onClick={abrirCriar} disabled={pessoas.length === 0}>
          <Plus size={17} />
          Nova transação
        </button>
      </div>

      {pessoas.length === 0 && (
        <p className="mensagem mensagem-aviso">
          <Info size={16} />
          Cadastre uma pessoa antes de lançar transações.
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
                <th>#</th>
                <th>Pessoa</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th className="numero">Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td className="celula-id">{transacao.id}</td>
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

      {criando && (
        <Modal titulo="Nova transação" aoFechar={() => setCriando(false)}>
          <form className="form-modal" onSubmit={salvar}>
            <label className="campo-label">
              Pessoa
              <div className="campo">
                <span className="campo-icone">
                  <User size={16} />
                </span>
                <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} autoFocus>
                  <option value="">Selecione a pessoa</option>
                  {pessoas.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome} ({pessoa.idade} anos)
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className="campo-label">
              Descrição
              <div className="campo">
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
            </label>

            <label className="campo-label">
              Valor
              <div className="campo">
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
            </label>

            <label className="campo-label">
              Tipo
              <div className="campo">
                <span className="campo-icone">
                  {tipo === "Receita" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </span>
                <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoTransacao)}>
                  <option value="Despesa">Despesa</option>
                  <option value="Receita" disabled={menorDeIdade}>
                    Receita
                  </option>
                </select>
              </div>
            </label>

            {menorDeIdade && (
              <p className="mensagem mensagem-aviso">
                <ShieldAlert size={16} />
                {pessoaSelecionada?.nome} é menor de idade: apenas despesas.
              </p>
            )}
            {erro && (
              <p className="mensagem mensagem-erro">
                <AlertCircle size={16} />
                {erro}
              </p>
            )}

            <div className="modal-acoes">
              <button type="button" className="botao-secundario" onClick={() => setCriando(false)}>
                Cancelar
              </button>
              <button type="submit" className="botao">
                <Plus size={16} />
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
