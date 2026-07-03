using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Endpoint de totais: soma receitas, despesas e saldo de cada pessoa e o total geral.
[ApiController]
[Route("api/totais")]
public class TotaisController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotaisController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<ConsultaTotaisResponseDto>> ObterTotais()
    {
        // Busca as pessoas com suas transações e calcula os totais.
        var pessoas = await _context.Pessoas
            .Include(p => p.Transacoes)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        var totaisPorPessoa = pessoas.Select(p =>
        {
            var totalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var totalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

            return new TotalPorPessoaDto
            {
                PessoaId = p.Id,
                Nome = p.Nome,
                TotalReceitas = totalReceitas,
                TotalDespesas = totalDespesas,
                Saldo = totalReceitas - totalDespesas
            };
        }).ToList();

        var response = new ConsultaTotaisResponseDto
        {
            Pessoas = totaisPorPessoa,
            TotalReceitasGeral = totaisPorPessoa.Sum(t => t.TotalReceitas),
            TotalDespesasGeral = totaisPorPessoa.Sum(t => t.TotalDespesas),
            SaldoGeral = totaisPorPessoa.Sum(t => t.Saldo)
        };

        return Ok(response);
    }
}
