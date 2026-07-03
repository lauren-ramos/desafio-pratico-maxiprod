import { useEffect, useState, type FormEvent } from "react";
import { User, Hash, UserPlus, Trash2, Users, ShieldAlert, AlertCircle, Plus } from "lucide-react";
import { listarPessoas, criarPessoa, excluirPessoa } from "../api";
import type { Pessoa } from "../types";
import { iniciais } from "../utils";
import { Modal } from "./Modal";

// Tela de pessoas: lista, popup para criar e popup para confirmar exclusão.
// Ao excluir uma pessoa, o back-end também apaga as transações dela.
export function CadastroPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [criando, setCriando] = useState(false);
  const [excluindo, setExcluindo] = useState<Pessoa | null>(null);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [erro, setErro] = useState("");

  async function carregar() {
    setPessoas(await listarPessoas());
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirCriar() {
    setNome("");
    setIdade("");
    setErro("");
    setCriando(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || idade === "") {
      setErro("Informe nome e idade.");
      return;
    }

    try {
      await criarPessoa(nome.trim(), Number(idade));
      setCriando(false);
      await carregar();
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function confirmarExclusao() {
    if (!excluindo) return;
    try {
      await excluirPessoa(excluindo.id);
      setExcluindo(null);
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
            <Users size={20} />
          </span>
          <h2>Pessoas</h2>
        </div>
        <button className="botao" onClick={abrirCriar}>
          <Plus size={17} />
          Nova pessoa
        </button>
      </div>

      {pessoas.length === 0 ? (
        <div className="estado-vazio">
          <Users size={40} strokeWidth={1.5} />
          <p>Nenhuma pessoa cadastrada ainda.</p>
        </div>
      ) : (
        <div className="tabela-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Idade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
                  <td className="celula-id">{pessoa.id}</td>
                  <td>
                    <div className="celula-pessoa">
                      <span className="avatar">{iniciais(pessoa.nome)}</span>
                      {pessoa.nome}
                    </div>
                  </td>
                  <td>
                    <span className="valor-idade">
                      {pessoa.idade} anos
                      {pessoa.idade < 18 && (
                        <span className="badge-menor">
                          <ShieldAlert size={12} />
                          menor de idade
                        </span>
                      )}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="botao-excluir"
                      onClick={() => {
                        setErro("");
                        setExcluindo(pessoa);
                      }}
                    >
                      <Trash2 size={15} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {criando && (
        <Modal titulo="Nova pessoa" aoFechar={() => setCriando(false)}>
          <form className="form-modal" onSubmit={salvar}>
            <label className="campo-label">
              Nome
              <div className="campo">
                <span className="campo-icone">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoFocus
                />
              </div>
            </label>

            <label className="campo-label">
              Idade
              <div className="campo">
                <span className="campo-icone">
                  <Hash size={16} />
                </span>
                <input
                  type="number"
                  placeholder="Idade"
                  min={0}
                  max={150}
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
              </div>
            </label>

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
                <UserPlus size={16} />
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}

      {excluindo && (
        <Modal titulo="Excluir pessoa" aoFechar={() => setExcluindo(null)}>
          <p className="modal-texto">
            Tem certeza que deseja excluir <strong>{excluindo.nome}</strong>? As transações dela
            também serão apagadas.
          </p>

          {erro && (
            <p className="mensagem mensagem-erro">
              <AlertCircle size={16} />
              {erro}
            </p>
          )}

          <div className="modal-acoes">
            <button className="botao-secundario" onClick={() => setExcluindo(null)}>
              Cancelar
            </button>
            <button className="botao botao-perigo" onClick={confirmarExclusao}>
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
