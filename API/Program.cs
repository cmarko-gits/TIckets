using API.Data;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
SQLitePCL.Batteries.Init(); // <-- ADD THIS LINE

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure CORS to allow credentials
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Angular app on port 3000
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  // Allow credentials (cookies, HTTP authentication)
    });
});


// Configure SQLite database
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

// Configure Bearer Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        RequireExpirationTime = true,
        ValidateLifetime = true
    };
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddHttpClient<MovieService>(); // Dodaje HttpClient za MovieService
builder.Services.AddScoped<TokenService>();

// Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Add Bearer authentication to Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Please enter JWT token"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

var app = builder.Build();

// Enable Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
        c.RoutePrefix = "swagger";  // Swagger UI will be available at /swagger
    });
}

app.UseCors("AllowAngularApp");  

// Dodaj poruku u konzolu
Console.WriteLine("CORS policy 'AllowAngularApp' je uspešno konfigurisana. Angular aplikacija može pristupiti API-ju.");

// Use authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Enable CORS
app.UseCors("AllowAngularApp"); // Ovdje omogućavamo CORS politiku

// Map controllers (for API endpoints)
app.MapControllers();

// Enable HTTPS redirection
app.UseHttpsRedirection();

app.Run();
