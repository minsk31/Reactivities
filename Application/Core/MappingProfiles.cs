using Application.ViewModel;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : AutoMapper.Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDTO>()
            .ForMember(d => d.HostUserName, o => o.MapFrom(s =>
             s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

             CreateMap<ActivityAttendee, ViewModel.Profile>()
             .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
             .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
             .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}