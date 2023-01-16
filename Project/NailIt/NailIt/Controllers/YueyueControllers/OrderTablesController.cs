using System;
using System.Collections.Generic;
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
    public class OrderTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public OrderTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/OrderTables
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<OrderTable>>> GetOrderTables()
        //{
        //    return await _context.OrderTables.ToListAsync();
        //}

        // GET: api/OrderTables/5
        [HttpGet("{id}")]
        public async Task<List<OrderTable>> GetOrderTable(string id)
        {
            var myOrder =
            from Order in _context.OrderTables
            where Order.ManicuristId == Convert.ToInt32(id)
            select Order;

            var orderTable = await _context.OrderTables.FindAsync(Convert.ToInt32(id));

            if (myOrder == null)
            {
                return null;
            }

            return await myOrder.ToListAsync();
        }

        // PUT: api/OrderTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderTable(int id, OrderTable orderTable)
        {
            if (id != orderTable.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(orderTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderTableExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OrderTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderTable>> PostOrderTable(OrderTable orderTable)
        {
            _context.OrderTables.Add(orderTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderTable", new { id = orderTable.OrderId }, orderTable);
        }

        // DELETE: api/OrderTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderTable(int id)
        {
            var orderTable = await _context.OrderTables.FindAsync(id);
            if (orderTable == null)
            {
                return NotFound();
            }

            _context.OrderTables.Remove(orderTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderTableExists(int id)
        {
            return _context.OrderTables.Any(e => e.OrderId == id);
        }
    }
}
