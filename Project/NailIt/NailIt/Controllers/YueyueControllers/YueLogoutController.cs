using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using static System.Collections.Specialized.BitVector32;

namespace NailIt.Controllers.YueyueControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YueLogoutController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueLogoutController(NailitDBContext context)
        {
            _context = context;
        }

        // PUT: api/Logout/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<bool> PutMemberTable(string token)
        {
            Guid guid = Guid.Parse(token);
            var myMember = (
            from MemberTable in _context.MemberTables
            where MemberTable.MemberLogincredit ==guid
            select MemberTable).ToList()[0];

            _context.Entry(myMember).State = EntityState.Modified;
            myMember.MemberLogincredit = null;
            HttpContext.Session.Remove("token");
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
