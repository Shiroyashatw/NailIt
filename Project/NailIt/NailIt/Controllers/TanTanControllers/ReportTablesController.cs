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
                                  join m in _context.MemberTables on o.ReportBuilder equals m.MemberId into mlist
                                  from m in mlist.DefaultIfEmpty()
                                  join n in _context.MemberTables on o.ReportTarget equals n.MemberId into nlist
                                  from n in nlist.DefaultIfEmpty()
                                  join ma in _context.ManagerTables on o.ManagerId equals ma.ManagerId into malist
                                  from ma in malist.DefaultIfEmpty()
                                  select new
                                  {
                                      ReportId = o.ReportId,
                                      ReportBuilder = o.ReportBuilder,
                                      ReportTarget = o.ReportTarget,
                                      ReportItem = o.ReportItem,
                                      ReportPlaceC = o.ReportPlaceC,
                                      ReportReasonC = o.ReportReasonC,
                                      ReportContent = o.ReportContent,
                                      ReportBuildTime = o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                      ReportCheckTime = o.ReportCheckTime == null ? "" : ((DateTime)o.ReportCheckTime).ToString("yyyy-MM-dd HH:mm"),
                                      ManagerId = o.ManagerId,
                                      ReportResult = o.ReportResult,
                                      CodeUseIn = c.CodeId,
                                      CodeRepresent = c.CodeRepresent,
                                      BuilderMemberName = m.MemberName,
                                      TargetMemberName = n.MemberName,
                                      ManagerName = ma.ManagerName
                                  };
            return await newReportTables.ToListAsync();
        }

        // GET: api/ReportTables/condition
        [HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetProductCondition(string dateS, string dateE, string reportP, bool? reportR)
        {
            var date1 = DateTime.Parse(dateS);
            var date2 = DateTime.Parse(dateE);
            


            var query = from o in _context.ReportTables
                        join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                        join m in _context.MemberTables on o.ReportBuilder equals m.MemberId into mlist
                        from m in mlist.DefaultIfEmpty()
                        where o.ReportBuildTime >= Convert.ToDateTime(date1)
                        && o.ReportBuildTime <= Convert.ToDateTime(date2).AddMinutes(1439)
                        && o.ReportPlaceC == reportP
                        //&& o.ReportResult == 
                        select new
                        {
                            ReportId = o.ReportId,
                            ReportBuilder = o.ReportBuilder,
                            ReportTarget = o.ReportTarget,
                            ReportItem = o.ReportItem,
                            ReportPlaceC = o.ReportPlaceC,
                            ReportReasonC = o.ReportReasonC,
                            ReportContent = o.ReportContent,
                            ReportBuildTime = o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                            ReportCheckTime = o.ReportCheckTime,
                            ManagerId = o.ManagerId,
                            ReportResult = o.ReportResult,
                            CodeUseIn = c.CodeId,
                            CodeRepresent = c.CodeRepresent,
                        };

            return await query.ToListAsync();
        }

        // GET: api/ReportTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetReportTable(int id)
        {
            var reportTable = from o in _context.ReportTables
                              join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                              join m in _context.MemberTables on o.ReportBuilder equals m.MemberId into mlist
                              from m in mlist.DefaultIfEmpty()
                              join a in _context.MemberTables on o.ReportTarget equals a.MemberId into alist
                              from a in alist.DefaultIfEmpty()
                              join ma in _context.ManagerTables on o.ManagerId equals ma.ManagerId into malist
                              from ma in malist.DefaultIfEmpty()
                              where o.ReportId == id
                              select new
                              {
                                  ReportId = o.ReportId,
                                  ReportBuilder = o.ReportBuilder,
                                  ReportTarget = o.ReportTarget,
                                  ReportItem = o.ReportItem,
                                  ReportPlaceC = o.ReportPlaceC,
                                  ReportReasonC = o.ReportReasonC,
                                  ReportContent = o.ReportContent,
                                  ReportBuildTime = o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                  ReportCheckTime = o.ReportCheckTime == null ? "" : ((DateTime)o.ReportCheckTime).ToString("yyyy-MM-dd HH:mm"),
                                  ManagerId = o.ManagerId,
                                  ReportResult = o.ReportResult,
                                  CodeUseIn = c.CodeId,
                                  CodeRepresent = c.CodeRepresent,
                                  BuilderMemberName = m.MemberName,
                                  TargetMemberName = a.MemberName,
                                  ManagerName = ma.ManagerName
                              };

            if (reportTable == null)
            {
                return NotFound();
            };

            return await reportTable.ToListAsync();
        }

        ////GET: api/ReportTables/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ReportTable>> GetReportTable2(int id)
        //{
        //    var reportTable = await _context.ReportTables.FindAsync(id);

        //    if (reportTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return reportTable;
        //}


        // PUT: api/ReportTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReportTable(int id, ReportTable reportTable)
        {

            if (id != reportTable.ReportId)
            {
                return BadRequest();
            }

            //_context.Entry(reportTable).State = EntityState.Modified;
            //借鑑
            var CertainReportTable = (from o in _context.ReportTables
                                      where o.ReportId == id
                                      select o).FirstOrDefault();
            CertainReportTable.ReportResult = reportTable.ReportResult;
            CertainReportTable.ReportCheckTime = reportTable.ReportCheckTime;
            CertainReportTable.ManagerId = reportTable.ManagerId;

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

        [HttpPost]
        public async Task<ActionResult<ReportTable>> PostReportTable(ReportTable reportTable)
        {
            _context.ReportTables.Add(reportTable);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetReportTable", new { id = reportTable.ReportId }, reportTable);
        }

        //// DELETE: api/ReportTables/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteReportTable(int id)
        //{
        //    var reportTable = await _context.ReportTables.FindAsync(id);
        //    if (reportTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.ReportTables.Remove(reportTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool ReportTableExists(int id)
        {
            return _context.ReportTables.Any(e => e.ReportId == id);
        }
    }
}
