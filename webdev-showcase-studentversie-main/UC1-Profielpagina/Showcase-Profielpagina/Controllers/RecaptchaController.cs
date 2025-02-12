using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("recaptcha-sitekey")]
        public IActionResult GetSiteKey()
        {
            return Ok(new { siteKey = _recaptchaSiteKey });
        }
    }

}
