import { useEffect, useState, type FormEvent } from "react";
import { User, Hash, UserPlus, Trash2, Users, ShieldAlert, AlertCircle } from "lucide-react";
import { pessoasApi } from "../api/pessoas";
import { ApiError } from "../api/client";
import type { Pessoa } from "../types";
import { iniciais } from "../utils/formatters";

/**
 * Tela de cadastro de pessoas: formulário de criação + listagem + exclusão.
 * Ao excluir uma pessoa, o backend também remove em cascata todas as suas transações.
 */
export function CadastroPessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function carregarPessoas() {
    setPessoas(await pessoasApi.listar());
  }

  useEffect(() => {
    carregarPessoas().catch((e) => setErro(e instanceof ApiError ? e.message : "Falha ao carregar pessoas."));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || idade === "") {
      setErro("Informe nome e idade.");
      return;
    }

    setCarregando(true);
    try {
      await pessoasApi.criar({ nome: nome.trim(), idade: Number(idade) });
      setNome("");
      setIdade("");
      await carregarPessoas();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Falha ao cadastrar pessoa.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleDeletar(id: string) {
    if (!confirm("Excluir esta pessoa também excluirá todas as suas transações. Confirmar?")) {
      return;
    }
    setErro(null);
    try {
      await pessoasApi.deletar(id);
      await carregarPessoas();
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Falha ao excluir pessoa.");
    }
  }

  return (
    <section className="cartao">
      <div className="secao-cabecalho">
        <div className="secao-titulo">
          <span className="icone-titulo">
            <Users size={20} />
          </span>
          <h2>Cadastro de Pessoas</h2>
        </div>
      </div>

      <form className="form-linha" onSubmit={handleSubmit}>
        <div className="campo campo-nome">
          <span className="campo-icone">
            <User size={16} />
          </span>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="campo campo-idade">
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
        <button type="submit" className="botao" disabled={carregando}>
          <UserPlus size={17} />
          Adicionar
        </button>
      </form>

      {erro && (
        <p className="mensagem mensagem-erro">
          <AlertCircle size={16} />
          {erro}
        </p>
      )}

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
                <th>Nome</th>
                <th>Idade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((pessoa) => (
                <tr key={pessoa.id}>
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
                    <button className="botao-excluir" onClick={() => handleDeletar(pessoa.id)}>
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
    </section>
  );
}
