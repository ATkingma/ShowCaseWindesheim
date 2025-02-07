using Microsoft.AspNetCore.Mvc;

namespace Showcase_Profielpagina.Controllers
{
    public class CookieController : Controller
    {
        public IActionResult SetCookie(string name, string value, int days = 365)
        {
            var options = new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(days),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Append(name, value, options);
            return Ok("Cookie set successfully");
        }

        public IActionResult GetCookie(string name)
        {
            if (Request.Cookies.TryGetValue(name, out var value))
            {
                return Content(value);
            }
            return NotFound();
        }
    }
}