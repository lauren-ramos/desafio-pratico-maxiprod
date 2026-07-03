namespace ControleGastos.Api.Models;

/// <summary>
/// Representa um lançamento financeiro (receita ou despesa) pertencente a uma <see cref="Pessoa"/>.
/// Transações não podem ser editadas ou removidas individualmente, apenas criadas e listadas
/// (conforme especificação do desafio); são removidas apenas em cascata quando a pessoa é excluída.
/// </summary>
public class Transacao
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    /// <summary>Chave estrangeira obrigatória: toda transação pertence a uma pessoa já cadastrada.</summary>
    public Guid PessoaId { get; set; }

    public Pessoa? Pessoa { get; set; }
}
