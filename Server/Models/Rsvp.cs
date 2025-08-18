using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Rsvp
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    [Required, MaxLength(80)]
    public string Username { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}