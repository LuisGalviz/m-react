using RealEstate.Domain.Entities;

namespace RealEstate.Domain.Interfaces;

/// <summary>
/// Repository interface for Property entity operations
/// </summary>
public interface IPropertyRepository
{
    /// <summary>
    /// Gets all properties with optional filters
    /// </summary>
    Task<IEnumerable<Property>> GetAllAsync(
        string? name = null,
        string? address = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a property by its ID
    /// </summary>
    Task<Property?> GetByIdAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new property
    /// </summary>
    Task<Property> CreateAsync(Property property, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing property
    /// </summary>
    Task<bool> UpdateAsync(Property property, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a property
    /// </summary>
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}
