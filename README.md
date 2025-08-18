# Local Event Planner and RSVP Tracker



## Features

- **Event Management**  
  Create, edit, delete events (owner-only).  
  Enforces max RSVP count and prevents multiple RSVPs per user.

- **RSVP System**  
  RSVP for events, capacity enforcement, cancel RSVPs.  
  RSVP records are tied to username, persisting across login/logout.

- **Timezone-Aware Validation**  
  Event creation validates against the **user’s timezone**.  
  Prevents scheduling events in the past or at invalid local times.

- **Persistence**  
  SQLite with EF Core migrations ensures data survives restarts.  
  No in-memory loss of events or RSVPs.

- **Frontend (React + Bootstrap)**  
  Clean UI with form validation, error banners, and grid-based event listing.  
  Graceful error messages for invalid input or API failures.

- **Backend (C# .NET)**  
  Minimal API endpoints with DTOs and validators.  
  EventValidator checks names, RSVP limits, and timezone-correct scheduling.

---

## Requirements

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQLite](https://www.sqlite.org/)

---

## Notable Design Choices

- SQLite - Chosen because of lightweight persistence and setup is easier
- Minimal API - Keep backend simple
- DTOs and Validation - Dedicated EventValidator to make sure of the correct event info and timezone
- React Bootstrap - Easy to setup 
- RSVP Persistence - usernames are stored with rsvp so they survived upon logout 


## Setup

### 1. Clone Repository
```bash
git clone https://github.com/aleomarckus/rsvp-app.git
cd rsvp-app
```


### 2. Backend (API)
```bash
cd Server
dotnet restore
rm -f rsvp.db                                          
rm -rf Migrations                        
dotnet ef migrations add Init --context RsvpDbContext
dotnet ef database update --context RsvpDbContext
dotnet run
```

### 3. Frontend (API)
```bash
cd Client
npm i && npm run dev
```


###Limitations
- ** No Authentication system (Password based)
- ** No Invitation sending through emails or any form of socials
- ** Limited User Experience