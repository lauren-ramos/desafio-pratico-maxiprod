using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Consulta de totais: para cada pessoa cadastrada, soma receitas, despesas e calcula o saldo;
/// ao final, soma tudo para exibir o total geral do domicílio.
/// </summary>
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
        // Carrega todas as pessoas com suas transações para calcular os totais em memória.
        // Para o volume de dados de um controle de gastos residencial isso é suficiente;
        // se a base crescesse muito, o agregado poderia ser feito via GroupBy no banco.
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
