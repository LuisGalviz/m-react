using AutoMapper;
using RealEstate.Application.DTOs;
using RealEstate.Domain.Entities;

namespace RealEstate.Application.Mappings;

/// <summary>
/// AutoMapper profile for entity to DTO mappings
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Property mappings
        CreateMap<Property, PropertyDto>()
            .ForMember(dest => dest.Image, opt => opt.Ignore()); // Will be set manually

        CreateMap<Property, PropertyDetailDto>()
            .ForMember(dest => dest.Image, opt => opt.Ignore()) // Will be set manually
            .ForMember(dest => dest.AdditionalImages, opt => opt.Ignore()); // Will be set manually

        // Owner mappings
        CreateMap<Owner, OwnerDto>();
    }
}
