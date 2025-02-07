using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Showcase_Profielpagina.Models;
using System.Net.Mail;
using MimeKit;

namespace Showcase_Profielpagina.Controllers
{
    public class ContactController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ContactController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(Contactform form)
        {
            Console.WriteLine("Contact form submission received.");

            if (!ModelState.IsValid)
            {
                ViewBag.Message = "De ingevulde velden voldoen niet aan de gestelde voorwaarden";
                return View();
            }

            // Serialize form data to JSON for testing purpose
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var json = JsonConvert.SerializeObject(form, settings);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Send email via Mailtrap
            try
            {
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("Your App", "porominez@gmail.com"));
                emailMessage.To.Add(new MailboxAddress("Recipient", "keizerxjwz4@gmail.com"));
                emailMessage.Subject = "New Contact Form Submission";

                // Email Body
                var bodyBuilder = new BodyBuilder
                {
                    TextBody = $"Form Data: {json}"
                };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                // Mailtrap SMTP server credentials
                var smtpClient = new MailKit.Net.Smtp.SmtpClient();

                await smtpClient.ConnectAsync("smtp.mailtrap.io", 587, false);  // Connect to Mailtrap's SMTP server
                await smtpClient.AuthenticateAsync("d", "d");  // Use your Mailtrap credentials
                await smtpClient.SendAsync(emailMessage);  // Send the email
                await smtpClient.DisconnectAsync(true);  // Disconnect from the server

                ViewBag.Message = "Het contactformulier is verstuurd.";
            }
            catch (Exception ex)
            {
                // Handle any exceptions that may occur during email sending
                ViewBag.Message = "Er is iets misgegaan bij het versturen van de e-mail: " + ex.Message;
            }

            return View();
        }
    }
}
