const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('https');
const inputBody = {
  "ticket": {
    "comment": {
      "value": "<Error: Too many levels of nesting to fake this schema>"
    }
  }
}
const options = {
  hostname: 'amplitude.zendesk.com',
  path: '/api/v2/tickets',
  method: 'POST',
  headers: {
    'Content-Type': '*/*',
    'Accept': '*/*',
    'Authorization': "Basic ZWRkaWUuZ2FvbmFAYW1wbGl0dWRlLmNvbS90b2tlbjo3QVdmdDBqZHRFZ1ByU1hIajVpTFNwS252NmwyYzVibXgycTVyY1FQ"
  },
  body: inputBody
};

//Zendesk API Create a Ticket
const createTicket = () => {
  let data = '';

  const request = http.request(options, (response) => {
    // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
    response.setEncoding('utf8');

    // As data starts streaming in, add each chunk to "data"
    response.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    response.on('end', () => {
      console.log(data);
    });
  });

  // Log errors if any occur
  request.on('error', (error) => {
      console.error(error);
  });

  // End the request
  request.end();
};

app.use(bodyParser.urlencoded({ extended: false }));
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
  console.log(body)
  //console.log(body["conversation"]["id"])
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

app.post("/submit", (request, response) => {
  createTicket();
  const body = request.body;
  response.send({
    canvas: {
      content: {
        components: [
          { type: "text", text: "Ticket Submitted",
           style: "header", align: "center" },
        ],
              },
          },
      })
});