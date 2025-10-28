using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;
using RealEstate.Infrastructure.Persistence;

namespace RealEstate.Infrastructure.Repositories;

/// <summary>
/// MongoDB implementation of IPropertyImageRepository
/// </summary>
public class PropertyImageRepository : IPropertyImageRepository
{
    private readonly IMongoCollection<PropertyImage> _images;

    public PropertyImageRepository(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _images = database.GetCollection<PropertyImage>(settings.Value.PropertyImagesCollection);

        // Create index for better query performance
        var indexModel = new CreateIndexModel<PropertyImage>(
            Builders<PropertyImage>.IndexKeys.Ascending(i => i.IdProperty));
        _images.Indexes.CreateOne(indexModel);
    }

    public async Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(
        string propertyId,
        CancellationToken cancellationToken = default)
    {
        return await _images
            .Find(i => i.IdProperty == propertyId && i.Enabled)
            .ToListAsync(cancellationToken);
    }

    public async Task<PropertyImage?> GetFirstImageByPropertyIdAsync(
        string propertyId,
        CancellationToken cancellationToken = default)
    {
        return await _images
            .Find(i => i.IdProperty == propertyId && i.Enabled)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
