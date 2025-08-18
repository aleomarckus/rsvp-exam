using Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Server.Data.Configurations;

public class RsvpConfig : IEntityTypeConfiguration<Rsvp>
{
    public void Configure(EntityTypeBuilder<Rsvp> builder)
    {
        builder.HasIndex(r => r.Id);
    }
}