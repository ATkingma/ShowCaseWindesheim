using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ShowcaseAPI.Models;
using Microsoft.Extensions.Options;
using System.Text;

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
        public async Task<ActionResult> PostAsync([Bind("FirstName, LastName, Email, Phone")] Contactform form)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("De ingevulde velden voldoen niet aan de gestelde voorwaarden");
            }

            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var json = JsonConvert.SerializeObject(form, settings);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("Your App", "porominez@gmail.com"));
                emailMessage.To.Add(new MailboxAddress("Recipient", "keizerxjwz4@gmail.com"));
                emailMessage.Subject = "New Contact Form Submission";

                var bodyBuilder = new BodyBuilder
                {
                    TextBody = $"Form Data: {json}"
                };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                var smtpClient = new MailKit.Net.Smtp.SmtpClient();

                await smtpClient.ConnectAsync("smtp.mailtrap.io", 587, false);
                await smtpClient.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await smtpClient.SendAsync(emailMessage);
                await smtpClient.DisconnectAsync(true);

                return Ok("Het contactformulier is verstuurd.");
            }
            catch (Exception ex)
            {
                return BadRequest("Er is iets misgegaan bij het versturen van de e-mail: " + ex.Message);
            }
        }
    }
}
