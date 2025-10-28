using AutoMapper;
using Moq;
using NUnit.Framework;
using RealEstate.Application.Features.Properties.Queries;
using RealEstate.Application.Mappings;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;

namespace RealEstate.Tests.Unit.Features.Properties;

/// <summary>
/// Unit tests for GetPropertyByIdQueryHandler
/// </summary>
[TestFixture]
public class GetPropertyByIdQueryHandlerTests
{
    private Mock<IPropertyRepository> _mockPropertyRepository = null!;
    private Mock<IOwnerRepository> _mockOwnerRepository = null!;
    private Mock<IPropertyImageRepository> _mockImageRepository = null!;
    private IMapper _mapper = null!;
    private GetPropertyByIdQueryHandler _handler = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyRepository = new Mock<IPropertyRepository>();
        _mockOwnerRepository = new Mock<IOwnerRepository>();
        _mockImageRepository = new Mock<IPropertyImageRepository>();

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });
        _mapper = mapperConfig.CreateMapper();

        _handler = new GetPropertyByIdQueryHandler(
            _mockPropertyRepository.Object,
            _mockOwnerRepository.Object,
            _mockImageRepository.Object,
            _mapper);
    }

    [Test]
    public async Task Handle_PropertyExists_ReturnsPropertyDetails()
    {
        // Arrange
        var property = new Property
        {
            IdProperty = "1",
            IdOwner = "owner1",
            Name = "Luxury Villa",
            Address = "100 Sunset Blvd",
            Price = 500000,
            CodeInternal = "LV001",
            Year = 2020
        };

        var owner = new Owner
        {
            IdOwner = "owner1",
            Name = "John Doe",
            Address = "200 Owner St",
            Photo = "https://example.com/owner.jpg",
            Birthday = new DateTime(1980, 5, 15)
        };

        var images = new List<PropertyImage>
        {
            new PropertyImage
            {
                IdPropertyImage = "img1",
                IdProperty = "1",
                File = "https://example.com/img1.jpg",
                Enabled = true
            },
            new PropertyImage
            {
                IdPropertyImage = "img2",
                IdProperty = "1",
                File = "https://example.com/img2.jpg",
                Enabled = true
            }
        };

        _mockPropertyRepository
            .Setup(x => x.GetByIdAsync("1", default))
            .ReturnsAsync(property);

        _mockOwnerRepository
            .Setup(x => x.GetByIdAsync("owner1", default))
            .ReturnsAsync(owner);

        _mockImageRepository
            .Setup(x => x.GetByPropertyIdAsync("1", default))
            .ReturnsAsync(images);

        var query = new GetPropertyByIdQuery("1");

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.IdProperty, Is.EqualTo("1"));
        Assert.That(result.Name, Is.EqualTo("Luxury Villa"));
        Assert.That(result.Owner, Is.Not.Null);
        Assert.That(result.Owner!.Name, Is.EqualTo("John Doe"));
        Assert.That(result.Image, Is.EqualTo("https://example.com/img1.jpg"));
        Assert.That(result.AdditionalImages, Has.Count.EqualTo(1));
    }

    [Test]
    public async Task Handle_PropertyNotFound_ReturnsNull()
    {
        // Arrange
        _mockPropertyRepository
            .Setup(x => x.GetByIdAsync("nonexistent", default))
            .ReturnsAsync((Property?)null);

        var query = new GetPropertyByIdQuery("nonexistent");

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Null);
    }

    [Test]
    public async Task Handle_PropertyWithoutOwner_ReturnsPropertyWithoutOwnerInfo()
    {
        // Arrange
        var property = new Property
        {
            IdProperty = "1",
            IdOwner = "owner1",
            Name = "Orphan Property",
            Address = "123 No Owner St",
            Price = 200000,
            CodeInternal = "OP001",
            Year = 2019
        };

        _mockPropertyRepository
            .Setup(x => x.GetByIdAsync("1", default))
            .ReturnsAsync(property);

        _mockOwnerRepository
            .Setup(x => x.GetByIdAsync("owner1", default))
            .ReturnsAsync((Owner?)null);

        _mockImageRepository
            .Setup(x => x.GetByPropertyIdAsync("1", default))
            .ReturnsAsync(new List<PropertyImage>());

        var query = new GetPropertyByIdQuery("1");

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Owner, Is.Null);
    }

    [Test]
    public async Task Handle_PropertyWithoutImages_ReturnsPropertyWithNoImages()
    {
        // Arrange
        var property = new Property
        {
            IdProperty = "1",
            IdOwner = "owner1",
            Name = "No Image Property",
            Address = "456 Imageless Ave",
            Price = 150000,
            CodeInternal = "NI001",
            Year = 2018
        };

        _mockPropertyRepository
            .Setup(x => x.GetByIdAsync("1", default))
            .ReturnsAsync(property);

        _mockOwnerRepository
            .Setup(x => x.GetByIdAsync("owner1", default))
            .ReturnsAsync((Owner?)null);

        _mockImageRepository
            .Setup(x => x.GetByPropertyIdAsync("1", default))
            .ReturnsAsync(new List<PropertyImage>());

        var query = new GetPropertyByIdQuery("1");

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Image, Is.Null);
        Assert.That(result.AdditionalImages, Is.Empty);
    }
}
