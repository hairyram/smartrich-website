import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from './server/routes';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();

const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('dist/public'));

const httpServer = createServer(app);

registerRoutes(httpServer, app).then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
