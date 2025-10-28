using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

/// <summary>
/// Represents a property owner in the real estate system
/// </summary>
public class Owner
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string IdOwner { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("photo")]
    public string? Photo { get; set; }

    [BsonElement("birthday")]
    public DateTime Birthday { get; set; }
}
