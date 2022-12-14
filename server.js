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

const func = () => {
  return "Hello World"
}

app.post("/submit", (request, response, next) => {
  const body = request.body;
  var x = func();
  next();
  response.send({
    canvas: {
      content: {
        components: [
          { type: "text", text: x,
           style: "header", align: "center" },
        ],
              },
          },
      })
});