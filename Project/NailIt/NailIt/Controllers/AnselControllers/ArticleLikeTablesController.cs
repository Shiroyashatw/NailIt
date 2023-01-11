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
    public class ArticleLikeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ArticleLikeTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/ArticleLikeTables
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<ArticleLikeTable>>> GetArticleLikeTables()
        //{
        //    return await _context.ArticleLikeTables.ToListAsync();
        //}

        // GET: api/ArticleLikeTables/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ArticleLikeTable>> GetArticleLikeTable(int id)
        //{
        //    var articleLikeTable = await _context.ArticleLikeTables.FindAsync(id);

        //    if (articleLikeTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return articleLikeTable;
        //}

        // PUT: api/ArticleLikeTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutArticleLikeTable(int id, ArticleLikeTable articleLikeTable)
        //{
        //    if (id != articleLikeTable.ArticleLikeId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(articleLikeTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ArticleLikeTableExists(id))
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

        // POST: api/ArticleLikeTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ArticleLikeTable>> PostArticleLikeTable(ArticleLikeTable articleLikeTable)
        {
            // this article ArticleLikesCount +1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == articleLikeTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleLikesCount += 1; }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ArticleLikeTables.Add(articleLikeTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetArticleLikeTable", new { id = articleLikeTable.ArticleLikeId }, articleLikeTable);
        }

        // DELETE: api/ArticleLikeTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticleLikeTable(int id)
        {
            var articleLikeTable = await _context.ArticleLikeTables.FindAsync(id);
            if (articleLikeTable == null)
            {
                return NotFound();
            }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            // this article ArticleLikesCount -1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == articleLikeTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleLikesCount -= 1; }

            _context.ArticleLikeTables.Remove(articleLikeTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return NoContent();
        }

        //private bool ArticleLikeTableExists(int id)
        //{
        //    return _context.ArticleLikeTables.Any(e => e.ArticleLikeId == id);
        //}
    }
}
