using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class ReportTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ReportTablesController(NailitDBContext context)
        {
            _context = context;
        }


        // GET: api/ReportTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetReportTables()
        {
            var newReportTables = from o in _context.ReportTables
                                  join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                                  //where o.ReportBuildTime >= Convert.ToDateTime("2023-01-07")
                                  //  && o.ReportBuildTime <= Convert.ToDateTime("2023-01-17")
                                    //&& o.ReportPlaceC == "D6"
                                    //&& o.ReportResult == true
                                  select new
                                  {
                                    ReportId = o.ReportId,
                                    ReportBuilder =o.ReportBuilder,
                                    ReportTarget =o.ReportTarget,
                                    ReportItem =o.ReportItem,
                                    ReportPlaceC=o.ReportPlaceC,
                                    ReportReasonC=o.ReportReasonC,
                                    ReportContent=o.ReportContent,
                                    ReportBuildTime= o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                    ReportCheckTime=o.ReportCheckTime,
                                    ManagerId=o.ManagerId,
                                    ReportResult=o.ReportResult,
                                    CodeUseIn=c.CodeId,
                                    CodeRepresent=c.CodeRepresent
                                  };
            return await newReportTables.ToListAsync();
        }

        // GET: api/ReportTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReportTable>> GetReportTable(int id)
        {
            var reportTable = await _context.ReportTables.FindAsync(id);

            if (reportTable == null)
            {
                return NotFound();
            }

            return reportTable;
        }

        // PUT: api/ReportTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReportTable(int id, ReportTable reportTable)
        {
            if (id != reportTable.ReportId)
            {
                return BadRequest();
            }

            _context.Entry(reportTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportTableExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ReportTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReportTable>> PostReportTable(ReportTable reportTable)
        {
            _context.ReportTables.Add(reportTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReportTable", new { id = reportTable.ReportId }, reportTable);
        }

        // DELETE: api/ReportTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReportTable(int id)
        {
            var reportTable = await _context.ReportTables.FindAsync(id);
            if (reportTable == null)
            {
                return NotFound();
            }

            _context.ReportTables.Remove(reportTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReportTableExists(int id)
        {
            return _context.ReportTables.Any(e => e.ReportId == id);
        }
    }
}
