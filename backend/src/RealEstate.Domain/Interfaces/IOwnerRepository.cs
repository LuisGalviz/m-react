using RealEstate.Domain.Entities;

namespace RealEstate.Domain.Interfaces;

/// <summary>
/// Repository interface for Owner entity operations
/// </summary>
public interface IOwnerRepository
{
    /// <summary>
    /// Gets an owner by its ID
    /// </summary>
    Task<Owner?> GetByIdAsync(string id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets all owners
    /// </summary>
    Task<IEnumerable<Owner>> GetAllAsync(CancellationToken cancellationToken = default);
}
