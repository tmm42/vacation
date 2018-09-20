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

    var schedule = require('./schedule.json');

    var schedule_title = "42";
    var schedule_location = {
        "lat": 42,
        "lng": 42
    };

    /*

    console.log(Moment() < Moment(schedule[0].date));
    console.log(Moment() > Moment(schedule[schedule.length - 1].date));
    console.log(Moment() < Moment(schedule[0].date) || Moment() > Moment(schedule[schedule.length - 1].date))

    */

    if(Moment() < Moment(schedule[0].date) || Moment() > Moment(schedule[schedule.length - 1].date) ) {
        schedule_title = null;
        schedule_location = {
            "lat": config.maps.lat,
            "lng": config.maps.lng
        }
    } else {
        for(var i = 0; i < schedule.length; i++) {
            if(Moment(schedule[i].date).date() + Moment(schedule[i].date).month()  === Moment().date() + Moment().month()) {
                schedule_title = schedule[i].title;
                schedule_location = schedule[i].location;
            }
        }
    }




    dbx.filesListFolder({path: ''})
        .then(function(response) {

            console.log(response);
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

                    // sort images - newest first

                    imgs.sort(function(a, b){
                        if(a.substr(52) < b.substr(52)) return 1;
                        if(a.substr(52) > b.substr(52)) return -1;
                        return 0;
                    });

                    var obj = {
                        imgs : imgs,
                        maps: {
                            lat: config.maps.lat,
                            lng: config.maps.lng,
                            zoom: config.maps.zoom,
                            apiKey: config.maps.apiKey,
                        },
                        location: schedule_location,
                        title: schedule_title,
                        meta: {
                            title: config.meta.title,
                            data_range: config.meta.date_range
                        }
                    };
                    res.render('index', obj);
                });


        })
        .catch(function(error) {
            console.log(error);
            res.send("<p>Error</p>");
        });

});


