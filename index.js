import express from 'express';
import bodyParser from 'body-parser';
import { DB } from './connect.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Sports event calendar service is online');
});


function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        DB.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
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

async function insert_data_if_empty() {

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
