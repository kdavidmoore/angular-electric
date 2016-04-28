var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
// var mongoUrl = 'mongodb://localhost:27017/electric';
// add custom module later
// var configModule = require('../config/keys');
// var Car = require('../models/cars');
// var User = require('../models/users');
// var mongoose = require('mongoose');
// mongoose.connect(mongoUrl);

var mongoUrl = process.env.MONGODB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost:27017/electric';
var db;

// create a connection with mongo
mongoClient.connect(mongoUrl, function(error, database){
	db = database;
});

router.get('/', function(req, res, next){
	var allCars;
	// get all cars and put them in an array
	db.collection('cars').find().toArray(function(error, results){
		// send the cars back in JSON form
		res.json(results);
	});
});

router.post('/vote/:voteType', function(req, res, next){
	if (req.params.voteType == 'electric'){
		db.collection('cars').updateOne(
			{
				name: req.body.name
			},
			{
				$inc: {"totalVotes": 1}
			}, function(error, results){
				if (error) throw error;
		});

		db.collection('users').insert(
			{
				ip: req.ip,
				car: req.body.name,
				vote: "electric"
			}, function(error, results){
				if (error) throw error;
		});

		// redirect to the home page when done updating collections
		res.redirect('/');
	} else if (req.params.voteType == 'not'){
		db.collection('cars').updateOne(
			{
				name: req.body.name
			},
			{
				$inc: {"totalVotes": -1}
			}, function(error, results){
				if (error) throw error;
		});

		db.collection('users').insert(
			{
				ip: req.ip,
				car: req.body.name,
				vote: "not"
			}, function(error, results){
				if (error) throw error;
		});

		// redirect to the home page when done updating collections
		res.redirect('/');
	} else{
		console.log('invalid route');
		res.redirect('/');
	}
});

module.exports = router;
