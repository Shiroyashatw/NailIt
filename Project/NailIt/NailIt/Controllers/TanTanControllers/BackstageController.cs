using Microsoft.AspNetCore.Mvc;

namespace NailIt.Controllers.TanTanControllers
{
    public class BackstageController : Controller
    {
        public IActionResult Backstage()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
