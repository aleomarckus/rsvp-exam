using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public class RsvpDbContext(DbContextOptions<RsvpDbContext> options) : DbContext(options)
{
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Rsvp> Rsvps => Set<Rsvp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(RsvpDbContext).Assembly);
        
        modelBuilder.Entity<Rsvp>(b =>
        {
            b.HasIndex(r => new { r.EventId, r.Username }).IsUnique();
            b.Property(r => r.Username).HasMaxLength(80).IsRequired();
        });

        modelBuilder.Entity<Event>(b =>
        {
            b.HasMany(e => e.Rsvps)
                .WithOne(r => r.Event)
                .HasForeignKey(r => r.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}