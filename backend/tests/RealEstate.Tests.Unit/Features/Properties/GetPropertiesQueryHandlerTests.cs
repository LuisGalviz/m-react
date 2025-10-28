using AutoMapper;
using Moq;
using NUnit.Framework;
using RealEstate.Application.DTOs;
using RealEstate.Application.Features.Properties.Queries;
using RealEstate.Application.Mappings;
using RealEstate.Domain.Entities;
using RealEstate.Domain.Interfaces;

namespace RealEstate.Tests.Unit.Features.Properties;

/// <summary>
/// Unit tests for GetPropertiesQueryHandler
/// </summary>
[TestFixture]
public class GetPropertiesQueryHandlerTests
{
    private Mock<IPropertyRepository> _mockPropertyRepository = null!;
    private Mock<IPropertyImageRepository> _mockImageRepository = null!;
    private IMapper _mapper = null!;
    private GetPropertiesQueryHandler _handler = null!;

    [SetUp]
    public void Setup()
    {
        _mockPropertyRepository = new Mock<IPropertyRepository>();
        _mockImageRepository = new Mock<IPropertyImageRepository>();

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<MappingProfile>();
        });
        _mapper = mapperConfig.CreateMapper();

        _handler = new GetPropertiesQueryHandler(
            _mockPropertyRepository.Object,
            _mockImageRepository.Object,
            _mapper);
    }

    [Test]
    public async Task Handle_WithNoFilters_ReturnsAllProperties()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                IdProperty = "1",
                IdOwner = "owner1",
                Name = "Beautiful House",
                Address = "123 Main St",
                Price = 250000
            },
            new Property
            {
                IdProperty = "2",
                IdOwner = "owner2",
                Name = "Modern Apartment",
                Address = "456 Oak Ave",
                Price = 180000
            }
        };

        _mockPropertyRepository
            .Setup(x => x.GetAllAsync(null, null, null, null, default))
            .ReturnsAsync(properties);

        _mockImageRepository
            .Setup(x => x.GetFirstImageByPropertyIdAsync(It.IsAny<string>(), default))
            .ReturnsAsync((PropertyImage?)null);

        var query = new GetPropertiesQuery();

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        var resultList = result.ToList();
        Assert.That(resultList, Has.Count.EqualTo(2));
        Assert.That(resultList[0].Name, Is.EqualTo("Beautiful House"));
        Assert.That(resultList[1].Name, Is.EqualTo("Modern Apartment"));
    }

    [Test]
    public async Task Handle_WithNameFilter_ReturnsFilteredProperties()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                IdProperty = "1",
                IdOwner = "owner1",
                Name = "Beautiful House",
                Address = "123 Main St",
                Price = 250000
            }
        };

        _mockPropertyRepository
            .Setup(x => x.GetAllAsync("Beautiful", null, null, null, default))
            .ReturnsAsync(properties);

        _mockImageRepository
            .Setup(x => x.GetFirstImageByPropertyIdAsync(It.IsAny<string>(), default))
            .ReturnsAsync((PropertyImage?)null);

        var query = new GetPropertiesQuery { Name = "Beautiful" };

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        var resultList = result.ToList();
        Assert.That(resultList, Has.Count.EqualTo(1));
        Assert.That(resultList[0].Name, Is.EqualTo("Beautiful House"));
    }

    [Test]
    public async Task Handle_WithPriceRangeFilter_ReturnsFilteredProperties()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                IdProperty = "1",
                IdOwner = "owner1",
                Name = "Affordable Condo",
                Address = "789 Elm St",
                Price = 150000
            }
        };

        _mockPropertyRepository
            .Setup(x => x.GetAllAsync(null, null, 100000, 200000, default))
            .ReturnsAsync(properties);

        _mockImageRepository
            .Setup(x => x.GetFirstImageByPropertyIdAsync(It.IsAny<string>(), default))
            .ReturnsAsync((PropertyImage?)null);

        var query = new GetPropertiesQuery
        {
            MinPrice = 100000,
            MaxPrice = 200000
        };

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        var resultList = result.ToList();
        Assert.That(resultList, Has.Count.EqualTo(1));
        Assert.That(resultList[0].Price, Is.EqualTo(150000));
    }

    [Test]
    public async Task Handle_WithImage_IncludesImageInDto()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                IdProperty = "1",
                IdOwner = "owner1",
                Name = "House with Image",
                Address = "321 Pine St",
                Price = 300000
            }
        };

        var image = new PropertyImage
        {
            IdPropertyImage = "img1",
            IdProperty = "1",
            File = "https://example.com/image.jpg",
            Enabled = true
        };

        _mockPropertyRepository
            .Setup(x => x.GetAllAsync(null, null, null, null, default))
            .ReturnsAsync(properties);

        _mockImageRepository
            .Setup(x => x.GetFirstImageByPropertyIdAsync("1", default))
            .ReturnsAsync(image);

        var query = new GetPropertiesQuery();

        // Act
        var result = await _handler.Handle(query, default);

        // Assert
        Assert.That(result, Is.Not.Null);
        var resultList = result.ToList();
        Assert.That(resultList, Has.Count.EqualTo(1));
        Assert.That(resultList[0].Image, Is.EqualTo("https://example.com/image.jpg"));
    }
}
