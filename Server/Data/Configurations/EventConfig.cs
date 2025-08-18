using Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Server.Data.Configurations;

public class EventConfig : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> etb)
    {
        etb.Property(e => e.DateTime).HasColumnType("datetime");
        etb.HasMany(e => e.Rsvps)
            .WithOne(r => r.Event)
            .HasForeignKey(r => r.EventId)
            .OnDelete(DeleteBehavior.Cascade);
        etb.HasIndex(e => new { e.CreatedByUsername, e.DateTime });
    }
}