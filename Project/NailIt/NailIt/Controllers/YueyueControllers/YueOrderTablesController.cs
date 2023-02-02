﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.YueyueControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YueOrderTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueOrderTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/OrderTables/2/A0
        [HttpGet("{id}/{state}")]
        public async Task<List<YueReserveView>> GetOrderTable(string id,string state)
        {

            var myOrder =
            from Order in _context.OrderTables
            join Member in _context.MemberTables on Order.MemberId equals Member.MemberId
            join Plan in _context.PlanTables on Order.PlanId equals Plan.PlanId
            join Code in _context.CodeTables on Order.OrderPartC equals Code.CodeId
            join Code2 in _context.CodeTables on Order.OrderRemovalC equals Code2.CodeId
            join DemoSet in _context.DemoSetTables on Order.OrderItem equals DemoSet.DemoSetId into t1
            from subDemoSet in t1.DefaultIfEmpty()
            join Manicurist in _context.ManicuristTables on Order.ManicuristId equals Manicurist.ManicuristId into t2
            from subMamicurist in t2.DefaultIfEmpty()
            where (Order.ManicuristId == Convert.ToInt32(id) && Order.OrderStateC == state)
            select new YueReserveView()
            {
                order_ID = Order.OrderId,
                member_ID = Order.MemberId,
                manicurist_ID = Order.ManicuristId,
                order_Price = Order.OrderPrice,
                order_Deposit = Order.OrderDeposit,
                order_Type = Order.OrderType,
                order_ItemName = Order.OrderItemName,
                order_OrderTime = Order.OrderOrderTime,
                order_AcceptTime = Order.OrderAcceptTime,
                order_CompleteTime = Order.OrderCompleteTime,
                order_DoneTime = Order.OrderDoneTime,
                order_CancelTime = Order.OrderCancelTime,
                member_Nickname = Member.MemberNickname,
                plan_StartTime = Plan.PlanStartTime,
                plan_Remark = Plan.PlanRemark,
                order_part = Code.CodeRepresent,
                order_removal = Code2.CodeRepresent,
                order_item=Order.OrderItem,
                demoSet_Content = Order.OrderType == true ? subDemoSet.DemoSetContent : "",
                order_Cover = Order.OrderType == true ? subDemoSet.DemoSetCover : subMamicurist.ManicuristPic
            };



            if (myOrder == null)
            {
                return null;
            }
            else
                return await myOrder.ToListAsync();
        }

        // PUT: api/OrderTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}/{state}")]
        public async Task<bool> PutOrderTable(int id, string state)
        {
            var myOrder = await _context.OrderTables.FindAsync(id);
            if (myOrder==null)
                return false;
            _context.Entry(myOrder).State = EntityState.Modified;
            myOrder.OrderStateC = state;
            if (state == "A1")
                myOrder.OrderAcceptTime = DateTime.Now;
            else if (state == "A7")
                myOrder.OrderCancelTime = DateTime.Now;
            else if (state == "A2")
                myOrder.OrderCompleteTime = DateTime.Now;
            else if (state == "A6")
                myOrder.OrderDoneTime = DateTime.Now;
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
