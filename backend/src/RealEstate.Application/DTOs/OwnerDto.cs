namespace RealEstate.Application.DTOs;

/// <summary>
/// Data Transfer Object for Owner entity
/// </summary>
public class OwnerDto
{
    public string IdOwner { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Photo { get; set; }
}
