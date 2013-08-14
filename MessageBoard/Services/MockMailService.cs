using System.Diagnostics;

namespace MessageBoard.Services
{
    public class MockMailService : IMailService
    {
        public bool SendMail(string from, string to, string subject, string body)
        {
            Debug.WriteLine(string.Concat("SendMail: ", body));
            return true;
        }
    }
}