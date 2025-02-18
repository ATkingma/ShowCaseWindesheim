namespace Showcase_Profielpagina.Models
{
    public class SetCookieRequest
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public int Days { get; set; } = 30;
    }
}