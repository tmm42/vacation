const Express = require('express');
const Dropbox = require('dropbox');
const Moment = require('moment');
const Q = require('q');
const config = require('./config.json');

const App = Express();
const Server = App.listen(config.port);

console.log("Server initialized, listen to port " + config.port);

App.set('views', __dirname + "/views");
App.set('view engine', 'ejs');

// static paths
App.use(Express.static(__dirname + '/client'));
App.use('/client', Express.static(__dirname + '/client'));

Moment().locale();


App.get('/', function(req, res){


    var dbx = new Dropbox({ accessToken: config.dropbox.accessToken });
    var imgs = [];

    var schedule = [
        {
            "date": "2017-09-25",
            "title": "Reykiavik (Test)",
            "location": {
                "lat": 64.1334735,
                "lng": -21.922481
            }
        },
        {
            "date": "2017-09-30",
            "title": "Reykiavik",
            "location": {
                "lat": 64.1334735,
                "lng": -21.922481
            }
        },
        {
            "date": "2017-10-01",
            "title": "Reykiavik",
            "location": {
                "lat": 64.1334735,
                "lng": -21.922481
            }
        },
        {
            "date": "2017-10-01",
            "title": "Borgarnes",
            "location": {
                "lat": 64.5488398,
                "lng": -21.9305994
            }
        },
        {
            "date": "2017-10-02",
            "title": "Borgarnes",
            "location": {
                "lat": 64.5488398,
                "lng": -21.9305994
            }
        },
        {
            "date": "2017-10-03",
            "title": "Borgarnes",
            "location": {
                "lat": 64.5488398,
                "lng": -21.9305994
            }
        },
        {
            "date": "2017-10-04",
            "title": "Akureyri",
            "location": {
                "lat": 65.6692582,
                "lng": -18.2054352
            }
        },
        {
            "date": "2017-10-05",
            "title": "Laugar",
            "location": {
                "lat": 65.7206893,
                "lng": -17.3817015
            }
        },
        {
            "date": "2017-10-06",
            "title": "Laugar",
            "location": {
                "lat": 65.7206893,
                "lng": -17.3817015
            }
        },
        {
            "date": "2017-10-07",
            "title": "Egilsstadir",
            "location": {
                "lat": 65.2623546,
                "lng": -14.4148883
            }
        },
        {
            "date": "2017-10-08",
            "title": "Höfn",
            "location": {
                "lat": 64.253821,
                "lng": -15.484457
            }
        },
        {
            "date": "2017-10-08",
            "title": "Vik",
            "location": {
                "lat": 63.4190418,
                "lng": -19.2778947
            }
        },
        {
            "date": "2017-10-09",
            "title": "Ulfljotsvatn",
            "location": {
                "lat": 64.1115562,
                "lng": -21.5932734
            }
        }
    ];

    var schedule_title = "";
    var schedule_location = {};

    for(var i = 0; i < schedule.length; i++) {
        if(Moment(schedule[i].date).date() + Moment(schedule[i].date).month()  === Moment().date() + Moment().month()) {
            console.log("Match!");
            schedule_title = schedule[i].title;
            schedule_location = schedule[i].location;
        }
    }

    dbx.filesListFolder({path: ''})
        .then(function(response) {

            var promises = [];

            for(var e in response.entries) {

                promises.push(dbx.sharingCreateSharedLink({path: response.entries[e].path_display}).then(function(response){
                    imgs.push("https://dl.dropboxusercontent.com" + response.url.substr(23));
                }).catch(function(error){
                    console.log(error);
                }));
            }

            // waiting for loop
            Q.all(promises).then(function(){
                var obj = {
                    imgs : imgs,
                    maps: {
                        lat: config.maps.lat,
                        lng: config.maps.lng,
                        zoom: config.maps.zoom,
                        apiKey: config.maps.apiKey,
                    },
                    location: schedule_location,
                    title: schedule_title
                };
                res.render('index', obj);
            });

        })
        .catch(function(error) {
            console.log(error);
            res.send("<p>Error</p>");
        });

});


