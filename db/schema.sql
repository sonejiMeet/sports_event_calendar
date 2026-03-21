PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Venue (
  venue_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  country TEXT,
  capacity INTEGER
);

CREATE TABLE IF NOT EXISTS Event (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_datetime TEXT NOT NULL,
  end_datetime TEXT,
  title TEXT,
  description TEXT,
  _sport_id INTEGER NOT NULL,
  _venue_id INTEGER NOT NULL,
  FOREIGN KEY (_sport_id) REFERENCES Sport(sport_id),
  FOREIGN KEY (_venue_id) REFERENCES Venue(venue_id)
);

CREATE TABLE IF NOT EXISTS Event_Team (
  event_team_id INTEGER PRIMARY KEY AUTOINCREMENT,
  _event_id INTEGER NOT NULL,
  _team_id INTEGER NOT NULL,
  FOREIGN KEY (_event_id) REFERENCES Event(event_id),
  FOREIGN KEY (_team_id) REFERENCES Team(team_id),
  UNIQUE(_event_id, _team_id)
);

CREATE TABLE IF NOT EXISTS Team (
  team_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  founded_year INTEGER,
  _sport_id INTEGER NOT NULL,
  FOREIGN KEY (_sport_id) REFERENCES Sport(sport_id),
  UNIQUE(name, _sport_id)
);

CREATE TABLE IF NOT EXISTS Sport (
  sport_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);


