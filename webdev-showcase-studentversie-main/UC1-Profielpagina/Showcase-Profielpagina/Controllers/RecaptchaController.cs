using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Showcase_Profielpagina.Controllers
{
    [ApiController]
    [Route("api")]
    public class RecaptchaController : ControllerBase
    {
        private readonly string _recaptchaSiteKey;

        public RecaptchaController(IConfiguration configuration)
        {
            _recaptchaSiteKey = configuration["Recaptcha:SiteKey"];
        }

        [EnableRateLimiting("fixed")]
        [HttpGet("recaptcha-sitekey")]
        public IActionResult GetSiteKey()
        {
            return Ok(new { siteKey = _recaptchaSiteKey });
        }
    }

}
