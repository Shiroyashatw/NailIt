using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerifcodeController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public VerifcodeController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/Verifcode
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Verificationcode>>> GetVerificationcodes()
        {
            return await _context.Verificationcodes.ToListAsync();
        }

        // GET: api/Verifcode/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Verificationcode>> GetVerificationcode(int id)
        {
            var verificationcode = await _context.Verificationcodes.FindAsync(id);

            if (verificationcode == null)
            {
                return NotFound();
            }

            return verificationcode;
        }

        // PUT: api/Verifcode/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVerificationcode(int id, Verificationcode verificationcode)
        {
            if (id != verificationcode.VerifcodeId)
            {
                return BadRequest();
            }

            _context.Entry(verificationcode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VerificationcodeExists(id))
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

        // POST: api/Verifcode
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Verificationcode>> PostVerificationcode(Verificationcode verificationcode)
        {
            if (VerificationcodeExists(verificationcode.VerifcodeId))
            {
                var verifff = await _context.Verificationcodes.FindAsync(verificationcode.VerifcodeId);
                _context.Verificationcodes.Remove(verifff);
            }
            _context.Verificationcodes.Add(verificationcode);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (VerificationcodeExists(verificationcode.VerifcodeId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetVerificationcode", new { id = verificationcode.VerifcodeId }, verificationcode);
        }

        // DELETE: api/Verifcode/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVerificationcode(int id)
        {
            var verificationcode = await _context.Verificationcodes.FindAsync(id);
            if (verificationcode == null)
            {
                return NotFound();
            }

            _context.Verificationcodes.Remove(verificationcode);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VerificationcodeExists(int id)
        {
            return _context.Verificationcodes.Any(e => e.VerifcodeId == id);
        }
    }
}
