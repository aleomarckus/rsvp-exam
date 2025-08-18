namespace Server.Dtos;

public record RsvpResultDto (
    int EventId,
    int MaxRsvpCount,
    int CurrentRsvpCount,
    bool IsRsvped,
    bool IsFull
);