using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.AnselControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReplyLikeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ReplyLikeTablesController(NailitDBContext context)
        {
            _context = context;
        }

        //// GET: api/ReplyLikeTables
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<ReplyLikeTable>>> GetReplyLikeTables()
        //{
        //    return await _context.ReplyLikeTables.ToListAsync();
        //}

        //// GET: api/ReplyLikeTables/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ReplyLikeTable>> GetReplyLikeTable(int id)
        //{
        //    var replyLikeTable = await _context.ReplyLikeTables.FindAsync(id);

        //    if (replyLikeTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return replyLikeTable;
        //}

        //// PUT: api/ReplyLikeTables/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutReplyLikeTable(int id, ReplyLikeTable replyLikeTable)
        //{
        //    if (id != replyLikeTable.ReplyLikeId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(replyLikeTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ReplyLikeTableExists(id))
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

        // POST: api/ReplyLikeTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReplyLikeTable>> PostReplyLikeTable(ReplyLikeTable replyLikeTable)
        {
            // this reply ReplyLikesCount +1 at ReplyTables
            var replyTable = _context.ReplyTables.FirstOrDefault(a => a.ReplyId == replyLikeTable.ReplyId);
            if (replyTable != null) { replyTable.ReplyLikesCount += 1; }

            _context.ReplyLikeTables.Add(replyLikeTable);
            await _context.SaveChangesAsync();
                
            return CreatedAtAction("GetReplyLikeTable", new { id = replyLikeTable.ReplyLikeId }, replyLikeTable);
        }

        // DELETE: api/ReplyLikeTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReplyLikeTable(int id)
        {
            try
            {
                var replyLikeTable = await _context.ReplyLikeTables.FindAsync(id);
                if (replyLikeTable == null)
                {
                    return NotFound();
                }

                // this reply ReplyLikesCount -1 at ReplyTables
                var replyTable = _context.ReplyTables.FirstOrDefault(a => a.ReplyId == replyLikeTable.ReplyId);
                if (replyTable != null) { replyTable.ReplyLikesCount -= 1; }

                _context.ReplyLikeTables.Remove(replyLikeTable);
                await _context.SaveChangesAsync();

                return NoContent();
                //return Ok(new { status = "OK" });

            }
            catch (Exception e)
            {
                return NotFound(e);
                    //Ok(new { status = "Exception", message = e });
            }
        }

        //private bool ReplyLikeTableExists(int id)
        //{
        //    return _context.ReplyLikeTables.Any(e => e.ReplyLikeId == id);
        //}
    }
}
