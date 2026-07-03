using System.Text.Json.Serialization;
using ControleGastos.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    // Serializa enums (ex.: TipoTransacao) como texto ("Receita"/"Despesa") em vez de número,
    // deixando o JSON trocado com o front-end legível.
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Persistência em SQLite: os dados ficam gravados em um arquivo local (controlegastos.db)
// e continuam disponíveis mesmo depois que a aplicação é fechada e reaberta.
var connectionString = builder.Configuration.GetConnectionString("Default") ?? "Data Source=controlegastos.db";
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

// Libera o front-end React (rodando em outra porta) a consumir a API durante o desenvolvimento.
const string CorsPolicyName = "PermitirFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
    });
});

var app = builder.Build();

// Aplica automaticamente as migrations pendentes ao iniciar, garantindo que o banco de
// dados e as tabelas existam sem exigir um passo manual antes da primeira execução.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);

app.UseAuthorization();

app.MapControllers();

app.Run();
