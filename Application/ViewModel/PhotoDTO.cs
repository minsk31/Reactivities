using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.ViewModel
{
    public class PhotoDTO
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public bool IsMain { get; set; }
    }
}