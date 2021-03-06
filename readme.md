# Vacation Tracker

To get the app working you need
- a dropbox account
- a google maps api key

### Setting up your app
1. At first, create a new app in your Dropbox Account ([Here](https://www.dropbox.com/developers/apps/create))
1. Generate an Dropbox API access token
1. Generate an Google Maps for JS API access token

Now you need to set up your `config.json`:

```json
{
  "dropbox": {
    "accessToken": "your previously generated dropbox api token"
  },
  "port": 61000,
  "maps": {
    "lat": 1,
    "lng": 1,
    "zoom": 7,
    "apiKey": "your previously generated google maps api token",
    "overlay": null
  },
  "meta": {
    "title": "Travel Title",
    "date_range": "Travel start and end dates"
  }
}
```

After that you need to specify your travel schedule in `schedule.json` like this:


```json
[
  {
  "date": "2017-01-31",
  "title": "Vik",
  "location": {
    "lat": 63.4190418,
    "lng": -19.2778947
    }
  },
  {
  "date": "2017-02-02",
  "title": "Ulfljotsvatn",
  "location": {
    "lat": 64.1115562,
    "lng": -21.5932734
    }
  }
]
```
### Install & Run App
To install the app

```bash
npm install
```

To finally run the app type:
```bash
npm start
```

Visit `http://localhost:61000`

### Updating Pictures

The app will display all pictures in your defined dropbox folder. Just upload them and they will show up the next time you visit the page. 
