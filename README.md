# UNO - Digital Card Game

This project is a digital implementation of the popular card game "UNO". The application allows multiple players to join a game session and play against each other following the classic UNO rules.

## Features

-   **Multiplayer:** Support for multiple players in the same game.
-   **Game Logic:** Implementation of UNO rules, including special cards (Skip, Reverse, Draw Two, Wild, Wild Draw Four).
-   **RESTful API:** Endpoints to manage players, games, and game actions.
-   **Functional Programming:** The code is structured following functional programming principles.

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MySQL with Sequelize ORM
-   **Authentication:** JWT (JSON Web Tokens) for secure sessions.
-   **Testing:** Jest and Supertest for unit and integration tests.

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

-   Node.js (version 18 or higher)
-   npm
-   MySQL

### Installation

1.  Clone the repository:
    ```sh
    git clone <REPOSITORY_URL>
    ```
2.  Navigate to the project directory:
    ```sh
    cd project_capstone_progra4
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```
4.  Set up the environment variables. Create a `.env` file in the project root and add the following variables (adjust the values according to your local setup):
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=uno_db
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

A `start` script was not found in `package.json`. You can start the server with:

```sh
node app.js
```

The server will start on the port you have configured.

### Running Tests

To run the test suite and see the coverage, execute:

```sh
npm test
```

## Project Structure

```
/
├── controllers/      # Controllers (route logic)
├── db/               # Database configuration
├── middlewares/      # Express middlewares
├── models/           # Sequelize data models
├── routes/           # API route definitions
├── services/         # Business logic and services
├── test/             # Tests (unit and integration)
├── utils/            # Utility functions
├── app.js            # Application entry point
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Exam solution
In this Readme, you can find information about the project as well as the midterm presentation. The link to the demo video shows:
- The player CRUD works.
- The game CRUD works.
- The live execution of the tests is shown.
- The coverage percentage for each file is shown.

[LINK DEMO](https://drive.google.com/file/d/1WyzvowhwblTLcdeMX95OAbBkJH3zHBGb/view?usp=sharing)



## Collection of requests in Postman
[Collection Postman](https://www.postman.com/martian-equinox-934588/workspace/capstone-progra4/collection/23074740-8a289d5a-57cf-434f-b8c5-4dd8865bda2a?action=share&source=copy-link&creator=23074740)

## Image web
![postman_image](./img/postman_image.png)