namespace ControleGastos.Api.Dtos;

/// <summary>Totais de receitas, despesas e saldo de uma única pessoa.</summary>
public class TotalPorPessoaDto
{
    public Guid PessoaId { get; set; }

    public string Nome { get; set; } = string.Empty;

    public decimal TotalReceitas { get; set; }

    public decimal TotalDespesas { get; set; }

    /// <summary>Saldo = Total de receitas - Total de despesas.</summary>
    public decimal Saldo { get; set; }
}

/// <summary>Resposta completa da consulta de totais: uma linha por pessoa + o total geral.</summary>
public class ConsultaTotaisResponseDto
{
    public List<TotalPorPessoaDto> Pessoas { get; set; } = new();

    public decimal TotalReceitasGeral { get; set; }

    public decimal TotalDespesasGeral { get; set; }

    public decimal SaldoGeral { get; set; }
}
