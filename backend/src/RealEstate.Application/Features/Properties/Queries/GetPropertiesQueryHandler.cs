using AutoMapper;
using MediatR;
using RealEstate.Application.DTOs;
using RealEstate.Domain.Interfaces;

namespace RealEstate.Application.Features.Properties.Queries;

/// <summary>
/// Handler for GetPropertiesQuery
/// </summary>
public class GetPropertiesQueryHandler : IRequestHandler<GetPropertiesQuery, IEnumerable<PropertyDto>>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IPropertyImageRepository _imageRepository;
    private readonly IMapper _mapper;

    public GetPropertiesQueryHandler(
        IPropertyRepository propertyRepository,
        IPropertyImageRepository imageRepository,
        IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _imageRepository = imageRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PropertyDto>> Handle(
        GetPropertiesQuery request,
        CancellationToken cancellationToken)
    {
        // Get properties with filters
        var properties = await _propertyRepository.GetAllAsync(
            request.Name,
            request.Address,
            request.MinPrice,
            request.MaxPrice,
            cancellationToken);

        var propertyDtos = new List<PropertyDto>();

        foreach (var property in properties)
        {
            var dto = _mapper.Map<PropertyDto>(property);

            // Get the first enabled image for each property
            var firstImage = await _imageRepository.GetFirstImageByPropertyIdAsync(
                property.IdProperty,
                cancellationToken);

            dto.Image = firstImage?.File;

            propertyDtos.Add(dto);
        }

        return propertyDtos;
    }
}
