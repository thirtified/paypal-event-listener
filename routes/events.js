var express = require('express');
var paypal = require('paypal-rest-sdk');

var router = express.Router();

router.post('/listen', function(req, res, next) {
  console.log("event received", req.body);
  
  try {
    // Get the Webhook event id from the incoming event request
    var webhookEventId = JSON.parse(req.body).id;

    paypal.notification.webhookEvent.get(webhookEventId, function (error, webhookEvent) {
      if (error) {
        console.log("Error (1)", error);
        // The webhook event data could not be found.
        // Send a HTTP 503 response status code ( http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.4 )
        // to signal to PayPal to resend the request at a later time.
        res.sendStatus(503);
      } else {
        // Proceed to use the data from PayPal
        console.log("Get webhookEvent Response");
        console.log(JSON.stringify(webhookEvent));
        res.sendStatus(200);
      }
    });
  } catch (e) {
    console.log("Error (2)", e);
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
