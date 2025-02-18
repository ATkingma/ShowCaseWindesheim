public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configuratie van Kestrel om de server header te verwijderen
        builder.WebHost.ConfigureKestrel(options =>
        {
            options.AddServerHeader = false;
        });

        // Configuratie van de cookie-policy voor extra beveiliging
        builder.Services.Configure<CookiePolicyOptions>(options =>
        {
            options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
            options.Secure = CookieSecurePolicy.Always;
            options.MinimumSameSitePolicy = SameSiteMode.Strict;
        });

        // Voeg ondersteuning voor controllers en views toe
        builder.Services.AddControllersWithViews();
        builder.Services.AddHttpClient();

        // CORS configuratie moet gebeuren VOORDAT builder.Build()
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhost",
                policy =>
                {
                    policy.WithOrigins("http://localhost", "https://localhost")  // Sta verzoeken van localhost toe
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });

        var app = builder.Build();  // Hier bouw je de applicatie

        // Hier voeg je CORS-middleware toe
        app.UseCors("AllowLocalhost");

        if (!app.Environment.IsDevelopment())
        {
            // In productie omgevingen, gebruik een foutbehandelingspagina
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();  // HTTP Strict Transport Security inschakelen
        }

        app.UseHttpsRedirection();  // Zorg ervoor dat alle verzoeken via HTTPS gaan

        // Middleware om Content-Type header en Content Security Policy toe te voegen
        app.Use(async (context, next) =>
        {
            // Als de Content-Type header ontbreekt, stel deze in op basis van de bestandsnaam
            if (!context.Response.Headers.ContainsKey("Content-Type"))
            {
                if (context.Request.Path.Value.EndsWith(".json"))
                {
                    context.Response.ContentType = "application/json; charset=UTF-8";
                }
                else if (context.Request.Path.Value.EndsWith(".xml"))
                {
                    context.Response.ContentType = "application/xml; charset=UTF-8";
                }
                else if (context.Response.ContentType == "text/html" || context.Response.ContentType == "text/css")
                {
                    context.Response.ContentType = $"{context.Response.ContentType}; charset=UTF-8";
                }
            }

            // Content Security Policy configuratie voor extra beveiliging
            context.Response.Headers.Append("Content-Security-Policy",
                              "default-src 'self'; " +
                              "script-src 'self' https://www.google.com https://www.gstatic.com; " +
                              "style-src 'self' 'unsafe-inline'; " +
                              "img-src 'self' data:; " +
                              "connect-src 'self' ws://localhost:* http://localhost:* wss://www.google.com https://www.google.com; " +
                              "frame-src 'self' https://www.google.com https://www.recaptcha.net; " +
                              "object-src 'none'; " +
                              "upgrade-insecure-requests;" +
                              "frame-ancestors 'self';");


            context.Response.Headers.Add("X-Frame-Options", "DENY");
            context.Response.Headers.Append("X-Frame-Options", "DENY");  // Voorkom dat je website in een iframe wordt geladen

            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");  // Voorkom MIME-type sniffing
            await next();
        });

        app.UseCookiePolicy();  // Pas de cookie policy toe

        // Configuratie voor het bedienen van statische bestanden met beveiliging
        app.UseStaticFiles(new StaticFileOptions
        {
            OnPrepareResponse = ctx =>
            {
                var fileName = ctx.File.Name;
                // Blokkeer toegang tot onveilige bestanden zoals .git, Thumbs.db, .DS_Store, etc.
                if (fileName.EndsWith("/", StringComparison.OrdinalIgnoreCase) ||
                    fileName.EndsWith("Thumbs.db", StringComparison.OrdinalIgnoreCase) ||
                    fileName.EndsWith(".DS_Store", StringComparison.OrdinalIgnoreCase) ||
                    fileName.StartsWith(".git", StringComparison.OrdinalIgnoreCase) ||
                    fileName.StartsWith(".svn", StringComparison.OrdinalIgnoreCase))
                {
                    ctx.Context.Response.StatusCode = 403;
                    ctx.Context.Response.Body = Stream.Null;  // Voorkom dat het bestand wordt verzonden
                }

                // Stel de juiste Content-Type in voor .css bestanden
                if (fileName.EndsWith(".css"))
                {
                    ctx.Context.Response.ContentType = "text/css";
                }
            }
        });

        app.UseRouting();
        app.UseAuthorization();  // Beveilig de routes

        // Configuratie van de standaard controller route
        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.Run();  // Start de applicatie
    }
}
