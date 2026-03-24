import express from 'express';
import { DB } from './connect.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static('public'));


function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        DB.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        DB.all(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
    });
}

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        DB.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

app.get('/api/events', async (req, res) => {

    try{
    // query to get each event with joined corresponding sport, venue and teams from their id
        const sql = `
            SELECT
                e.event_id,
                e.start_datetime,
                e.end_datetime,
                e.title,
                e.description,
                s.name AS sport,
                v.name AS venue,
                v.city AS venue_city,
                v.country AS venue_country,
                GROUP_CONCAT(t.name, ' vs ') AS teams
            FROM 
                Event e
            JOIN 
                Sport s ON e._sport_id = s.sport_id
            JOIN 
                Venue v ON e._venue_id = v.venue_id
            JOIN 
                Event_Team et ON e.event_id = et._event_id
            JOIN 
                Team t ON et._team_id = t.team_id    
            GROUP BY 
                e.event_id
            ORDER BY 
                e.start_datetime DESC
        `;
            
        const rows = await dbAll(sql);

        res.status(200).json({events: rows});

    }catch(err){
        console.error(err.message);
        res.status(500).json({error: err.message});
    }
});

app.get('/api/events/:id', async (req, res) => {
    
    try{
        const eventId = Number(req.params.id);
        
        // get one event by its id
        // this will be used to expand an event on the index page to query a more detailed info about that event  
        const sql = `
            SELECT
                e.event_id,
                e.start_datetime,
                e.end_datetime,
                e.title,
                e.description,
                s.name AS sport,
                s.description as sport_description,
                v.name AS venue,
                v.address,
                v.city AS venue_city,
                v.country AS venue_country,
                v.capacity,
                GROUP_CONCAT(t.name, ' vs ') AS teams,
                GROUP_CONCAT(t.name || 
                               ' (' || 
                                COALESCE(t.city, '') || 
                               ', ' || 
                                COALESCE(t.country, '') || 
                               ')', 
                               ' vs '
                            ) AS team_details
            FROM 
                Event e
            JOIN 
                Sport s ON e._sport_id = s.sport_id
            JOIN 
                Venue v ON e._venue_id = v.venue_id
            JOIN 
                Event_Team et ON e.event_id = et._event_id
            JOIN 
                Team t ON et._team_id = t.team_id    
            WHERE 
                e.event_id = ?
            GROUP BY 
                e.event_id
        `;

        const row = await dbGet(sql, [eventId]);

        if(!row) return res.status(404).json({error: 'Event was not found'});

        res.status(200).json({event: row});

    }catch(err){
        console.error(err.message);
        res.status(500).json({error: err.message});
    }
        
});




// app.post('/api/events', async (req, res) =>{
    
//     try{

//         res.json({message: 'Event created successfully'});

//     }catch(err){
//         console.error(err.message);
//         res.status(500).json({error: err.message});
//     }

// });



async function insert_data_if_empty() {

    // just check one of table has any data
    const row = await dbGet(`select count(*) as count from Sport;`);
    if (row.count > 0) {
        console.log('Database already contains data');
        return;
    }
    console.log('Seeding database with sample data...');

    // Sports
    await dbRun(`
    INSERT INTO Sport (name, description)
    VALUES
        ('Football', 'Football matches and events'),
        ('Ice Hockey', 'Ice hockey matches and events'),
        ('Basketball', 'Basketball matches and events');
    `);

    // Teams
    await dbRun(`
    INSERT INTO Team (name, city, country, founded_year, _sport_id)
    VALUES
        ('Salzburg', 'Salzburg', 'Austria', 1933, 1),
        ('Sturm', 'Graz', 'Austria', 1909, 1),
        ('KAC', 'Klagenfurt', 'Austria', 1909, 2),
        ('Capitals', 'Vienna', 'Austria', 2001, 2),
        ('Bulls', 'Chicago', 'USA', 1966, 3),
        ('Lakers', 'Los Angeles', 'USA', 1947, 3);
    `);

    // Venues
    await dbRun(`
    INSERT INTO Venue (name, address, city, country, capacity)
    VALUES
        ('Red Bull Arena', 'Stadionstrasse 2', 'Salzburg', 'Austria', 30000),
        ('Stadthalle', 'Example Street 10', 'Vienna', 'Austria', 16000),
        ('United Center', '1901 W Madison St', 'Chicago', 'USA', 20917);
    `);

    // Events
    await dbRun(`
    INSERT INTO Event (start_datetime, end_datetime, title, description, _sport_id, _venue_id)
    VALUES
        ('2019-07-18 18:30:00','2019-07-18 20:30:00','Salzburg vs Sturm','A football league match between Salzburg and Sturm.',1,1),
        ('2019-10-23 09:45:00','2019-10-23 12:00:00','KAC vs Capitals','An ice hockey match between KAC and Capitals.',2,2),
        ('2026-04-12 19:00:00','2026-04-12 21:30:00','Bulls vs Lakers','A basketball game between Bulls and Lakers.',3,3);
    `);

    // Event_Team
    await dbRun(`
    INSERT INTO Event_Team (_event_id, _team_id)
    VALUES
        (1, 1),
        (1, 2),
        (2, 3),
        (2, 4),
        (3, 5),
        (3, 6);
    `);

    console.log('Sample data inserted successfully.');
}

async function start_server(){
    try{
        await insert_data_if_empty();

        app.listen(PORT, (err) => {
            if (err) {
                console.error('ERROR:', err.message);
                process.exit(0);
            }
            console.log(`Server is running at http://localhost:${PORT}`);
        });

    } catch(err){
        console.error('Error at startup:', err.message);
        process.exit(0);
    }

}

start_server();
