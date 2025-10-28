using RealEstate.Domain.Entities;

namespace RealEstate.Domain.Interfaces;

/// <summary>
/// Repository interface for PropertyImage entity operations
/// </summary>
public interface IPropertyImageRepository
{
    /// <summary>
    /// Gets all images for a specific property
    /// </summary>
    Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(
        string propertyId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the first enabled image for a property
    /// </summary>
    Task<PropertyImage?> GetFirstImageByPropertyIdAsync(
        string propertyId,
        CancellationToken cancellationToken = default);
}
