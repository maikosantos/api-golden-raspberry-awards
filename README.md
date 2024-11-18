# api-golden-raspberry-awards

RESTful API to allow reading the list of nominees and winners of the Worst Film category of the Golden Raspberry Awards.

## Tech Stack

**Server:** Node, Express

## Run Locally

Clone the project

```bash
  git clone https://github.com/maikosantos/api-golden-raspberry-awards.git
```

Go to the project directory

```bash
  cd api-golden-raspberry-awards
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

## Running Tests

To run tests, run the following command

```bash
  npm test
```

## API Reference

#### Get the producer with the longest gap between two consecutive awards, and the one who got two awards the fastest

```http
  GET /movies/awards/intervals
```

## Authors

- [@maikosantos](https://github.com/maikosantos)
