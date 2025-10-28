using MediatR;
using RealEstate.Application.DTOs;

namespace RealEstate.Application.Features.Properties.Queries;

/// <summary>
/// Query to get a single property by its ID
/// </summary>
public class GetPropertyByIdQuery : IRequest<PropertyDetailDto?>
{
    public string Id { get; set; } = string.Empty;

    public GetPropertyByIdQuery(string id)
    {
        Id = id;
    }
}
