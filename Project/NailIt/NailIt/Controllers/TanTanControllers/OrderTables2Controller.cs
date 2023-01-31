using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderTables2Controller : ControllerBase
    {
        private readonly NailitDBContext _context;

        public OrderTables2Controller(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/OrderTables2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetOrderTables()
        {
            var newOrderTables = from o in _context.OrderTables
                                 join os in _context.CodeTables on o.OrderStateC equals os.CodeId
                                 select new
                                 {
                                     OrderId = o.OrderId,
                                     OrderOrderTime = o.OrderOrderTime.ToString("yyyy-MM-dd HH:mm"),
                                     OrderStateC = o.OrderStateC,
                                     OrderStateName = os.CodeRepresent // 狀態
                                 };
            return await newOrderTables.ToListAsync();
        }
        // GET: api/OrderTables2/5
        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetOrderTable(int id)
        {
            var newOrderTable = from o in _context.OrderTables
                                join m in _context.MemberTables on o.MemberId equals m.MemberId into mlist
                                from m in mlist.DefaultIfEmpty()
                                join ma in _context.MemberTables on o.ManicuristId equals ma.MemberId into malist
                                from ma in malist.DefaultIfEmpty()
                                join p in _context.PlanTables on o.PlanId equals p.PlanId
                                join c in _context.CodeTables on o.OrderPartC equals c.CodeId
                                join r in _context.CodeTables on o.OrderRemovalC equals r.CodeId
                                join os in _context.CodeTables on o.OrderStateC equals os.CodeId
                                where o.OrderId == id
                                select new
                                {
                                    OrderId = o.OrderId,
                                    MemberId = o.MemberId,
                                    MemberName = m.MemberName,
                                    ManicuristId = o.ManicuristId,
                                    ManicuristName = ma.MemberName,
                                    PlanId = o.PlanId,
                                    PlanTime = p.PlanStartTime.ToString("yyyy-MM-dd HH:mm"),
                                    OrderPrice = o.OrderPrice,
                                    OrderDeposit = o.OrderDeposit,
                                    OrderPartC = o.OrderPartC,
                                    PartCodeName = c.CodeRepresent, //施作部位
                                    OrderRemovalC = o.OrderRemovalC,
                                    RemovalRemovalC = r.CodeRepresent, //卸甲部位
                                    OrderType = o.OrderType, //訂單類型，0為美甲師自訂的項目編號，1為demo集編號。
                                    OrderItem = o.OrderItem,
                                    OrderItemName = o.OrderItemName,
                                    OrderOrderTime = o.OrderOrderTime.ToString("yyyy-MM-dd HH:mm"),
                                    OrderAcceptTime = o.OrderAcceptTime == null ? "-" : ((DateTime)o.OrderAcceptTime).ToString("yyyy-MM-dd HH:mm"),
                                    OrderDoneTime = o.OrderDoneTime == null ? "-" : ((DateTime)o.OrderDoneTime).ToString("yyyy-MM-dd HH:mm"),
                                    OrderCompleteTime = o.OrderCompleteTime == null ? "-" : ((DateTime)o.OrderCompleteTime).ToString("yyyy-MM-dd HH:mm"),
                                    OrderCancelTime = o.OrderCancelTime == null ? "-" : ((DateTime)o.OrderCancelTime).ToString("yyyy-MM-dd HH:mm"),
                                    OrderStateC = o.OrderStateC,
                                    OrderStateName = os.CodeRepresent // 狀態
                                };

            //var orderTable = await _context.OrderTables.FindAsync(id);

            if (newOrderTable == null)
            {
                return NotFound();
            }

            return await newOrderTable.ToListAsync();
        }

        // GET: api/OrderTables2/condition/{OdateS}/{OdateE}/{orderStateC}/{orderId}
        [HttpGet("condition/{OdateS}/{OdateE}/{orderStateC}/{orderId}")]
        public async Task<ActionResult<dynamic>> GetOrderCondition(string OdateS, string OdateE, string reportP, string orderStateC ,int orderId)
        {
            var date1 = DateTime.Parse(OdateS);
            var date2 = DateTime.Parse(OdateE).AddMinutes(1439);

            var query = from o in _context.OrderTables
                        select o;

            var result = query;
            if (OdateS != "1900-01-01" && OdateE != "3000-01-01")
            {
                result = result.Where(a => a.OrderOrderTime >= Convert.ToDateTime(date1)
                                        && a.OrderOrderTime <= Convert.ToDateTime(date2));
            }

            if (orderStateC == "AA") { result = query; }
            else { result = result.Where(a => a.OrderStateC == orderStateC); }


            if (orderId != 0) { result = result.Where(a => a.OrderId == orderId); }
           

            var result2 = from o in result
                                 join os in _context.CodeTables on o.OrderStateC equals os.CodeId
                                 select new
                                 {
                                     OrderId = o.OrderId,
                                     OrderOrderTime = o.OrderOrderTime.ToString("yyyy-MM-dd HH:mm"),
                                     OrderStateC = o.OrderStateC,
                                     OrderStateName = os.CodeRepresent // 狀態
                                 };
            return await result2.ToListAsync();
        }

        private bool OrderTableExists(int id)
        {
            return _context.OrderTables.Any(e => e.OrderId == id);
        }
    }
}
