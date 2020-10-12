# AKL-Match-Config
This service acts as a middle man between our infrastructure and
CS:GO server bot Get5 (https://github.com/splewis/get5). 

Service keeps track of matches and generates match configs for Get5. One hour
before match should start according to its timeslot, get-config endpoint
will start giving the correct config for the server. Each server pulls 
the match config every one minute from this service and if it notices a
change in the config, it will update it to the server and execute it for
the bot.

If there is no match, the get-config will return practice configuration.

Note: the service (in our case puppet) which does the final execution
for the match in the server must somehow figure out if there is a match
running! With get5 it is pretty easy, because it has endpoint which can
tell if there is a match underway!

