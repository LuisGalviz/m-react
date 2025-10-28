namespace RealEstate.Infrastructure.Persistence;

/// <summary>
/// MongoDB configuration settings
/// </summary>
public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string PropertiesCollection { get; set; } = "Properties";
    public string OwnersCollection { get; set; } = "Owners";
    public string PropertyImagesCollection { get; set; } = "PropertyImages";
    public string PropertyTracesCollection { get; set; } = "PropertyTraces";
}
