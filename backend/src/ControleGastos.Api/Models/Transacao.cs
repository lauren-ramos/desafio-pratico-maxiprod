namespace ControleGastos.Api.Models;

// Uma transação (receita ou despesa) de uma pessoa.
public class Transacao
{
    public int Id { get; set; } // número único, gerado automaticamente pelo banco
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public TipoTransacao Tipo { get; set; }

    public int PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}
