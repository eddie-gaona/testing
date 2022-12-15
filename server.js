const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

var zendeskID = '';
var zenID = [];
//Intercom Get Conversation details
const getConvo = (getID) => {

//console.log(getID); //Logs the ID of the conversation to the console

var options = {
  hostname: 'api.intercom.io',
  path: '/conversations/' + getID,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': "Bearer dG9rOmNiOTNiODIzX2YzMjFfNDIyOF85MTFmX2IyMjg0NTg4YWYxZToxOjA="
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
      //console.log(data);
      createTicket(data, getID);
    });
  });
  // Log errors if any occur
  request.on('error', (error) => {
      console.error(error);
  });
  // End the request
  request.end();
};




//Intercom Get conversation details ends
const createTicket = (dataIntercom, getID) => {
  var dataInt = dataIntercom;
  var parsedJSON = JSON.parse(dataInt);

  var dataInt2 = JSON.parse(JSON.stringify(parsedJSON.conversation_parts.conversation_parts));
  let text = [parsedJSON.source.body];
  for(var i = 0; i<dataInt2.length; ++i) {
    text.push(dataInt2[i]["body"])
  }
  let msg = text.join(' ');


var inputBody = {
  "ticket": {
    "requester": "eddie.gaona@amplitude.com",//parsedJSON.source.author.email,
    "comment": {
      "html_body": msg
    }
  }
};
var options = {
  hostname: 'amplitude.zendesk.com',
  path: '/api/v2/tickets',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': "Basic ZWRkaWUuZ2FvbmFAYW1wbGl0dWRlLmNvbS90b2tlbjo3QVdmdDBqZHRFZ1ByU1hIajVpTFNwS252NmwyYzVibXgycTVyY1FQ"
  }
};

//console.log(inputBody)
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
      //console.log(data);
      internalComment(data, getID)
    });
  });

  // Log errors if any occur
  request.on('error', (error) => {
      console.error(error);
  });
  request.write(JSON.stringify(inputBody));
  // End the request
  request.end();
}

const internalComment = (dataZen, getID) => {
  var dataInt = dataZen;
  var parsedJSON = JSON.parse(dataInt);
  var zenID = parsedJSON["ticket"]["id"];
  
  var options = {
  hostname: 'api.intercom.io',
  path: '/conversations/' + getID + '/reply',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': "Bearer dG9rOmNiOTNiODIzX2YzMjFfNDIyOF85MTFmX2IyMjg0NTg4YWYxZToxOjA="
  }
};
  
  var inputBody = {
  "message_type": "note",
  "type": "admin",
  "admin_id": "5112554",
  "body": "https://amplitude.zendesk.com/agent/tickets/" + zenID
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
    });
  });
  // Log errors if any occur
  request.on('error', (error) => {
      console.error(error);
  });
  // End the request
  request.write(JSON.stringify(inputBody));
  request.end();
  
}

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/', function (request, response,html) {
  console.log(response.sendFile(__dirname+'/views/index.html'));
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

app.post("/submit", (request, response, x) => {
  const body = response.body;
  var getID = request.body;
  var id = getID['conversation']['id'];
  getConvo(id);
  response.send({
    canvas: {
      content: {
        components: [
          { type: "text", text: "Ticket Submitted",
           style: "header", align: "center" }
        ],
              },
          },
      })
});