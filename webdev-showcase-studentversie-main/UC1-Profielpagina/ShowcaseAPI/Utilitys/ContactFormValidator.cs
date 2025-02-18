namespace ShowcaseAPI.Utilitys
{
    using ShowcaseAPI.Models;
    using System.Text.RegularExpressions;

    public class ContactFormValidator
    {
        // Dit patroon controleert of de naam enkel letters bevat (zowel kleine als grote letters).
        // Het staat geen spaties, cijfers of speciale tekens toe.
        private static readonly Regex NameRegex = new Regex(@"^[a-zA-Z]+$", RegexOptions.Compiled);

        // Dit patroon controleert of de invoer een geldig e-mailadres is in de vorm van "naam@domein.extensie".
        // Het staat geen spaties of ongeldige tekens voor en na de '@' toe.
        private static readonly Regex EmailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);

        // Dit patroon accepteert telefoonnummers met een optioneel plusteken (+) gevolgd door 10 tot 15 cijfers.
        // Het is geschikt voor internationale telefoonnummers waarbij het plusteken de landcode kan aanduiden.
        private static readonly Regex PhoneRegex = new Regex(@"^\+?[0-9]{10,15}$", RegexOptions.Compiled);


        public static (bool isValid, string errorMessage) Validate(Contactform form)
        {
            if (!NameRegex.IsMatch(form.FirstName))
            {
                return (false, "Voornaam mag alleen letters bevatten.");
            }
            if (form.FirstName.Length > 60)
            {
                return (false, "Voornaam mag niet langer zijn dan 60 tekens.");
            }

            if (!NameRegex.IsMatch(form.LastName))
            {
                return (false, "Achternaam mag alleen letters bevatten.");
            }
            if (form.LastName.Length > 60)
            {
                return (false, "Achternaam mag niet langer zijn dan 60 tekens.");
            }

            if (!EmailRegex.IsMatch(form.Email))
            {
                return (false, "Voer een geldig e-mailadres in.");
            }

            if (!PhoneRegex.IsMatch(form.Phone))
            {
                return (false, "Telefoonnummer is ongeldig. Voer een geldig telefoonnummer in.");
            }

            if (form.MailSubject.Length > 200)
            {
                return (false, "Onderwerp mag niet langer zijn dan 200 tekens.");
            }

            if (form.Message.Length > 600)
            {
                return (false, "Bericht mag niet langer zijn dan 600 tekens.");
            }
            return (true, string.Empty);
        }
    }
}
