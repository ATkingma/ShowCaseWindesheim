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

        app.Use(async (context, next) =>
        {
            context.Response.Headers.Add("X-Frame-Options", "DENY");
            context.Response.Headers.Add("Content-Security-Policy", "frame-ancestors 'self';");
            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
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