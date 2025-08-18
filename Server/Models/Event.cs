using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Event
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime DateTime { get; set; }

    [Required, MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(800)]
    public string? Description { get; set; }
    
    [Range(1, int.MaxValue)]
    public int MaxRsvpCount { get; set; }

    [Required, MaxLength(100)]
    public string CreatedByUsername { get; init; } = string.Empty;

    public DateTime CreatedAtUtc { get; init; } = DateTime.UtcNow;
    public ICollection<Rsvp> Rsvps { get; init; } = new List<Rsvp>();
    
}