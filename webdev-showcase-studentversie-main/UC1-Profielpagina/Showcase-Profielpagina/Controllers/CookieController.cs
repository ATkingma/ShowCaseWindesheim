using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Showcase_Profielpagina.Models;

namespace Showcase_Profielpagina.Controllers
{
    public class CookieController : Controller
    {
        [EnableRateLimiting("fixed")]
        [HttpPost] 
        public IActionResult SetCookie([FromBody] SetCookieRequest request) 
        {
            if (request.Value.Length > 4096)
            {
                return BadRequest("Cookie value is too large.");
            }

            var options = new CookieOptions
            {
                Expires = DateTime.UtcNow.AddDays(request.Days),
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            };

            Response.Cookies.Append(request.Name, request.Value, options);
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
