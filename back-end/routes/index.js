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
var multer = require('multer');
var fs = require('fs');
var upload = multer({dest: 'uploads/'});
var type = upload.single('uploadedFile');

var mongoUrl = process.env.MONGODB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost:27017/electric';
var db;

// create a connection with mongo
mongoClient.connect(mongoUrl, function(error, database){
	db = database;
});


router.get('/', function(req, res, next){
	var photosToShow;
	var currIP = req.ip;
	// get all cars and put them in an array
	db.collection('cars').find({}).toArray(function(error, results){
		photosToShow = results;
	});

	db.collection('users').find({ip: currIP}).toArray(function(error, userResults){
		var carsVoted = [];
		if (userResults.length > 0){
			for (var i=0; i<userResults.length; i++){
				// push the names of all cars voted on by the curent user
				carsVoted.push(userResults[i].car);
			}

			db.collection('cars').find({name: {$nin: carsVoted}}).toArray(function(err, results){
				if (results.length > 0) {
					photosToShow = results;
					// send the cars not voted on to the front-end
					res.json(photosToShow);
				} else {
					res.redirect('/standings');
				}
			});
		} else {
			// if the current user has not voted, send all the cars to the front-end
			res.json(photosToShow);
		}
	});
});


router.post('/uploads', type, function(req, res, next){
	var targetPath = 'public/images/' + req.file.originalname;
	fs.readFile(req.file.path, function(error, data){
		fs.writeFile(targetPath, data, function(error){
			if(error){
				res.json('Error: ' + error);
			} else {
				res.json('Success!');
			}
		});
	});

	db.collection('users').insert(
		{
			name: req.body.name,
			src: req.file.originalname
		}, function(error, results){
			if (error) throw error;
	});
});


router.get('/standings', function(req, res, next){
	// get all the photos
	db.collection('cars').find().toArray(function(error, results){
		var sortedResults = results;
		// sort photos by total votes
		sortedResults.sort(function(a, b){
			return a.totalVotes - b.totalVotes;
		});
		res.json(sortedResults.reverse());
	}); // end query to 'cars' collection
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
		console.log('Error: invalid route');
		res.redirect('/');
	}
});


router.get('/reset', function(req, res, next){
	db.collection('cars').update({}, {$unset: {"totalVotes": ""}}, {multi: true});
	db.collection('users').drop();
	res.redirect('/');
});


module.exports = router;
