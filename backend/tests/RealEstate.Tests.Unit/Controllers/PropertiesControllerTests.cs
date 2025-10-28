using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using RealEstate.API.Controllers;
using RealEstate.Application.DTOs;
using RealEstate.Application.Features.Properties.Queries;

namespace RealEstate.Tests.Unit.Controllers;

/// <summary>
/// Unit tests for PropertiesController
/// </summary>
[TestFixture]
public class PropertiesControllerTests
{
    private Mock<IMediator> _mockMediator = null!;
    private Mock<ILogger<PropertiesController>> _mockLogger = null!;
    private PropertiesController _controller = null!;

    [SetUp]
    public void Setup()
    {
        _mockMediator = new Mock<IMediator>();
        _mockLogger = new Mock<ILogger<PropertiesController>>();
        _controller = new PropertiesController(_mockMediator.Object, _mockLogger.Object);
    }

    [Test]
    public async Task GetProperties_WithNoFilters_ReturnsOkWithProperties()
    {
        // Arrange
        var properties = new List<PropertyDto>
        {
            new PropertyDto
            {
                IdProperty = "1",
                IdOwner = "owner1",
                Name = "House 1",
                Address = "123 Main St",
                Price = 250000
            },
            new PropertyDto
            {
                IdProperty = "2",
                IdOwner = "owner2",
                Name = "House 2",
                Address = "456 Oak Ave",
                Price = 180000
            }
        };

        _mockMediator
            .Setup(x => x.Send(It.IsAny<GetPropertiesQuery>(), default))
            .ReturnsAsync(properties);

        // Act
        var result = await _controller.GetProperties(null, null, null, null);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult!.Value, Is.EqualTo(properties));
    }

    [Test]
    public async Task GetProperties_WithFilters_PassesFiltersToMediator()
    {
        // Arrange
        var properties = new List<PropertyDto>();
        GetPropertiesQuery? capturedQuery = null;

        _mockMediator
            .Setup(x => x.Send(It.IsAny<GetPropertiesQuery>(), default))
            .Callback<IRequest<IEnumerable<PropertyDto>>, CancellationToken>((query, _) =>
            {
                capturedQuery = query as GetPropertiesQuery;
            })
            .ReturnsAsync(properties);

        // Act
        await _controller.GetProperties("Beautiful", "123 Main", 100000, 500000);

        // Assert
        Assert.That(capturedQuery, Is.Not.Null);
        Assert.That(capturedQuery!.Name, Is.EqualTo("Beautiful"));
        Assert.That(capturedQuery.Address, Is.EqualTo("123 Main"));
        Assert.That(capturedQuery.MinPrice, Is.EqualTo(100000));
        Assert.That(capturedQuery.MaxPrice, Is.EqualTo(500000));
    }

    [Test]
    public async Task GetProperties_ReturnsEmptyList_WhenNoPropertiesFound()
    {
        // Arrange
        var emptyList = new List<PropertyDto>();

        _mockMediator
            .Setup(x => x.Send(It.IsAny<GetPropertiesQuery>(), default))
            .ReturnsAsync(emptyList);

        // Act
        var result = await _controller.GetProperties(null, null, null, null);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        var resultList = okResult!.Value as IEnumerable<PropertyDto>;
        Assert.That(resultList, Is.Empty);
    }

    [Test]
    public async Task GetPropertyById_WithValidId_ReturnsOkWithProperty()
    {
        // Arrange
        var property = new PropertyDetailDto
        {
            IdProperty = "1",
            Name = "Luxury Villa",
            Address = "100 Sunset Blvd",
            Price = 500000
        };

        _mockMediator
            .Setup(x => x.Send(It.Is<GetPropertyByIdQuery>(q => q.Id == "1"), default))
            .ReturnsAsync(property);

        // Act
        var result = await _controller.GetPropertyById("1", default);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult!.Value, Is.EqualTo(property));
    }

    [Test]
    public async Task GetPropertyById_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        _mockMediator
            .Setup(x => x.Send(It.IsAny<GetPropertyByIdQuery>(), default))
            .ReturnsAsync((PropertyDetailDto?)null);

        // Act
        var result = await _controller.GetPropertyById("nonexistent", default);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetPropertyById_PassesCorrectIdToMediator()
    {
        // Arrange
        string? capturedId = null;

        _mockMediator
            .Setup(x => x.Send(It.IsAny<GetPropertyByIdQuery>(), default))
            .Callback<IRequest<PropertyDetailDto?>, CancellationToken>((query, _) =>
            {
                capturedId = (query as GetPropertyByIdQuery)?.Id;
            })
            .ReturnsAsync((PropertyDetailDto?)null);

        // Act
        await _controller.GetPropertyById("test-id-123", default);

        // Assert
        Assert.That(capturedId, Is.EqualTo("test-id-123"));
    }
}
