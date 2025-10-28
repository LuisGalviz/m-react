namespace RealEstate.Application.DTOs;

/// <summary>
/// Detailed Data Transfer Object for Property entity with owner information
/// </summary>
public class PropertyDetailDto
{
    public string IdProperty { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
    public string? Image { get; set; }
    public OwnerDto? Owner { get; set; }
    public List<string> AdditionalImages { get; set; } = new();
}
