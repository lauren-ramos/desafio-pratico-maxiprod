using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

/// <summary>
/// Contexto do Entity Framework Core. Usa SQLite para que os dados persistam
/// em um arquivo local (controlegastos.db) e sobrevivam ao fechamento da aplicação.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Pessoa> Pessoas => Set<Pessoa>();

    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pessoa>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Nome).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<Transacao>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Descricao).IsRequired().HasMaxLength(500);
            entity.Property(t => t.Valor).HasColumnType("decimal(18,2)");
            entity.Property(t => t.Tipo).HasConversion<string>();

            // Regra de negócio: ao deletar uma pessoa, todas as suas transações são
            // apagadas automaticamente (exclusão em cascata) pelo próprio banco de dados.
            entity.HasOne(t => t.Pessoa)
                  .WithMany(p => p.Transacoes)
                  .HasForeignKey(t => t.PessoaId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
