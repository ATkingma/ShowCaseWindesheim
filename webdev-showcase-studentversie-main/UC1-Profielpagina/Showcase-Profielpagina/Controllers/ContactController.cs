using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Showcase_Profielpagina.Models;
using System.Text;

namespace Showcase_Profielpagina.Controllers
{
    public class ContactController : Controller
    {
        private readonly HttpClient _httpClient;
        private readonly string _recaptchaSecret;

        public ContactController(IConfiguration configuration, HttpClient httpClient)
        {
            _recaptchaSecret = configuration["Recaptcha:SecretKey"];

            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7278");
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(Contactform form, string gRecaptchaResponse)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.Message = "De ingevulde velden voldoen niet aan de gestelde voorwaarden";
                return View();
            }

            bool recaptchaIsValid = await ValidateRecaptcha(gRecaptchaResponse);

            if (!recaptchaIsValid)
            {
                ViewBag.Message = "reCAPTCHA validatie is mislukt. Probeer het opnieuw.";
                return View();
            }

            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            //bouwen van header etc
            var json = JsonConvert.SerializeObject(form, settings);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync("/api/mail", content);

                if (!response.IsSuccessStatusCode)
                {
                    ViewBag.Message = "Er is iets misgegaan bij het versturen van het formulier";
                    return View();
                }
            }
            catch (Exception ex)
            {
                ViewBag.Message = $"Er is een fout opgetreden: {ex.Message}";
                return View();
            }

            ViewBag.Message = "Het contactformulier is succesvol verstuurd.";
            return View();
        }

        private async Task<bool> ValidateRecaptcha(string recaptchaResponse)
        {
            if (string.IsNullOrEmpty(recaptchaResponse))
            {
                return false;
            }

            using (var client = new HttpClient())
            {
                var requestData = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("secret", _recaptchaSecret),
                    new KeyValuePair<string, string>("response", recaptchaResponse)
                });

                var recaptchaResponseMessage = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", requestData);

                if (!recaptchaResponseMessage.IsSuccessStatusCode)
                {
                    return false;
                }

                var jsonResponse = await recaptchaResponseMessage.Content.ReadAsStringAsync();
                dynamic? responseObject = JsonConvert.DeserializeObject(jsonResponse);

                return responseObject.success == true;
            }
        }
    }
}
