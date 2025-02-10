using Microsoft.AspNetCore.Mvc;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Showcase_Profielpagina.Models;

namespace Showcase_Profielpagina.Controllers
{
    public class ContactController : Controller
    {
        private readonly HttpClient _httpClient;
        public ContactController(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://localhost:7278");
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> SubmitContactForm(Contactform form)
        {
            if (!ModelState.IsValid)
            {

                ViewBag.Message = "De ingevulde velden voldoen niet aan de gestelde voorwaarden";
                return View();
            }

            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };
            var json = JsonConvert.SerializeObject(form, settings);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            ///dit in try cathc anders op je bakkes
            try
            {
                HttpResponseMessage response = await _httpClient.PostAsync("/api/mail", content);
                if (!response.IsSuccessStatusCode)
                {
                    ViewBag.Message = "Er is iets misgegaan";
                    return View();
                }

                if (!response.IsSuccessStatusCode)
                {
                    ViewBag.Message = "Er is iets misgegaan";
                    return View();
                }
            }
            catch (Exception ex)
            {
                ViewBag.Message =ex;
                return View();
            }

            



            ViewBag.Message = "Het contactformulier is verstuurd";

            return View();
        }
    }
}
