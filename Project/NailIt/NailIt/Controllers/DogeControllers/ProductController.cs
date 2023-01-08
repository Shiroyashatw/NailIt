using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetProducts()
        {
            var query = from o in _db.ManicuristTables
                        // 利用 ManicuristId 設計師ID 兩表join
                        join demoset in _db.DemoSetTables
                        on o.ManicuristId equals demoset.ManicuristId
                        // demo表 美甲照片路徑
                        //join demo in _db.DemoTables
                        //on demoset.DemoSetId equals demo.DemoSetId
                        select new { o, demoset};
            return await query.ToListAsync();
        }
    }
}
