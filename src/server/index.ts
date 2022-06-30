import compression from 'compression';
import { config } from 'dotenv';
import express from 'express';
import { expressjwt } from 'express-jwt';
import helmet from 'helmet';
import sslRedirect from 'heroku-ssl-redirect';
import swaggerUi from 'swagger-ui-express';
import { getJwtSecret } from '../app/users/SignInController';
import { api } from './api';
// import { pubnub_server } from './pubnub';

config(); //loads the configuration from the .env file
 
async function startup() {
    // pubnub.
    const app = express();
    app.use(sslRedirect());
    app.use(expressjwt({ secret: getJwtSecret(), credentialsRequired: false, algorithms: ['HS256'] }));
    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: false,
        })
    );
 
    app.use(api);
    app.use('/api/docs', swaggerUi.serve,
        swaggerUi.setup(api.openApiDoc({ title: 'service-calls' })));
 
    app.use(express.static('dist/service-calls'));
    app.use('/*', async (req, res) => {
        try {
            res.sendFile(process.cwd() + '/dist/service-calls/index.html');
        } catch (err) {
            res.sendStatus(500);
        }
    });
    let port = process.env['PORT'] || 3002;
    app.listen(port);
}
startup(); 