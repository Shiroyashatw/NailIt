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
    public class ReplyTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ReplyTablesController(NailitDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// load reply of article
        /// </summary>
        /// <param name="ArticleId">which article's reply</param>
        /// <returns></returns>
        // GET: api/ReplyTables
        [HttpGet("{ArticleId}")]
        public async Task<ActionResult<IEnumerable<ReplyTable>>> GetReplyTables(int ArticleId)
        {
            var replies = await _context.ReplyTables.
                Where(r => r.ArticleId == ArticleId).
                OrderByDescending(r => r.ReplyId).
                ToListAsync();

            var repliesJoinMember = replies.Join(
                _context.MemberTables,
                r => r.MemberId,
                m => m.MemberId,
                (r, m) => new { reply = r, m.MemberNickname }).ToList();

            var userReplyLike = _context.ReplyLikeTables.Where(r => r.MemberId == HttpContext.Session.GetInt32("MemberId")).ToList();
            var leftJoinLike = (from reply in repliesJoinMember
                                join like in userReplyLike
                                     on reply.reply.ReplyId equals like.ReplyId into gj
                                from userlike in gj.DefaultIfEmpty()
                                select new
                                {
                                    reply.reply,
                                    memberNickname = reply.MemberNickname,
                                    recordDateTime = getDateTimeDiff(reply.reply.ReplyLastEdit),
                                    like = userlike?.ReplyLikeId == null ? false : true
                                }).ToList();

            return Ok(leftJoinLike);
        }

        private string getDateTimeDiff(DateTime dateTime)
        {
            var prevDate = new DateTime(2023, 1, 5); //15 July 2021
            var today = DateTime.Now;
            var diffOfDates = today - prevDate;
            var dd = diffOfDates.Days;

            Console.WriteLine("prevDate: {0}", prevDate);
            Console.WriteLine("today: {0}", today);

            string aa = 5.ToString();
            return $"{aa}前";
        }

        // GET: api/ReplyTables/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ReplyTable>> GetReplyTable(int id)
        //{
        //    var replyTable = await _context.ReplyTables.FindAsync(id);

        //    if (replyTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return replyTable;
        //}

        // PUT: api/ReplyTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutReplyTable(int id, ReplyTable replyTable)
        //{
        //    if (id != replyTable.ReplyId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(replyTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ReplyTableExists(id))
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

        // POST: api/ReplyTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReplyTable>> PostReplyTable(ReplyTable replyTable)
        {
            // this article ArticleReplyCount +1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == replyTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleReplyCount += 1; }

            _context.ReplyTables.Add(replyTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReplyTable", new { id = replyTable.ReplyId }, replyTable);
        }

        // DELETE: api/ReplyTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReplyTable(int id)
        {
            var replyTable = await _context.ReplyTables.FindAsync(id);
            if (replyTable == null)
            {
                return NotFound();
            }

            // this article ArticleReplyCount -1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == replyTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleReplyCount -= 1; }

            _context.ReplyTables.Remove(replyTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //private bool ReplyTableExists(int id)
        //{
        //    return _context.ReplyTables.Any(e => e.ReplyId == id);
        //}
    }
}
