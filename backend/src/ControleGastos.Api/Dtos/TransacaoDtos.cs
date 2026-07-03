using System.ComponentModel.DataAnnotations;
using ControleGastos.Api.Models;

namespace ControleGastos.Api.Dtos;

/// <summary>Dados recebidos do cliente para cadastrar uma nova transação.</summary>
public class TransacaoCreateDto
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [MaxLength(500)]
    public string Descricao { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    [Required(ErrorMessage = "A pessoa é obrigatória.")]
    public Guid PessoaId { get; set; }
}

/// <summary>Dados de uma transação devolvidos pela API, incluindo o nome da pessoa para facilitar exibição.</summary>
public class TransacaoResponseDto
{
    public Guid Id { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public Guid PessoaId { get; set; }

    public string PessoaNome { get; set; } = string.Empty;
}
