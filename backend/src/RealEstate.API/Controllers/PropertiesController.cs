using MediatR;
using Microsoft.AspNetCore.Mvc;
using RealEstate.Application.DTOs;
using RealEstate.Application.Features.Properties.Queries;

namespace RealEstate.API.Controllers;

/// <summary>
/// Controller for managing property operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PropertiesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PropertiesController> _logger;

    public PropertiesController(IMediator mediator, ILogger<PropertiesController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Gets all properties with optional filters
    /// </summary>
    /// <param name="name">Filter by property name (case-insensitive partial match)</param>
    /// <param name="address">Filter by property address (case-insensitive partial match)</param>
    /// <param name="minPrice">Filter by minimum price</param>
    /// <param name="maxPrice">Filter by maximum price</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of properties</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<PropertyDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties(
        [FromQuery] string? name = null,
        [FromQuery] string? address = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Getting properties with filters - Name: {Name}, Address: {Address}, MinPrice: {MinPrice}, MaxPrice: {MaxPrice}",
            name, address, minPrice, maxPrice);

        var query = new GetPropertiesQuery
        {
            Name = name,
            Address = address,
            MinPrice = minPrice,
            MaxPrice = maxPrice
        };

        var properties = await _mediator.Send(query, cancellationToken);

        return Ok(properties);
    }

    /// <summary>
    /// Gets a specific property by ID with detailed information
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Property details including owner information</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PropertyDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PropertyDetailDto>> GetPropertyById(
        string id,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Getting property details for ID: {PropertyId}", id);

        var query = new GetPropertyByIdQuery(id);
        var property = await _mediator.Send(query, cancellationToken);

        if (property == null)
        {
            _logger.LogWarning("Property not found with ID: {PropertyId}", id);
            return NotFound(new { message = $"Property with ID {id} not found" });
        }

        return Ok(property);
    }
}
