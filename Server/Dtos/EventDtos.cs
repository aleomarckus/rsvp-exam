namespace Server.Dtos;

public record EventCreateDto (
    string Name, 
    DateTime Date,
    TimeSpan Time,
    string Location,
    string Description,
    int MaxRsvpCount,
    string? TimeZoneId
) : IEventDto;

public record EventUpdateDto (
    string Name, 
    DateTime Date,
    TimeSpan Time,
    string Location,
    string Description,
    int MaxRsvpCount,
    string? TimeZoneId
) : IEventDto;

public record EventViewDto (
    int Id,
    string Name,
    DateTime Date,
    TimeSpan Time,
    string Location,
    string? Description,
    int MaxRsvpCount,
    int CurrentRsvpCount,
    string CreatedByUsername,
    bool IsRsvped
);