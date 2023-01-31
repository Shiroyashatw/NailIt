using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CodeFixes;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.YueyueControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YueReportTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueReportTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // POST: api/YueReportTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReportTable>> PostReportTable(ReportTable reportTable)
        {
            _context.ReportTables.Add(reportTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReportTable", new { id = reportTable.ReportId }, reportTable);
        }

        [HttpPut]
        public async Task<bool> PutReportTable(ReportTable reportTable)
        {
            reportTable.ReportBuildTime=DateTime.Now;
            _context.ReportTables.Add(reportTable);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch { return false; }
            var myOrder = await _context.OrderTables.FindAsync(reportTable.ReportItem);
            myOrder.OrderStateC = "A7";
            try
            {
                await _context.SaveChangesAsync();
            }
            catch { return false; }
            return true;
        }

    }
}
