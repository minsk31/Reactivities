using API.Helpers;
using Application.Photos;
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

            CreateMap<ActivityAttendee, AttendeeDTO>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(s => ImageHelper.GetSourceFromBytes(s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Bytes)));

            CreateMap<PhotoCreateResult.PhotoInfra, Photo>();

            CreateMap<AppUser, ViewModel.Profile>()
             .ForMember(d => d.Image, o => o.MapFrom(s => ImageHelper.GetSourceFromBytes(s.Photos.FirstOrDefault(x => x.IsMain).Bytes)));

            CreateMap<Photo, PhotoDTO>()
            .ForMember(d => d.Image, o => o.MapFrom(s => ImageHelper.GetSourceFromBytes(s.Bytes)));

            CreateMap<Comment, CommentDTO>()
            .ForMember(d => d.Image,
             o => o.MapFrom(s => ImageHelper.GetSourceFromBytes(s.Author.Photos.FirstOrDefault(x => x.IsMain).Bytes)))
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName));
        }
    }
}