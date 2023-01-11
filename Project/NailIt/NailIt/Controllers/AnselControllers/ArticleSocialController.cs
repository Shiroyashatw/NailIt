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
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ArticleSocialController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ArticleSocialController(NailitDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// load personal 10 articles. click on "more button" will load more 10 articles.
        /// </summary>
        /// <param name="ArticleAuthor">member id for article and member info</param>
        /// <param name="page">count clicking on "more button"</param>
        /// <param name="order">which order 'latest':'最新', 'other':'愛心'</param>
        /// <param name="searchValue">search article title</param>
        /// <returns></returns>
        // GET: api/ArticleSocial/GetMyArticles/1/0/latest/Good
        [HttpGet("{ArticleAuthor}/{page}/{order}/{searchValue}")]
        [HttpGet("{ArticleAuthor}/{page}/{order}")]
        //[HttpGet("{ArticleAuthor}/{page}")]
        public async Task<ActionResult<IEnumerable<ArticleTable>>> GetMyArticles(int ArticleAuthor, int page = 0, string order = "latest", string searchValue = "")
        {
            var amountPerPage = 10;
            var articles = await _context.ArticleTables.
                Where(a => a.ArticleAuthor == ArticleAuthor).                
                OrderByDescending(a => (order=="latest") ? a.ArticleId : a.ArticleLikesCount).
                Skip(page * amountPerPage).
                Take(amountPerPage)
                .ToListAsync();

            if (searchValue != "")
            {
                articles = articles.Where(a => a.ArticleTitle.Contains(searchValue)).ToList();
            }

            var articlesJoinMember = articles.Join(
                _context.MemberTables, 
                a => a.ArticleAuthor, 
                m => m.MemberId, 
                (a, m) => new { article = a, m.MemberAccount, m.MemberNickname }).ToList();

            var userArticleLike = _context.ArticleLikeTables.Where(a => a.MemberId == HttpContext.Session.GetInt32("MemberId")).ToList();
            var leftJoinLike = (from article in articlesJoinMember
                                join like in userArticleLike
                                     on article.article.ArticleId equals like.ArticleId into gj
                                from userlike in gj.DefaultIfEmpty()
                                select new
                                {
                                    article.article,
                                    memberAccount = article.MemberAccount,
                                    memberNickname = article.MemberNickname,
                                    like = userlike?.ArticleLikeId == null ? false : true
                                }).ToList();

            var member = await _context.MemberTables.
                Where(m => m.MemberId == ArticleAuthor).
                Select(m => new{
                    m.MemberId, 
                    m.MemberAccount, 
                    m.MemberNickname,
                    m.MemberManicurist
                }).SingleAsync();

            var articleCount = _context.ArticleTables.Where(a => a.ArticleAuthor == ArticleAuthor).Count();

            return Ok(new { reaultArticles=leftJoinLike, member, articleCount });
        }
    }
}
