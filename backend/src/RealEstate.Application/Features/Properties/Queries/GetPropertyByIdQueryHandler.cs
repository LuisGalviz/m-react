using AutoMapper;
using MediatR;
using RealEstate.Application.DTOs;
using RealEstate.Domain.Interfaces;

namespace RealEstate.Application.Features.Properties.Queries;

/// <summary>
/// Handler for GetPropertyByIdQuery
/// </summary>
public class GetPropertyByIdQueryHandler : IRequestHandler<GetPropertyByIdQuery, PropertyDetailDto?>
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IOwnerRepository _ownerRepository;
    private readonly IPropertyImageRepository _imageRepository;
    private readonly IMapper _mapper;

    public GetPropertyByIdQueryHandler(
        IPropertyRepository propertyRepository,
        IOwnerRepository ownerRepository,
        IPropertyImageRepository imageRepository,
        IMapper mapper)
    {
        _propertyRepository = propertyRepository;
        _ownerRepository = ownerRepository;
        _imageRepository = imageRepository;
        _mapper = mapper;
    }

    public async Task<PropertyDetailDto?> Handle(
        GetPropertyByIdQuery request,
        CancellationToken cancellationToken)
    {
        var property = await _propertyRepository.GetByIdAsync(request.Id, cancellationToken);

        if (property == null)
            return null;

        var dto = _mapper.Map<PropertyDetailDto>(property);

        // Get owner information
        var owner = await _ownerRepository.GetByIdAsync(property.IdOwner, cancellationToken);
        if (owner != null)
        {
            dto.Owner = _mapper.Map<OwnerDto>(owner);
        }

        // Get all images
        var images = await _imageRepository.GetByPropertyIdAsync(
            property.IdProperty,
            cancellationToken);

        var imagesList = images.Where(i => i.Enabled).Select(i => i.File).ToList();

        if (imagesList.Any())
        {
            dto.Image = imagesList.First();
            dto.AdditionalImages = imagesList.Skip(1).ToList();
        }

        return dto;
    }
}
