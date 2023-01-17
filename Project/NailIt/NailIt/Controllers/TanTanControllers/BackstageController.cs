using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackstageController : Controller
    {

        private readonly NailitDBContext _context;

        public BackstageController(NailitDBContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            
            return View();

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReplyTable>>> GetReplyTables()
        {
            return await _context.ReplyTables.ToListAsync();
        }

        //public IActionResult Index1()
        //{

        //    var viewModel = _context.ReportTables.ToList();
        //    return View(viewModel);

        //}
    }
}
