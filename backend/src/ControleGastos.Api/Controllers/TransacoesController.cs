using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Cadastro de transações (receitas/despesas): criação e listagem.
/// Não há edição nem deleção individual, conforme especificação do desafio.
/// </summary>
[ApiController]
[Route("api/transacoes")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Lista todas as transações cadastradas, com o nome da pessoa incluído para exibição.</summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransacaoResponseDto>>> Listar()
    {
        var transacoes = await _context.Transacoes
            .Include(t => t.Pessoa)
            .OrderByDescending(t => t.Id)
            .Select(t => new TransacaoResponseDto
            {
                Id = t.Id,
                Descricao = t.Descricao,
                Valor = t.Valor,
                Tipo = t.Tipo,
                PessoaId = t.PessoaId,
                PessoaNome = t.Pessoa!.Nome
            })
            .ToListAsync();

        return Ok(transacoes);
    }

    /// <summary>
    /// Cadastra uma nova transação.
    /// Regras de negócio aplicadas:
    /// 1) A pessoa informada precisa existir no cadastro de pessoas;
    /// 2) Pessoas menores de idade (menos de 18 anos) só podem ter despesas cadastradas,
    ///    nunca receitas — protege a regra mesmo que o front-end falhe em validar.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransacaoResponseDto>> Criar(TransacaoCreateDto dto)
    {
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
        {
            return BadRequest(new { mensagem = "Pessoa informada não existe no cadastro de pessoas." });
        }

        if (pessoa.EhMenorDeIdade && dto.Tipo == TipoTransacao.Receita)
        {
            return BadRequest(new { mensagem = "Pessoas menores de 18 anos só podem ter despesas cadastradas, não receitas." });
        }

        var transacao = new Transacao
        {
            Descricao = dto.Descricao.Trim(),
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            PessoaId = dto.PessoaId
        };

        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();

        var response = new TransacaoResponseDto
        {
            Id = transacao.Id,
            Descricao = transacao.Descricao,
            Valor = transacao.Valor,
            Tipo = transacao.Tipo,
            PessoaId = transacao.PessoaId,
            PessoaNome = pessoa.Nome
        };

        return CreatedAtAction(nameof(Listar), new { id = transacao.Id }, response);
    }
}
