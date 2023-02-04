using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LetmeinqqController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public LetmeinqqController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/Letmeinqq
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManagerTable>>> GetManagerTables()
        {
            return await _context.ManagerTables.ToListAsync();
        }

        // GET: api/Letmeinqq/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ManagerTable>> GetManagerTable(int id)
        {
            var managerTable = await _context.ManagerTables.FindAsync(id);

            if (managerTable == null)
            {
                return NotFound();
            }

            return managerTable;
        }
        public IActionResult MemberCenter()
        {
            string userName = Request.Cookies["userName"] ?? "Guest";
            if (userName == "Guest")
            {
                return Redirect("/Home/Index");
            }
            return View();
        }

        //// PUT: api/Letmeinqq/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutManagerTable(int id, ManagerTable managerTable)
        //{
        //    if (id != managerTable.ManagerId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(managerTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ManagerTableExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/Letmeinqq
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<ManagerTable>> PostManagerTable(ManagerTable managerTable)
        //{
        //    _context.ManagerTables.Add(managerTable);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetManagerTable", new { id = managerTable.ManagerId }, managerTable);
        //}

        //// DELETE: api/Letmeinqq/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteManagerTable(int id)
        //{
        //    var managerTable = await _context.ManagerTables.FindAsync(id);
        //    if (managerTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.ManagerTables.Remove(managerTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool ManagerTableExists(int id)
        {
            return _context.ManagerTables.Any(e => e.ManagerId == id);
        }
    }
}
