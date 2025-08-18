using Server.Dtos;
using TimeZoneConverter;

namespace Server.Validators
{
    
}
public static class EventValidator
{
    public static (bool ok, Dictionary<string, string[]> errors) Validate(IEventDto dto, int currentRsvps = 0)
    {
        var errors = new Dictionary<string, string[]>();
        void Add(string k, string m) { if (!errors.TryGetValue(k, out var a)) errors[k] = new[] { m }; else errors[k] = a.Append(m).ToArray(); }

        if (string.IsNullOrWhiteSpace(dto.Name)) Add(nameof(dto.Name), "Event name is required.");
        if (dto.MaxRsvpCount < currentRsvps) Add(nameof(dto.MaxRsvpCount), $"Max RSVP must be >= current RSVPs ({currentRsvps}).");

        var local = new DateTime(dto.Date.Year, dto.Date.Month, dto.Date.Day, dto.Time.Hours, dto.Time.Minutes, 0, DateTimeKind.Unspecified);

        TimeZoneInfo tz;
        try { tz = string.IsNullOrWhiteSpace(dto.TimeZoneId) ? TimeZoneInfo.Utc : TZConvert.GetTimeZoneInfo(dto.TimeZoneId); }
        catch { tz = TimeZoneInfo.Utc; Add(nameof(dto.TimeZoneId), "Unrecognized timezone; treated as UTC."); }

        if (tz.IsInvalidTime(local)) Add("DateTime", "Invalid local time for the selected timezone.");

        var eventUtc = TimeZoneInfo.ConvertTimeToUtc(local, tz);

        if (eventUtc < DateTime.UtcNow.AddMinutes(-1)) Add("DateTime", "Event date/time is in the past for your timezone.");

        return (errors.Count == 0, errors);
    }
}