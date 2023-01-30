using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDemoSet()
        {
            return await Context.DemoSetTables.ToListAsync();
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
            //return CreatedAtAction("GetDataSetTable", new { id = DemoSetTable.DemoSetId }, DemoSetTable);
            return Ok();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMainDemoSetTable(int id)
        {
            var query = from Demo 
                                   in Context.DemoSetTables
                            where Demo.ManicuristId == id && Demo.DemoSetMain == true
                            select Demo;

            return await query.ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemoSetTable(int id, DemoSetTable DemoSetTable)
        {
            var CertainDemoSet = (from o in Context.DemoSetTables
                                  where o.ManicuristId == id && o.DemoSetId == DemoSetTable.DemoSetId
                                  select o).FirstOrDefault();

            CertainDemoSet.DemoSetName = DemoSetTable.DemoSetName;
            CertainDemoSet.DemoSetPartC = DemoSetTable.DemoSetPartC;
            CertainDemoSet.DemoSetContent = DemoSetTable.DemoSetContent;
            CertainDemoSet.DemoSetPrice = DemoSetTable.DemoSetPrice;
            CertainDemoSet.DemoSetDeposit = DemoSetTable.DemoSetDeposit;
            CertainDemoSet.DemoSetTag1 = DemoSetTable.DemoSetTag1;
            CertainDemoSet.DemoSetTag2 = DemoSetTable.DemoSetTag2;
            CertainDemoSet.DemoSetTag3 = DemoSetTable.DemoSetTag3;
            CertainDemoSet.DemoSetPublic = DemoSetTable.DemoSetPublic;
            CertainDemoSet.DemoSetMain = DemoSetTable.DemoSetMain;
            CertainDemoSet.DemoSetMainStartTime = DemoSetTable.DemoSetMainStartTime;
            CertainDemoSet.DemoSetMainEndTime = DemoSetTable.DemoSetMainEndTime;
            CertainDemoSet.DemoSetColor = DemoSetTable.DemoSetColor;

            await Context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemoSetCover(int id, DemoSetTable DemoSetTable)
        {
            var CertainDemoSet = (from o in Context.DemoSetTables
                                  where o.DemoSetId == id
                                  select o).FirstOrDefault();

            CertainDemoSet.DemoSetCover = DemoSetTable.DemoSetCover;

            await Context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDemoSetTable(int id)
        {
            var DemoSetTable = await Context.DemoSetTables.FindAsync(id);
            //var DeleteCertainDemoSet = (from o in Context.DemoSetTables
            //                      where o.DemoSetId == id
            //                      select o).FirstOrDefault();
            Context.DemoSetTables.Remove(DemoSetTable);
            await Context.SaveChangesAsync();
            return Ok();
        }

    }
}

