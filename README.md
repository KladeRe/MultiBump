# Multibump
A real time multiplayer game based in the browser using the websocket protocol

## Architecture

The architecture is based on a client-server architecture, with one server connecting multiple clients using websocket connections between the server and clients

## Technologies

The frontend is written with React JS and PixiJS. The backend is written using Node JS. Both the frontend and backend use reverse proxies which are configuerd using nginx.

To achieve respectable levels of performance, the communication from the frontend to the backend is handled by a web worker. The worker connects to the backend server via Websocket and handles bidirectional communication between the frontend and the backend.

## Running the app

The app can be run using docker compose with the command:
```
docker compose up
```


