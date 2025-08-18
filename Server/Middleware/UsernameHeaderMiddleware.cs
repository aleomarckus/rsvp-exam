namespace Server.Middleware;

public class UsernameHeaderMiddleware(RequestDelegate next)
{
    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue("X-Username", out var username) && !string.IsNullOrWhiteSpace(username))
        {
            context.Items["Username"] = username.ToString().Trim();
        }
        await next(context);
    }
}

public static class UsernameHeaderMiddlewareExtensions
{
    public static IApplicationBuilder UseUsernameHeaderMiddleware(this IApplicationBuilder builder) => 
        builder.UseMiddleware<UsernameHeaderMiddleware>();

    public static string? GetUsername(this HttpContext context) =>
        context.Items.TryGetValue("Username", out var un) ? un as string : null;
}