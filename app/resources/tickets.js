/**
 * Module dependencies.
 */

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/tickets'); // connect to our database

var Ticket     = require('../models/ticket');

var restpress = require('restpress');

// Create a RESTful resource
var resource = new restpress('tickets', require('./tickets-actions.json'));

resource.all(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// get all the tickets
resource.list(function(req, res) {
    Ticket.find(function(err, tickets) {
	if (err)
	    return res.send(err);
	
	return res.json(tickets);
    });
});

// get the ticket with that id
resource.read(function(req, res) {
    Ticket.findById(req.params.id, function(err, ticket) {
	if (err)
	    return  res.send(err);
	
	return res.json(ticket);
    });
});

// create a ticket
resource.create(function(req, res) { 		// create a new instance of the Ticket model
    var ticket = new Ticket(req.body);  // set the tickets body (comes from the request)

    var request = require('request');

    var options = {
	uri: 'http://104.154.39.184:8080/ticketManagement/ticket',
	json: true,
	body: req.body
    };

    function callback(error, response, body) {
	if (!error && response.statusCode == 200) {
	    console.log("Successful RuleX validation " + response.statusCode);
	    console.log(body);

	    // save the ticket and check for errors
            ticket.status = 'created';
	    ticket.save(function(err) {
		if (err)
		    return res.send(err);

		return res.json(ticket);
	    });
	}
	else {
	    console.log("RuleX validation failed with " + response.statusCode);
	    return res.json(body);
	}
	}
    
    // send request to Nomos RuleX for validation
    request.post(options, callback);

});

//Fully update the ticket with this id
resource.fullUpdate(function(req, res) {
    // use our ticket model to find the ticket we want
    Ticket.findById(req.params.id, function(err, ticket) {
	
	if (err)
	    return res.send(err);
	else {

	    ticket = req.body; 	// update the ticket info
	
	    // save the ticket
	    Ticket.update({_id: req.params.id}, ticket, {overwrite: true}, function(err) {
		if (err)
		    return res.send(err);
	    
		return res.json(ticket);
	    });
	}
    });
});

//Partially update the ticket with this id
resource.partialUpdate(function(req, res) {
    // use our ticket model to find the ticket we want
    Ticket.findById(req.params.id, function(err, ticket) {

	if (err)
	    return res.send(err);

	ticket = req.body; 	// update the ticket info

	// save the ticket
	Ticket.update({_id: req.params.id}, ticket, {overwrite: false}, function(err) {
	    if (err)
		return res.send(err);

	    return res.json(ticket);
	});
    });
});

// delete the ticket with this id
resource.delete(function(req, res) {
    Ticket.remove({_id: req.params.id}, function(err, ticket) {
	if (err)
	    return res.send(err);

	return res.json({ message: 'Successfully deleted' });
    });
});

module.exports = resource;
