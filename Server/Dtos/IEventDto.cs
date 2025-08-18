namespace Server.Dtos;

public interface IEventDto
{
    string Name { get; }
    DateTime Date { get; }
    TimeSpan Time { get; }
    string Location { get; }
    string? Description { get; }
    int MaxRsvpCount { get; }
    string? TimeZoneId { get; }
}