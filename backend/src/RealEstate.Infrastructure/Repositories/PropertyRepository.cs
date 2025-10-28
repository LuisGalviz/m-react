using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;
using RealEstate.Infrastructure.Persistence;

namespace RealEstate.Infrastructure.Repositories;

/// <summary>
/// MongoDB implementation of IPropertyRepository
/// </summary>
public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _properties;

    public PropertyRepository(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _properties = database.GetCollection<Property>(settings.Value.PropertiesCollection);

        // Create indexes for better query performance
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        var nameIndexModel = new CreateIndexModel<Property>(
            Builders<Property>.IndexKeys.Ascending(p => p.Name));

        var addressIndexModel = new CreateIndexModel<Property>(
            Builders<Property>.IndexKeys.Ascending(p => p.Address));

        var priceIndexModel = new CreateIndexModel<Property>(
            Builders<Property>.IndexKeys.Ascending(p => p.Price));

        _properties.Indexes.CreateMany(new[] { nameIndexModel, addressIndexModel, priceIndexModel });
    }

    public async Task<IEnumerable<Property>> GetAllAsync(
        string? name = null,
        string? address = null,
        decimal? minPrice = null,
        decimal? maxPrice = null,
        CancellationToken cancellationToken = default)
    {
        var filterBuilder = Builders<Property>.Filter;
        var filters = new List<FilterDefinition<Property>>();

        // Apply filters if provided
        if (!string.IsNullOrWhiteSpace(name))
        {
            filters.Add(filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(name, "i")));
        }

        if (!string.IsNullOrWhiteSpace(address))
        {
            filters.Add(filterBuilder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(address, "i")));
        }

        if (minPrice.HasValue)
        {
            filters.Add(filterBuilder.Gte(p => p.Price, minPrice.Value));
        }

        if (maxPrice.HasValue)
        {
            filters.Add(filterBuilder.Lte(p => p.Price, maxPrice.Value));
        }

        // Combine all filters
        var finalFilter = filters.Count > 0
            ? filterBuilder.And(filters)
            : filterBuilder.Empty;

        return await _properties
            .Find(finalFilter)
            .SortBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<Property?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _properties
            .Find(p => p.IdProperty == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Property> CreateAsync(Property property, CancellationToken cancellationToken = default)
    {
        await _properties.InsertOneAsync(property, cancellationToken: cancellationToken);
        return property;
    }

    public async Task<bool> UpdateAsync(Property property, CancellationToken cancellationToken = default)
    {
        var result = await _properties.ReplaceOneAsync(
            p => p.IdProperty == property.IdProperty,
            property,
            cancellationToken: cancellationToken);

        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var result = await _properties.DeleteOneAsync(
            p => p.IdProperty == id,
            cancellationToken);

        return result.DeletedCount > 0;
    }
}
