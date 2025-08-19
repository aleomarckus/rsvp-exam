using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Dtos;
using Server.Middleware;

namespace Server.Endpoints;

public static class RsvpEndpoints
{
    public static RouteGroupBuilder MapRsvpEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var gr = endpoints.MapGroup("api/rsvp");

        gr.MapPost("/{eventId:int}", async (HttpContext context, RsvpDbContext db, int eventId) =>
        {
            var user = context.GetUsername();
            if(string.IsNullOrEmpty(user)) 
                return Results.Unauthorized();
            
            var ev = await db.Events.Include(e => e.Rsvps).FirstOrDefaultAsync(e => e.Id == eventId);
            if(ev == null) return Results.NotFound();

            int current = ev.Rsvps.Count;
            bool isFull = current >= ev.MaxRsvpCount;
            var isRsvped = await db.Rsvps.AnyAsync(r => r.EventId == eventId && r.Username == user);

            if (isRsvped)
                return Results.Conflict(new { message = "Already Rsvped"});
            
            if(isFull)
                return Results.BadRequest(new { message = "Event is full" });
            
            db.Rsvps.Add(new Server.Models.Rsvp { EventId = eventId, Username = user });
            await db.SaveChangesAsync();
            
            var updated = current + 1;
            
            return Results.Ok(new RsvpResultDto(eventId, updated, ev.MaxRsvpCount, IsRsvped: true, IsFull: updated >= ev.MaxRsvpCount));
        });

        return gr;
    }
}