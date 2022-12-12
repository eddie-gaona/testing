const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static('public'));
app.use(logger)

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

function logger(req, res, next) {
  console.log("Please work within Intercom")
  next()
}

app.post("/initialize", (request, response) => {
  const body = request.body;
  response.send({
    canvas: {
      content: {
        components: [
                      {
                        "type": "text",
                        "text": "*Create a ticket*",
                        "style": "header"
                      },
                      {
                        "type": "input",
                        "id": "title",
                        "label": "Title",
                        "placeholder": "Enter a title for your issue..."
                      },
                      {
                        "type": "input",
                        "id": "Email",
                        "label": "Customer Email",
                        "placeholder": "Enter an email for your issue..."
                      },
                      {
                        "type": "textarea",
                        "id": "description",
                        "label": "Description",
                        "placeholder": "Enter a description of the issue..."
                      },
                      {
                        "type": "dropdown",
                        "id": "label",
                        "label": "Request Type",
                        "options": [
                          {
                            "type": "option",
                            "id": "bug",
                            "text": "Bug"
                          },
                          {
                            "type": "option",
                            "id": "bug-critical",
                            "text": "Bug Critical Issue"
                          },
                          {
                            "type": "option",
                            "id": "feedback",
                            "text": "Feedback"
                          },
                          {
                            "type": "option",
                            "id": "troubleshooting",
                            "text": "Troubleshooting"
                          },
                          {
                            "type": "option",
                            "id": "conceptual",
                            "text": "Conceptual"
                          }
                        ]
                      },
                      {
                        "type": "single-select",
                        "id": "priority",
                        "label": "Priority",
                        "options": [
                          {
                            "type": "option",
                            "id": "low",
                            "text": "Low"
                          },
                          {
                            "type": "option",
                            "id": "medium",
                            "text": "Medium"
                          },
                          {
                            "type": "option",
                            "id": "high",
                            "text": "High"
                          }
                        ]
                      },
                      {
                        "type": "spacer",
                        "size": "s"
                      },
                      {
                        "type": "button",
                        "id": "submit-issue-form",
                        "label": "Create issue",
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
    const button = document.getElementById('submit-issue-form');
    button.addEventListener('click', function () {
  })
});