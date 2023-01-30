using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net;
using System.Security.Principal;
using System.Text;
using System;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailsendController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public MailsendController(NailitDBContext context)
        {
            _context = context;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderTable(int id, OrderTable orderTable)
        {
            string Account = "testing@gmail.com";
            string Password = "test123";

            SmtpClient client = new SmtpClient();
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.Credentials = new NetworkCredential(Account, Password);
            client.EnableSsl = true;

            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(Account);
            mail.To.Add("test1@test.com");
            mail.Subject = "測試信";
            mail.SubjectEncoding = Encoding.UTF8;
            mail.IsBodyHtml = true;
            mail.Body = "第一行<br> 第二行<br>第三行<br>";
            mail.BodyEncoding = Encoding.UTF8;

            Attachment attachment = new Attachment(@"C:\fakepath\test.txt");
            mail.Attachments.Add(attachment);

            //try
            //{
            //    client.Send(mail);
            //}
            //catch (Exception ex)
            //{
            //    //throw ex;
            //}
            //finally
            //{
            //    attachment.Dispose();
            //    mail.Dispose();
            //    client.Dispose();
            //}

            if (id != orderTable.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(orderTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {

            }

            return NoContent();
        }

    }
}
