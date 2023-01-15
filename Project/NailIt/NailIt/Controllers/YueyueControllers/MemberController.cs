using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.YueyueControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public MemberController(NailitDBContext context)
        {
            _context = context;
        }
        // PUT: api/Member   //登入用
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<string> PutMemberTable((string username, string password) ACandPW)
        {
            string account= ACandPW.username;    
            string password= ACandPW.password;
            var myMember =(
            from MemberTable in _context.MemberTables
            where MemberTable.MemberAccount == account
            select MemberTable);
            MemberTable nowUse;
            if (myMember.Any())
                nowUse = myMember.ToList()[0];
            else
                return "noAc";
            
            if (nowUse.MemberPassword != password)
                return "wrongPw";
            else 
            {
                Guid g = Guid.NewGuid();
                _context.Entry(myMember).State = EntityState.Modified;
                nowUse.MemberLogincredit = g;
                HttpContext.Session.SetString("token", g.ToString());
                await _context.SaveChangesAsync();
                return "OK";
            }

        }

       // POST: api/Member      用於註冊會員
       // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<bool> PostMemberTable(MemberTable memberTable)
        {
            var myMember =
            from MemberTable in _context.MemberTables
            where MemberTable.MemberAccount == memberTable.MemberAccount
            select MemberTable;

            if (!myMember.Any())
            {
                _context.MemberTables.Add(memberTable);
                await _context.SaveChangesAsync();
                return true;
            }
            else
                return false;
        }
     
    }
}
