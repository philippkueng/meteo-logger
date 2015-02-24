# Meteo Logger

This project is a tool to quickly log swiss weather data into a google spreadsheet every 10 minutes, every hour or once a day.

## Requirements

* 2-Factor Authentication must be enabled on your Google Account
* You must have a heroku account or be allowed to create one.

## Deployment

1. Make sure 2 factor authentication is turned on for your account
2. Create an app specific password for the logger https://security.google.com/settings/security/apppasswords
3. Log into your account and create a spreadsheet.
4. [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/philippkueng/meteo-logger) the application to heroku and fill in your Google address as `USERNAME` and the app specific password as `PASSWORD`. Then if your spreadsheet is not called `node-edit-spreadsheet`, then you have to define the name in `FILENAME`.
5. Head to https://dashboard.heroku.com/apps/<your-app-name>/resources and click on the Heroku Scheduler.
6. Add a job `node index.js fetch $STATION` with dyno size `1X` and your preferred frequency.
