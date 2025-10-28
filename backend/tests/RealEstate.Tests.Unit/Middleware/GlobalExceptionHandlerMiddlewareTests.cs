using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using RealEstate.API.Middleware;
using System.Text.Json;

namespace RealEstate.Tests.Unit.Middleware;

/// <summary>
/// Unit tests for GlobalExceptionHandlerMiddleware
/// </summary>
[TestFixture]
public class GlobalExceptionHandlerMiddlewareTests
{
    private Mock<ILogger<GlobalExceptionHandlerMiddleware>> _mockLogger = null!;
    private DefaultHttpContext _httpContext = null!;

    [SetUp]
    public void Setup()
    {
        _mockLogger = new Mock<ILogger<GlobalExceptionHandlerMiddleware>>();
        _httpContext = new DefaultHttpContext();
        _httpContext.Response.Body = new MemoryStream();
    }

    [Test]
    public async Task InvokeAsync_NoException_CallsNextDelegate()
    {
        // Arrange
        var nextCalled = false;
        RequestDelegate next = (HttpContext context) =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        };

        var middleware = new GlobalExceptionHandlerMiddleware(next, _mockLogger.Object);

        // Act
        await middleware.InvokeAsync(_httpContext);

        // Assert
        Assert.That(nextCalled, Is.True);
    }

    [Test]
    public async Task InvokeAsync_WithException_Returns500StatusCode()
    {
        // Arrange
        RequestDelegate next = (HttpContext context) =>
        {
            throw new Exception("Test exception");
        };

        var middleware = new GlobalExceptionHandlerMiddleware(next, _mockLogger.Object);

        // Act
        await middleware.InvokeAsync(_httpContext);

        // Assert
        Assert.That(_httpContext.Response.StatusCode, Is.EqualTo(500));
    }

    [Test]
    public async Task InvokeAsync_WithException_SetsJsonContentType()
    {
        // Arrange
        RequestDelegate next = (HttpContext context) =>
        {
            throw new Exception("Test exception");
        };

        var middleware = new GlobalExceptionHandlerMiddleware(next, _mockLogger.Object);

        // Act
        await middleware.InvokeAsync(_httpContext);

        // Assert
        Assert.That(_httpContext.Response.ContentType, Is.EqualTo("application/json"));
    }

    [Test]
    public async Task InvokeAsync_WithException_IncludesCorsHeaders()
    {
        // Arrange
        RequestDelegate next = (HttpContext context) =>
        {
            throw new Exception("Test exception");
        };

        var middleware = new GlobalExceptionHandlerMiddleware(next, _mockLogger.Object);

        // Act
        await middleware.InvokeAsync(_httpContext);

        // Assert
        Assert.That(_httpContext.Response.Headers.ContainsKey("Access-Control-Allow-Origin"), Is.True);
        Assert.That(_httpContext.Response.Headers["Access-Control-Allow-Origin"].ToString(), Is.EqualTo("*"));
    }

    [Test]
    public async Task InvokeAsync_WithException_ReturnsErrorResponseBody()
    {
        // Arrange
        var exceptionMessage = "Test exception message";
        RequestDelegate next = (HttpContext context) =>
        {
            throw new Exception(exceptionMessage);
        };

        var middleware = new GlobalExceptionHandlerMiddleware(next, _mockLogger.Object);

        // Act
        await middleware.InvokeAsync(_httpContext);

        // Assert
        _httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(_httpContext.Response.Body).ReadToEndAsync();

        Assert.That(responseBody, Does.Contain("An error occurred while processing your request"));
        Assert.That(responseBody, Does.Contain(exceptionMessage));
    }

    [Test]
    public async Task InvokeAsync_WithException_LogsError()
    {
        // Arrange
        var exception = new Exception("Test exception");
        RequestDelegate next = (HttpContext context) =>
        {
            throw exception;
        };

        var middleware = new GlobalExceptionHandlerMiddleware(next, _mockLogger.Object);

        // Act
        await middleware.InvokeAsync(_httpContext);

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                exception,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}
