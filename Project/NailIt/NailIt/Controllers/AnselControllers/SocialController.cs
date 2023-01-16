using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using Newtonsoft.Json;

namespace NailIt.Controllers.AnselControllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SocialController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public SocialController(NailitDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// get a list of related options
        /// </summary>
        /// <param name="code">where this code use</param>
        /// <returns></returns>
        // GET:/api/Social/GetCodeTable/L
        [HttpGet("{code}")]
        public async Task<ActionResult<CodeTable>> GetCodeTable(string code)
        {
            var articleSorts = await _context.CodeTables.
                Where(c => c.CodeUseIn == code).ToListAsync();

            return Ok(articleSorts);
        }

        /// <summary>
        /// upload image to ArticleImage file and return image display link.
        /// </summary>
        /// <param name="frm">attached file</param>
        /// <returns></returns>
        // POST:/api/Social/UploadImage
        [HttpPost]
        public ActionResult UploadImage(IFormCollection frm)
        {
            if (frm.Files.Count > 0)
            {
                // get data and files from formdata of request
                var imageFile = frm.Files[0];
                ArticlePicTable articlePic = JsonConvert.DeserializeObject<ArticlePicTable>(frm["articlePic"]);

                // lock DB
                var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                // record image at ArticlePicTable
                articlePic.ArticlePicPath = "wwwroot\\AnselLib\\ArticleImage" + "\\" + imageFile.FileName;
                _context.ArticlePicTables.Add(articlePic);
                _context.SaveChanges();

                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\AnselLib\\ArticleImage") + "\\" + imageFile.FileName; //檔案存放位置在wwwroot中的資料夾

                using (var stream = System.IO.File.Create(filePath))
                {
                    imageFile.CopyToAsync(stream);
                }

                t.Commit();
                return Ok($"/AnselLib/ArticleImage/{imageFile.FileName}");
            }
            return NotFound();
        }


        /// <summary>
        /// create a new report.
        /// </summary>
        /// <param name="reportTable">new report info</param>
        /// <returns></returns>
        // POST: api/Social/PostReportTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReportTable>> PostSocialReport(ReportTable reportTable)
        {
            // At very begining, checking(審核) infos will be null.
            reportTable.ReportCheckTime = null;
            reportTable.ManagerId = null;
            reportTable.ReportResult = null;

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ReportTables.Add(reportTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetReportTable", new { id = reportTable.ReportId }, reportTable);
        }

    }
}
