using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDemoCover(int id)
        {
            var query = from User in Context.DemoSetTables
                        join Demo in Context.DemoTables
                        on User.DemoSetCover equals Demo.DemoId
                        where User.ManicuristId == id
                        select new
                        {
                            DemoPic = Demo.DemoPic,
                            demoSetName = User.DemoSetName,
                            demoSetPrice = User.DemoSetPrice
                        };
            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMainDemoCover(int id)
        {
            var query = from DemoSet in Context.DemoSetTables
                        join Demo in Context.DemoTables
                        on DemoSet.DemoSetCover equals Demo.DemoId
                        where DemoSet.ManicuristId == id && DemoSet.DemoSetMain == true
                        select new
                        {
                            DemoPic = Demo.DemoPic,
                            demoSetName = DemoSet.DemoSetName,
                            demoSetPrice = DemoSet.DemoSetPrice
                        };
            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<DemoSetTable>> PostDataSetTable(DemoSetTable DemoSetTable)
        {
            Context.DemoSetTables.Add(DemoSetTable);
            await Context.SaveChangesAsync();
            return CreatedAtAction("GetDataSetTable", new { id = DemoSetTable.DemoSetId }, DemoSetTable);
        }
    }
}

