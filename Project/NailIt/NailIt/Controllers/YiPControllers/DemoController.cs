using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemoController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public DemoController(NailitDBContext PContext)
        {
            Context = PContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetThisDemoTable(int id)
        {
            var query = from User in Context.DemoSetTables
                        join Demo in Context.DemoTables
                        on User.DemoSetId equals Demo.DemoSetId
                        where User.ManicuristId == id
                        select new
                        {
                            DemoSetId = Demo.DemoSetId,
                            DemoSetName = User.DemoSetName,
                            DemoPic = Demo.DemoPic
                        };
            //select User;
            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<DemoSetTable>> PostDemoTable(DemoTable DemoTable)
        {
            Context.DemoTables.Add(DemoTable);
            await Context.SaveChangesAsync();
            return CreatedAtAction("GetDemotTable", new { id = DemoTable.DemoSetId }, DemoTable);
        }
    }
}
