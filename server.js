const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

/*
  This is an endpoint that Intercom will POST HTTP request when the card needs to be initialized.
  This can happen when your teammate inserts the app into the inbox, or a new conversation is viewed.
*/

app.post("/initialize", (request, response) => {
  const body = request.body
  response.send({
    canvas: {
      content: {
        components: [
                      {
                        "type": "text",
                        "text": "*Create a Zendesk Ticket*",
                        "style": "header"
                      },
                      {
                        "type": "button",
                        "id": "submit-issue-form",
                        "label": "Create a Zendesk Ticket",
                        "style": "primary",
                        "action": {
                          "type": "submit"
                        }
                      }
                  ],
      },
    },
  });
});

const getConvo = (getID) => {

//console.log(getID); //Logs the ID of the conversation to the console
var options = {
  hostname: 'api.intercom.io',
  path: '/conversations/' + getID,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': "Bearer dG9rOjViMWQ3YjM3X2U1NjFfNGFjZF9hOGIyX2U0MDI2ZTQ1YThkMDoxOjA="
  }
};
  let data = '';

  const request = https.request(options, (response) => {
    // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
    response.setEncoding('utf8');

    // As data starts streaming in, add each chunk to "data"
    response.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    response.on('end', () => {
      console.log(data);
      return data
    });
  });
  // Log errors if any occur
  request.on('error', (error) => {
      console.error(error);
  });
  // End the request
  request.end();
};

const myFunct = (getID) => {
  var options = {
  hostname: 'api.intercom.io',
  path: '/conversations/' + getID,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': "Bearer dG9rOjViMWQ3YjM3X2U1NjFfNGFjZF9hOGIyX2U0MDI2ZTQ1YThkMDoxOjA="
  }
};
  let data = '';

  const request = https.request(options, (response) => {
    // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
    response.setEncoding('utf8');

    // As data starts streaming in, add each chunk to "data"
    response.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    response.on('end', () => {
      console.log(data);
      return data
    });
  });
  // Log errors if any occur
  request.on('error', (error) => {
      console.error(error);
  });
  // End the request
  request.end();
}

app.post("/submit", (request, response, next) => {
  const body = request.body;
  var x = getConvo(body['conversation']['id']);
  var y = myFunct(body['conversation']['id'])
  console.log(y)
  response.send({
    canvas: {
      content: {
        components: [
          { type: "text", text: "HI WORLD",
           style: "header", align: "center" },
        ],
              },
          },
      })
});