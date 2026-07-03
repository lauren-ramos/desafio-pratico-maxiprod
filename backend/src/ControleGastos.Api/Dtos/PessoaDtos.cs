using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos;

/// <summary>Dados recebidos do cliente para cadastrar uma nova pessoa.</summary>
public class PessoaCreateDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150.")]
    public int Idade { get; set; }
}

/// <summary>Dados de uma pessoa devolvidos pela API (inclui o Id gerado pelo servidor).</summary>
public class PessoaResponseDto
{
    public Guid Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public int Idade { get; set; }
}
