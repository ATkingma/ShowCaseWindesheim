public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.WebHost.ConfigureKestrel(options =>
        {
            options.AddServerHeader = false;
        });

        builder.Services.Configure<CookiePolicyOptions>(options =>
        {
            options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
            options.Secure = CookieSecurePolicy.Always;
            options.MinimumSameSitePolicy = SameSiteMode.Strict;
        });

        builder.Services.AddControllersWithViews();
        builder.Services.AddHttpClient();
        var app = builder.Build();

        app.UseCors("AllowLocalhost");

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();

        // Middleware to ensure Content-Type header and Content Security Policy
        app.Use(async (context, next) =>
        {
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

            context.Response.Headers.Add("Content-Security-Policy",
                "default-src 'self'; " +
                "script-src 'self' https://www.google.com https://www.gstatic.com; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data:; " +
                "connect-src 'self' ws://localhost:* http://localhost:* wss://www.google.com https://www.google.com; " +
                "frame-src 'self' https://www.google.com https://www.recaptcha.net; " +
                "object-src 'none'; " +
                "upgrade-insecure-requests;");

            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
            context.Response.Headers.Add("X-Frame-Options", "DENY");

            await next();
        });

        app.UseCookiePolicy();

        app.UseStaticFiles(new StaticFileOptions
        {
            OnPrepareResponse = ctx =>
            {
                var fileName = ctx.File.Name;
                if (fileName.EndsWith("Thumbs.db", StringComparison.OrdinalIgnoreCase) ||
                    fileName.EndsWith(".DS_Store", StringComparison.OrdinalIgnoreCase) ||
                    fileName.StartsWith(".git", StringComparison.OrdinalIgnoreCase) ||
                    fileName.StartsWith(".svn", StringComparison.OrdinalIgnoreCase))
                {
                    ctx.Context.Response.StatusCode = 403;
                    ctx.Context.Response.Body = Stream.Null;
                }

                if (fileName.EndsWith(".css"))
                {
                    ctx.Context.Response.ContentType = "text/css";
                }
            }
        });

        app.UseRouting();
        app.UseAuthorization();

        app.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");

        app.Run();
    }
}
