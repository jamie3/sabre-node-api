# Sabre Node API

A collection of Sabre SOAP APIs exposed via a simpler RESTful API within a node app. I f***in hate soap, so this alleviates some of the pain. This is actively under development so please do not use it in production.

## Features

- Converts SOAP XML to JSON format for easier consumption
- TODO: Provide GraphQL API to query across several SOAP APIs
- TODO: Provide human consumable API for interfacing with Sabre Command
- TODO: Provide debug mode flag in http header (this will attach original SOAP response as XML or JSON in a debug field in the response)

## Pre-Requisites

`yarn add --global cross-env`

## Start

`yarn start`

## API

Below are the list of APIs that are exposed over Restful interface.

- [Create Stateless Token](docs/stateless)
- TODO Retrieve Itinerary: `GET /itinerary/:pnr`
- VCR Display: `GET /vcr-display/:ticket-number`

### Create Stateless Token

[Sabre Documentation](https://developer.sabre.com/docs/soap_apis/session_management/create_access_token)

```json
POST /token HTTP/1.1
Content-Type: application/json

{
	"partyId": "jamie@mydomain.com",
	"username": "sabreUsername",
	"password": "sabrePassword",
	"stateless": true
}
```

Response
```json
{
    "conversationId": "53f5f29e-1dd6-4055-b99e-0506b5d31f5c",
    "messageId": "1394584560874440152",
    "timestamp": "2020-01-17T15:34:47",
    "token": "T1RLAQJNB0g4IAK74fGaYLXljp2wXtrprBA5JNiDmeXBJANa1dyY18nbAACwLYFWN4nzwB+LXE52TwBSju0rn1xJ7F5K4E6czcr2u20zvEIa1eFRXq6nU1ZkX8h1zgHqggbHhiZVnvnrWHYDsTQp48X0YTD408nMWgOw8v84E1vfQYZkJyOLNH8q8otX0kYDTHL1UuZWSVlSt7AnEm8PirGTrZqABLf1aZJOM6ZEdWbEJKYr5b5neiHzpqOb9iLEzdfS2iSeRVc3ahU5MntayRtQkOlJVTtHaC6bjEI*"
}
```

## VCR Display

TODO

## Retrieve Itinerary

https://developer.sabre.com/docs/soap_apis/management/itinerary/Retrieve_Itinerary

TODO