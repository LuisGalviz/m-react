using MediatR;
using RealEstate.Application.DTOs;

namespace RealEstate.Application.Features.Properties.Queries;

/// <summary>
/// Query to get a list of properties with optional filters
/// </summary>
public class GetPropertiesQuery : IRequest<IEnumerable<PropertyDto>>
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
