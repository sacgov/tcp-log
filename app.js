const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const host = '0.0.0.0';
const {verifyToken} = require('./firebase');
const {genKey} = require('./encrypt');
const morgan = require('morgan');
const commands = require('./commands');

const server = require('./server');


app.use(express.json());
// app.use(helmet());

server.startServer();

app.use(morgan(':method :url :status :res[content-length] :date - :response-time ms'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/table', (req, res) => {
    res.sendFile(path.join(__dirname, 'table.html'));
});

app.get('/messages', (req, res) => {
    let messages = server.getLatestMessages();
    // messages = sampleMessages;
    res.send({messages});
});

app.post('/send-cmd', (req, res) => {
    const cmd = req.body.cmd;
    if (!cmd) {
        res.send({error: 'cmd is not entered'});
    }
    const imei = req.body.imei;
    if (!cmd) {
        res.send({error: 'cmd is not entered'});
    }
    if (!imei) {
        res.send({error: 'imei is not entered'});
    }
    server.sendCommand(imei, cmd);
    res.send({success: true, cmd});
});

app.use((err, req, res, next) => {
    console.log(err);
    res.send({error: 'yes'});
});

app.get('/db-all-get', function (req, res) {
    const filename = `db.sqlite`;
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(`${__dirname}/database.sqlite`);
});

// for the mobile app

app.get('/user/auth-token', (req, res) => {
    if (!req.get('ftoken')) {
        return res.send({success: false, error: 'ftoken is required'});
    }
    verifyToken.then((result) => {
        if (!result.success) {
            return res.status(401).send({success: false, error: 'invalid token'});
        }
        return res.send({
            success: true, data: {
                token: genKey(result.userId, moment().add(1, 'years').unix()),
            },
        });
    });
});

app.post('/devices/:trackerId/send-cmd', (req, res) => {
    const imei = req.params.trackerId;
    if (!imei) {
        return res.send({success: false, error: 'TrackerId is missing'});
    }

    if (!req.body.cmdType) {
        return res.send({success: false, error: 'cmdType is missing'});
    }
    if(req.body.cmdType !== "UNLOCK") {
        return res.send({success: false, error: 'only cmdType UNLOCK is allowed'});
    }

    const idToken = req.get('idToken');

    if (!idToken) {
        return res
            .status(401)
            .send({success: false, error: 'idToken is invalid'});
    }

    verifyToken(idToken)
        .then(() => {

            const cmd = commands.constructCommand(imei,req.body.cmdType );
            console.log(`SENDING CMD after construction ${imei} ${cmd}`);

            server.sendCommand(imei, cmd);
            return res
                .send({success: true, cmd});
        })
        .catch((e) => {
            return res
                .status(401)
                .send({success: false, error: 'idToken is invalid'});
        });
});

app.get('/devices/:trackerId/current-stats', (req, res) => {
    const trackerId = req.params.trackerId;
    if (!trackerId) {
        return res.send({success: false, error: 'TrackerId is missing'});
    }

    const idToken = req.get('idToken');

    if (!idToken) {
        return res
            .status(401)
            .send({success: false, error: 'idToken is invalid'});
    }

    verifyToken(idToken)
        .then((data) => {
            return res.send({
                success: true, data: server.getLatestMessageResponse(trackerId),
            });
        }).catch((err) => {
        console.log("error", err);
        return res
            .status(401)
            .send({success: false, error: 'idToken is invalid'});
    });
});

// listening to port and error handling

app.listen(port, host, () => {
    console.log(`App listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
    console.log('whoops! there was an unhandled exception', err);
});
process.on('unhandledRejection', function (err) {
    console.log('whoops! there was an unhandled rejection', err);
});
