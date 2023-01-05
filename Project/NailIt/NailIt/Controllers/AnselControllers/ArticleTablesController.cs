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
    public class ArticleTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ArticleTablesController(NailitDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// load 10 articles. click on "more button" will load more 10 articles.
        /// </summary>
        /// <param name="boardSort">which board 'L2':'交流','L1':'手模','L0':'招標'</param>
        /// <param name="page">count clicking on "more button"</param>
        /// <param name="order">which order 'latest':'最新', 'other':'愛心'</param>
        /// <param name="searchValue">search article title</param>
        /// <returns></returns>
        // GET: api/ArticleTables/L2/0
        [HttpGet("{boardSort}/{page}/{order}/{searchValue}")]
        public async Task<ActionResult<IEnumerable<ArticleTable>>> GetArticleTables(string boardSort = "L2", int page = 0, string order = "latest", string searchValue = "")
        {
            var amountPerPage = 10;
            var articles = await _context.ArticleTables.
                Where(a => a.ArticleBoardC == boardSort).
                OrderByDescending(a => (order == "latest") ? a.ArticleId : a.ArticleLikesCount).
                Skip(page*amountPerPage).
                Take(amountPerPage).ToListAsync();

            if (searchValue != "")
            {
                articles = articles.Where(a => a.ArticleTitle.Contains(searchValue)).ToList();
            }

            var reaultArticles = articles.Join(
                _context.MemberTables,
                a => a.ArticleAuthor,
                m => m.MemberId,
                (a, m) => new { article = a, m.MemberAccount, m.MemberNickname }).ToList();
            return Ok(reaultArticles);
        }

        // GET: api/ArticleTables/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ArticleTable>> GetArticleTable(int id)
        //{
        //    var articleTable = await _context.ArticleTables.FindAsync(id);

        //    if (articleTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return articleTable;
        //}

        // PUT: api/ArticleTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticleTable(int id, ArticleTable articleTable)
        {
            if (id != articleTable.ArticleId)
            {
                return BadRequest();
            }

            _context.Entry(articleTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleTableExists(id))
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

        // POST: api/ArticleTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ArticleTable>> PostArticleTable(ArticleTable articleTable)
        {
            _context.ArticleTables.Add(articleTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetArticleTable", new { id = articleTable.ArticleId }, articleTable);
        }

        // DELETE: api/ArticleTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticleTable(int id)
        {
            var articleTable = await _context.ArticleTables.FindAsync(id);
            if (articleTable == null)
            {
                return NotFound();
            }

            _context.ArticleTables.Remove(articleTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ArticleTableExists(int id)
        {
            return _context.ArticleTables.Any(e => e.ArticleId == id);
        }
    }
}
