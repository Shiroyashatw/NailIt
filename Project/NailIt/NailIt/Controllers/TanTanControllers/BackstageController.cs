using Microsoft.AspNetCore.Mvc;

namespace NailIt.Controllers.TanTanControllers
{
    public class BackstageController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
