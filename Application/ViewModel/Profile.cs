using Domain;

namespace Application.ViewModel
{
    public class Profile
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public byte[] ImageRaw { get; set; }        
        public bool Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }
        public ICollection<PhotoDTO> Photos {get; set;}
    }
}