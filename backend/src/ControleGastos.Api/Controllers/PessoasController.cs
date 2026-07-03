using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Controllers;

// Endpoints de pessoas: listar, criar e excluir.
[ApiController]
[Route("api/pessoas")]
public class PessoasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PessoasController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/pessoas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaResponseDto>>> Listar()
    {
        var pessoas = await _context.Pessoas
            .OrderBy(p => p.Nome)
            .Select(p => new PessoaResponseDto { Id = p.Id, Nome = p.Nome, Idade = p.Idade })
            .ToListAsync();

        return Ok(pessoas);
    }

    // POST /api/pessoas
    [HttpPost]
    public async Task<ActionResult<PessoaResponseDto>> Criar(PessoaCreateDto dto)
    {
        var pessoa = new Pessoa
        {
            Nome = dto.Nome.Trim(),
            Idade = dto.Idade
        };

        _context.Pessoas.Add(pessoa);
        await _context.SaveChangesAsync();

        var response = new PessoaResponseDto { Id = pessoa.Id, Nome = pessoa.Nome, Idade = pessoa.Idade };
        return CreatedAtAction(nameof(Listar), new { id = pessoa.Id }, response);
    }

    // DELETE /api/pessoas/{id} - apaga a pessoa e, em cascata, as transações dela.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Deletar(int id)
    {
        var pessoa = await _context.Pessoas.FindAsync(id);
        if (pessoa is null)
        {
            return NotFound(new { mensagem = "Pessoa não encontrada." });
        }

        _context.Pessoas.Remove(pessoa);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
