using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Domain.Entities;

/// <summary>
/// Represents a property in the real estate system
/// </summary>
public class Property
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string IdProperty { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("price")]
    [BsonRepresentation(BsonType.Decimal128)]
    public decimal Price { get; set; }

    [BsonElement("codeInternal")]
    public string CodeInternal { get; set; } = string.Empty;

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("idOwner")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string IdOwner { get; set; } = string.Empty;

    // Navigation properties (not stored in MongoDB)
    [BsonIgnore]
    public Owner? Owner { get; set; }

    [BsonIgnore]
    public List<PropertyImage> Images { get; set; } = new();

    [BsonIgnore]
    public List<PropertyTrace> Traces { get; set; } = new();
}
