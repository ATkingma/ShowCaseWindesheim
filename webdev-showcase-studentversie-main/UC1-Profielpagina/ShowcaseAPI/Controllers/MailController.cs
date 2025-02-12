using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ShowcaseAPI.Models;
using Microsoft.Extensions.Options;
using System.Text;
using System.Net.Mail;
using System.Net;
using ShowcaseAPI.Utilitys;

namespace ShowcaseAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly EmailSettings _emailSettings;

        public MailController(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }
        [HttpPost]
        public ActionResult Post([Bind("FirstName, LastName, Email, Phone, MailSubject, Message")] Contactform form)
        {
            var validationResult = ContactFormValidator.Validate(form);
            if (!validationResult.isValid)
            {
                return BadRequest(new { message = validationResult.errorMessage });
            }

            var client = new SmtpClient("sandbox.smtp.mailtrap.io", 2525)
            {
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = true
            };
            MailAddress from = new MailAddress(form.Email);
            MailAddress to = new MailAddress("timmealbertkingma@email.com");
            MailMessage email = new MailMessage(from, to);
            email.Subject = form.MailSubject;
            email.Body = $"geachte, student\n\n" +
                       $"\n{form.Message}\n\n" +
                       $"met vriendelijke groet,\n\n\n" +
                       $"{form.FirstName} {form.LastName}\n\n" +
                       $"Telefoonnummer: {form.Phone}";

            try
            {
                client.Send(email);
                return Ok(new { message = "Email succesvol verzonden" });
            }
            catch (SmtpException ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { message = "Er is een fout opgetreden bij het verzenden van de e-mail.", error = ex.Message });
            }

        }
    }
}
