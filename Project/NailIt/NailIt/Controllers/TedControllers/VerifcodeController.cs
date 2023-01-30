using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Threading.Tasks;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerifcodeController : ControllerBase
    {
        private readonly NailitDBContext _context;
        public VerifcodeController(NailitDBContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<ActionResult<Verificationcode>> Verificationcodetable(Verificationcode veriftable)
        {
            _context.Verificationcodes.Add(veriftable);
            await _context.SaveChangesAsync();

            return veriftable;
        }
    }
}
