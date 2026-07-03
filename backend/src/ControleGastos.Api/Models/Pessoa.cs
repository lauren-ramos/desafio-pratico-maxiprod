namespace ControleGastos.Api.Models;

// Uma pessoa do domicílio.
public class Pessoa
{
    public int Id { get; set; } // número único, gerado automaticamente pelo banco
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }

    // Transações da pessoa (apagadas junto quando a pessoa é excluída).
    public List<Transacao> Transacoes { get; set; } = new();

    public bool EhMenorDeIdade => Idade < 18;
}
