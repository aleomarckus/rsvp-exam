using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Dtos;
using Server.Middleware;
using Server.Models;
using TimeZoneConverter;

namespace Server.Endpoints;

public static class EventEndpoints
{
    public static RouteGroupBuilder MapEventEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var gr = endpoints.MapGroup("api/events");

        gr.MapGet("/", async (RsvpDbContext db, HttpContext context) =>
        {
            var tzHeader = context.Request.Headers["X-Timezone"].FirstOrDefault();
            TimeZoneInfo tz;
            try { tz = string.IsNullOrWhiteSpace(tzHeader) ? TimeZoneInfo.Utc : TZConvert.GetTimeZoneInfo(tzHeader); }
            catch { tz = TimeZoneInfo.Utc; }
            
            var username = context.Request.Headers["X-Username"].FirstOrDefault();
            var today = DateTime.UtcNow.Date;
            var events = await db.Events
                .Where(e => e.DateTime >= today)
                .OrderBy(e => e.DateTime)
                .Select(e => new EventViewDto(
                    e.Id, 
                    e.Name, 
                    TimeZoneInfo.ConvertTimeFromUtc(e.DateTime, tz).Date, 
                    TimeZoneInfo.ConvertTimeFromUtc(e.DateTime, tz).TimeOfDay, 
                    e.Location, 
                    e.Description,
                    e.MaxRsvpCount, 
                    e.Rsvps.Count, 
                    e.CreatedByUsername, 
            username != null && e.Rsvps.Any(r => r.Username == username)
                ))
                .AsNoTracking()
                .ToListAsync();
            return Results.Ok(events);
        });

        gr.MapGet("my-events", async (HttpContext context, RsvpDbContext db) =>
        {
            var username = context.GetUsername();
            if (string.IsNullOrEmpty(username))
                return Results.Unauthorized();

            var listEvents = await db.Events
                .Where(e => e.CreatedByUsername == username)
                .OrderByDescending(e => e.Id)
                .Select(e => new EventViewDto(
                    e.Id, e.Name, e.DateTime, e.DateTime.TimeOfDay, e.Location, e.Description,
                    e.MaxRsvpCount, e.Rsvps.Count, e.CreatedByUsername,
                    e.Rsvps.Any(r => r.Username == username)
                ))
                
                .AsNoTracking()
                .ToListAsync();
            return Results.Ok(listEvents);
        });
        
        gr.MapPost("/", async (HttpContext ctx, RsvpDbContext db, EventCreateDto dto) =>
        {
            var username = ctx.GetUsername();
            if (string.IsNullOrEmpty(username)) return Results.Unauthorized();
            
            var (validated, errors) = EventValidator.Validate(dto);
            if (!validated)
                return Results.ValidationProblem(errors);
            
            var ev = new Event
            {
                Name = dto.Name.Trim(),
                DateTime = DateTime.SpecifyKind(dto.Date.Date + dto.Time, DateTimeKind.Utc),
                Location = dto.Location.Trim(),
                Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
                MaxRsvpCount = dto.MaxRsvpCount,
                CreatedByUsername = username
            };
            
            db.Events.Add(ev);
            await db.SaveChangesAsync();
            return Results.Created($"/api/events/{ev.Id}", new { ev.Id });
        });

        gr.MapPut("/{id:int}", async (HttpContext context, RsvpDbContext db, int id,  EventUpdateDto dto) =>
        {
            var username = context.GetUsername();
            if (string.IsNullOrEmpty(username))
                return Results.Unauthorized();

            var ev = await db.Events.Include(e => e.Rsvps).FirstOrDefaultAsync(e => e.Id == id);
            if(ev == null)
                return Results.NotFound();
            if (ev.CreatedByUsername != username)
                return Results.Forbid();
            
            var (validated, errors) = EventValidator.Validate(dto, ev?.Rsvps.Count ?? 0);
            if (!validated)
                return Results.ValidationProblem(errors);
            
            var current = ev.Rsvps.Count;
            if(dto.MaxRsvpCount < current) 
                return Results.BadRequest($"Max rsvp count {dto.MaxRsvpCount} is too small");
            
            ev.Name = dto.Name.Trim();
            ev.DateTime = DateTime.SpecifyKind(dto.Date.Date + dto.Time, DateTimeKind.Utc);
            ev.Location = dto.Location.Trim();
            ev.Description = string.IsNullOrEmpty(dto.Description) ? null : dto.Description.Trim();
            ev.MaxRsvpCount = dto.MaxRsvpCount;
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        });
        

        gr.MapDelete("/{id:int}", async (HttpContext ctx, RsvpDbContext db, int id) =>
        {
            var username = ctx.GetUsername();
            if (string.IsNullOrEmpty(username)) return Results.Unauthorized();

            var ev = await db.Events.FindAsync(id);
            if (ev == null) 
                return Results.NotFound();
            if (ev.CreatedByUsername != username)
                return Results.Forbid();
            
            
            db.Events.Remove(ev);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });

        return gr;
    } 
}