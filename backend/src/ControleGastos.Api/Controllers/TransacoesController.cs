using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Endpoints de transações: listar e criar (sem editar/excluir, conforme o desafio).
[ApiController]
[Route("api/transacoes")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/transacoes
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

    // POST /api/transacoes
    [HttpPost]
    public async Task<ActionResult<TransacaoResponseDto>> Criar(TransacaoCreateDto dto)
    {
        // A pessoa precisa existir.
        var pessoa = await _context.Pessoas.FindAsync(dto.PessoaId);
        if (pessoa is null)
        {
            return BadRequest(new { mensagem = "Pessoa informada não existe no cadastro de pessoas." });
        }

        // Menor de idade só pode ter despesa.
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
