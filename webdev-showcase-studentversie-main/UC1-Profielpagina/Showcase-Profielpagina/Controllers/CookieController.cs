using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Showcase_Profielpagina.Controllers
{
    public class CookieController : Controller
    {
        [EnableRateLimiting("fixed")]
        public IActionResult SetCookie(string name, string value, int days = 30)
        {
            if (value.Length > 4096)
            {
                return BadRequest("Cookie value is too large.");
            }

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

        [HttpGet]
        public IActionResult GetCookie(string name)
        {
            if (Request.Cookies.TryGetValue(name, out var value))
            {
                return Content(value);
            }
            return Content("Not set yet");
        }
    }
}