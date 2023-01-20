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
    public class YiPCommentController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public YiPCommentController(NailitDBContext PContext)
        {
            Context = PContext;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<CommentTable>>> GetManicuristComment(int id)
        {
            var query = from User in Context.CommentTables
                        where User.CommentTarget == id && User.CommentType == false
                        select User;

            return await query.ToListAsync();
        }
    }
}
