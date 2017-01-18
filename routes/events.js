var express = require('express');
var paypal = require('paypal-rest-sdk');

var router = express.Router();

var SIMULATOR_WEBHOOK_EVENT_ID = "WH-17W49296X1356610S-0MD256853V991784A";

router.post('/listen*', function(req, res, next) {
  console.log("event received", req.body, req.ip);
  
  try {
    // Get the Webhook event id from the incoming event request
    var webhookEventId = req.body.id;
    console.log("Looking up Webhook event with ID %s...", webhookEventId);
    
    // shortcut for events sent by simulator
    if (webhookEventId === SIMULATOR_WEBHOOK_EVENT_ID) {
      console.log("Received Simulator Webhook event: ", webhookEventId);
      res.sendStatus(200);
      return;
    }
    
    paypal.notification.webhookEvent.get(webhookEventId, function (error, webhookEvent) {
      if (error) {
        console.log("Could not retrieve Webhook event %s", webhookEventId, error);
        // The webhook event data could not be found.
        // Send a HTTP 503 response status code ( http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.4 )
        // to signal to PayPal to resend the request at a later time.
        res.sendStatus(503);
      } else {
        // Proceed to use the data from PayPal
        console.log("Webhook event lookup successful: ", webhookEvent);
        res.sendStatus(200);
      }
    });
  } catch (e) {
    console.log("An error occurred:", e);
    // The webhook id could not be found or any other error occurred.
    // Send a HTTP 503 response status code ( http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.4 )
    // to signal to PayPal to resend the request at a later time
    res.sendStatus(503);
  }
});

router.get('/test', function(req, res, next) {
  res.send("hello");
});

module.exports = router;
