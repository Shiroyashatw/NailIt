using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace NailIt.Controllers.DogeControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        // 套用 DB
        private readonly NailitDBContext _db;

        public ProductController(NailitDBContext db)
        {
            _db = db;
        }
        // 可以讀到資料 拿回 設計師表(ManicuristTables) join Demo的集合表(DemoSet_Table)
        [HttpGet("{id:int}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetProducts(int id)
        {
            var query = from o in _db.ManicuristTables
                            // 利用 ManicuristId 設計師ID 兩表join
                        join demoset in _db.DemoSetTables
                        on o.ManicuristId equals demoset.ManicuristId
                        // demo表 美甲照片路徑
                        join demo in _db.DemoTables
                        on demoset.DemoSetId equals demo.DemoSetId
                        where demoset.DemoSetId == id
                        select new { o, demoset, demo };
            return await query.ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<OrderTable>> insertOrder(OrderTable orderTable)
        {
            
            _db.OrderTables.Add(orderTable);
            await _db.SaveChangesAsync();
            return Content("OK");
        }
        [HttpGet]
        [Route("{id:int}/reserve")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdata(int id)
        {
            var res = from p in _db.PlanTables
                      join m in _db.ManicuristTables
                      on p.ManicuristId equals m.ManicuristId
                      where m.ManicuristId == id
                      select new { p,m };

            return await res.ToListAsync();
        }
        [HttpGet("s/{service}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetServicedata()
        {
            var res = from demoset in _db.DemoSetTables
                      join s in _db.ServiceTables
                      on demoset.ManicuristId equals s.ManicuristId
                      select new { demoset, s };

            return await res.ToListAsync();
        }
    }
}
