using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Dtos;

// Dados que o cliente envia para criar uma pessoa.
public class PessoaCreateDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [MaxLength(200)]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 150, ErrorMessage = "A idade deve estar entre 0 e 150.")]
    public int Idade { get; set; }
}

// Dados de uma pessoa que a API devolve.
public class PessoaResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}
