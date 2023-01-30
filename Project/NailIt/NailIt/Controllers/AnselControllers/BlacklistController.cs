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
    [Route("api/[controller]")]
    [ApiController]
    public class BlacklistController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public BlacklistController(NailitDBContext context)
        {
            _context = context;
        }

        // POST: api/Blacklist
        [HttpPost]
        public async Task<ActionResult> PostBlacklist(MessageBlacklistTable blacklist)
        {
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.MessageBlacklistTables.Add(blacklist);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetMessageBlacklistTable", new { id = blacklist.BlacklistId }, blacklist);
        }

        // DELETE: api/Blacklist/1/2
        [HttpDelete("{builderId}/{targetId}")]
        public async Task<ActionResult> DeleteBlacklist(int builderId, int targetId)
        {
            var blacklist = _context.MessageBlacklistTables.FirstOrDefault(m => m.BlacklistBuilder == builderId && m.BlacklistTarget == targetId);
            if (blacklist == null)
            {
                return NotFound();
            }
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
            _context.MessageBlacklistTables.Remove(blacklist);
            await _context.SaveChangesAsync();
            t.Commit();
            return NoContent();
        }
    }
}