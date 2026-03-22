import express from 'express';
import bodyParser from 'body-parser';
import { DB } from './connect.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Sports event calendar service is online');
});

async function start_server(){
    try{
        
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
