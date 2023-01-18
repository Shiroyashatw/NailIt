﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DemoSetController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public DemoSetController(NailitDBContext PContext)
        {
            Context = PContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDemoSetTable(int id)
        {
            var query = from User in Context.DemoSetTables
                        where User.ManicuristId == id
                        select User;

            return await query.ToListAsync();
        }



        [HttpPost]
        public async Task<ActionResult<DemoSetTable>> PostDemoSetTable(DemoSetTable DemoSetTable)
        {
            Context.DemoSetTables.Add(DemoSetTable);
            await Context.SaveChangesAsync();
            return CreatedAtAction("GetDataSetTable", new { id = DemoSetTable.DemoSetId }, DemoSetTable);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetPostDemoSetTable(int id)
        {
            //傳入DemoSet 美甲師id 找到最後一筆 回傳 demoset ID
            var query = await (from User in Context.DemoSetTables
                         where User.ManicuristId == id
                         orderby User.DemoSetId
                         select User).LastOrDefaultAsync();

            return Ok(new { query });
        }

    }
}

