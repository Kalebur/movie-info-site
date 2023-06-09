# Chunky Chicken Entertainment

![Mobile and Desktop views of the Chunky Chicken Entertainment App](https://cdn.discordapp.com/attachments/469532919363272704/1088987278220730448/header-img.jpg)

## Overview

This project was created to make use of [The Movie Database API](https://www.themoviedb.org/) to pull and display information about movies and TV shows. The home page shows a list of upcoming movies, movies that are currently in theaters and lists of the movies and TV shows that are trending for the day. When clicking or tapping on something in the list, a new screen appears to present a synopsis of the selected item, display the genres it's listed under, displays which streaming platforms the media is currently available on (if any) and provides a list of other movies/shows similar to the one being viewed. If you're looking for something specific, there's a search feature that will autocomplete with a list of results as you type.

The app utilizes a back-end Express API that performs all external API calls and serves that information up to the front end. It implements [EJS](https://ejs.co/) views and partials to reduce duplicating code for items that are present on all pages.

[View the Site Live](https://chunky-chicken-entertainment.onrender.com/)
_Site may take a couple of mins to load. The hosting service goes idle if it hasn't been accessed recently._

## Features

- Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app.
- Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.
- Retrieve data from a third-party API and use it to display something within your app.
- Create a node.js web server using a modern framework such as Express.js or Fastify. Serve at least one route that your app uses
- Create a function that accepts two or more input parameters and returns a value that is calculated or determined by the inputs. (createPosterItem in createItems.js does this)
- Implement modern interactive UI features (autocomplete functionality on search bar)

## Requirements and Installation

This app requires an API key from [The Movie Database](https://www.themoviedb.org) and has been developed and configured using version 3 of their API.

Additionally, the back end makes use of `fetch()` which requires `Node 18.0 or higher` to work by default.

### Installation Instructions

1. Clone this repo to your system
2. Create a `.env` file in the project's root directory
3. Include your TMDb API key in the .env file as `MOVIE=<< YOUR API KEY >>`
4. **[OPTIONAL]** Provide a `PORT` for the server to listen to in the .env file
5. Run `npm install` to install all the project dependencies
6. Run `npm start` to spin up the server. **[NOTE]** You can provide a port number during this step by typing `npm start --port=<PORT>`
7. Navigate to `localhost:<PORT>` in your browser. If no port is provided with `npm start --port=<PORT>` and no `PORT` environment variable is defined, the server will default to port `3000`
