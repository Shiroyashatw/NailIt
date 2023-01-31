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
    public class MemberTables2Controller : ControllerBase
    {
        private readonly NailitDBContext _context;

        public MemberTables2Controller(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/MemberTables2/nocheck
        [HttpGet("nocheck")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetNoCMemberTables()
        {


            var NoCheckMember = from o in _context.MemberTables
                                where o.MemberManicurist == false
                                select new
                                {
                                    MemberId = o.MemberId,
                                };

            return await NoCheckMember.ToListAsync();
        }
        // GET: api/MemberTables2/check
        [HttpGet("check")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetCMemberTables()
        {


            var CheckMember = from o in _context.MemberTables
                                where o.MemberManicurist == true
                                select new
                                {
                                    MemberId = o.MemberId,
                                };

            return await CheckMember.ToListAsync();
        }

        // GET: api/MemberTables2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberTable>>> GetMemberTables()
        {
            return await _context.MemberTables.ToListAsync();
        }

        // GET: api/MemberTables2/5
        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetMemberTable(int id)
        {
            var memberTable = from o in _context.MemberTables
                              join ma in _context.ReportTables on o.MemberId equals ma.ReportTarget into malist
                              from ma in malist.DefaultIfEmpty()
                              where o.MemberId == id
                              select  new
                              {
                                  MemberId = o.MemberId,
                                  MemberAccount = o.MemberAccount,
                                  MemberName = o.MemberName,
                                  MemberNickname = o.MemberNickname,
                                  MemberGender = o.MemberGender == true ? "男" : "女",
                                  MemberPhone = o.MemberPhone,
                                  MemberBirth = o.MemberBirth == null ? "" : ((DateTime)o.MemberBirth).ToString("yyyy-MM-dd"),
                                  MemberEmail = o.MemberEmail,
                                  MemberManicurist = o.MemberManicurist == true ? "店家／美甲師" : "一般會員",
                                  MemberReportpoint = o.MemberReportpoint,
                                  MemberStatus = o.MemberReportpoint>=20? "已停權": "使用中",
                                  //MemberBanned = o.MemberBanned, //???幹嗎用???
                                  MemberReportId=ma.ReportId.ToString() == null ? "－" : ma.ReportId.ToString(),

                              };

            if (memberTable == null)
            {
                return NotFound();
            }

            return await memberTable.ToListAsync(); 
        }

        //// PUT: api/MemberTables2/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutMemberTable(int id, MemberTable memberTable)
        //{
        //    if (id != memberTable.MemberId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(memberTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!MemberTableExists(id))
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

        //// POST: api/MemberTables2
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<MemberTable>> PostMemberTable(MemberTable memberTable)
        //{
        //    _context.MemberTables.Add(memberTable);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetMemberTable", new { id = memberTable.MemberId }, memberTable);
        //}

        //// DELETE: api/MemberTables2/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteMemberTable(int id)
        //{
        //    var memberTable = await _context.MemberTables.FindAsync(id);
        //    if (memberTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.MemberTables.Remove(memberTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool MemberTableExists(int id)
        {
            return _context.MemberTables.Any(e => e.MemberId == id);
        }
    }
}
