using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.ViewModel
{
    public class UserActivityDTO
    {
        public Guid Id {get; set;}
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        public string HostUserName { get; set; }
    }
}