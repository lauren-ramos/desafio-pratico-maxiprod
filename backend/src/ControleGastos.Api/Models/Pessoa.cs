namespace ControleGastos.Api.Models;

/// <summary>
/// Representa uma pessoa do domicílio que pode ter transações (receitas/despesas) associadas.
/// </summary>
public class Pessoa
{
    /// <summary>Identificador único, gerado automaticamente pelo servidor (nunca informado pelo cliente).</summary>
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }

    /// <summary>
    /// Transações associadas a esta pessoa. Configurado no <see cref="Data.AppDbContext"/>
    /// com exclusão em cascata: apagar a pessoa apaga automaticamente todas as suas transações.
    /// </summary>
    public List<Transacao> Transacoes { get; set; } = new();

    /// <summary>Regra de negócio: pessoas com menos de 18 anos são consideradas menores de idade.</summary>
    public bool EhMenorDeIdade => Idade < 18;
}
