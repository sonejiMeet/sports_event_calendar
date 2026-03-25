# sports_event_calendar

## how to run
```
npm install
npm run init
npm run start
```
I have chosen the backend focused exercise due to my interest. 
It demonstrates the following:
- REST Api design with Node.js and Express
- Database integration with SQLite3 (simple and most familiar with it)
- Follows the 3nf (third normal form)
- A server side validation and creation
- Integration between backend endpoints with simple frontend interface

A simple web app to list sports events and create new ones from a HTML form.

## Overview
Backend exposes these endpoints (ended up not adding authentication functionality for endpoint that manipulate database so its left exposed):
```
GET /api/events
```
- Return all events with joined sport, venue and concatenated team names
```
GET /api/events/:id
```
- Return event by id, to get a detailed query for an event.
```
GET /api/sports
GET /api/venues
```
- Return all sports and venues
```
GET /api/teams
```
- when creating new event, fetch only the teams that play the sport that is selected
```
POST /api/events
```
Create a new event, prevent duplicate team select,
look for existing sport/team and reuse, 

## Assumptions
- Each event has two teams
- Frontend can only request teams for chosen sport when creating new event
- If user enters new sport but name already exists, the existing sport will be reused instead of duplicating it, similar for existing teams
- venues are always inserted as new, otherwise user is expected to choose existing venue from dropdown
- As mentioned, there is no authentication implemented, so the POST api/events endpoint is publicly accessible, (which is one limitation.)

