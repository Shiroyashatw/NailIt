using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using static System.Collections.Specialized.BitVector32;
using System.Web;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace NailIt.Controllers
{
    public class CommunityController : Controller
    {
        private readonly NailitDBContext _context;

        public CommunityController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: Community
        public async Task<IActionResult> Index()
        {
            // setup login user info
            //httpContextAccessor.HttpContext.Session.SetInt32(key, int_value);
            HttpContext.Session.SetInt32("loginId", 1);
            HttpContext.Session.SetString("loginAccount", "Ansel Siao");
            HttpContext.Session.SetString("loginNickname", "Larryyy");

            return View();
        }

    }
}
