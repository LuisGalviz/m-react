using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;
using RealEstate.Infrastructure.Persistence;

namespace RealEstate.Infrastructure.Repositories;

/// <summary>
/// MongoDB implementation of IOwnerRepository
/// </summary>
public class OwnerRepository : IOwnerRepository
{
    private readonly IMongoCollection<Owner> _owners;

    public OwnerRepository(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _owners = database.GetCollection<Owner>(settings.Value.OwnersCollection);
    }

    public async Task<Owner?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _owners
            .Find(o => o.IdOwner == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<Owner>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _owners
            .Find(_ => true)
            .ToListAsync(cancellationToken);
    }
}
