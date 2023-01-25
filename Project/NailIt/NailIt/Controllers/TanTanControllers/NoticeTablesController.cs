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
    public class NoticeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public NoticeTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/NoticeTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetNoticeTables()
        {
            var newNoticeTables = from o in _context.NoticeTables
                                  select new
                                  {
                                      NoticeId=o.NoticeId,
                                      NoticeScope=o.NoticeScope,
                                      NoticeTitle=o.NoticeTitle,
                                      NoticeContent=o.NoticeContent,
                                      NoticeBuildTime = o.NoticeBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                      NoticePushTime = o.NoticePushTime.ToString("yyyy-MM-dd HH:mm"),
                                      NoticeState=o.NoticeState,
                                  };
            return await newNoticeTables.ToListAsync();
        }

        // GET: api/NoticeTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NoticeTable>> GetNoticeTable(int id)
        {
            var noticeTable = await _context.NoticeTables.FindAsync(id);

            if (noticeTable == null)
            {
                return NotFound();
            }

            return noticeTable;
        }

        //// PUT: api/NoticeTables/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutNoticeTable(int id, NoticeTable noticeTable)
        //{
        //    if (id != noticeTable.NoticeId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(noticeTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!NoticeTableExists(id))
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

        //// POST: api/NoticeTables
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<NoticeTable>> PostNoticeTable(NoticeTable noticeTable)
        //{
        //    _context.NoticeTables.Add(noticeTable);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetNoticeTable", new { id = noticeTable.NoticeId }, noticeTable);
        //}

        //// DELETE: api/NoticeTables/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteNoticeTable(int id)
        //{
        //    var noticeTable = await _context.NoticeTables.FindAsync(id);
        //    if (noticeTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.NoticeTables.Remove(noticeTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool NoticeTableExists(int id)
        {
            return _context.NoticeTables.Any(e => e.NoticeId == id);
        }
    }
}
