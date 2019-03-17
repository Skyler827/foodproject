# Foodproject
*A point of sale/restaraunt item ordering and management system*
## Setup
This web application is currently in development, but is intended to work across all platforms.
1. Ensure that Node, npm, bash, and PostgreSQL are all installed
2. If on Windows, run the following command: 

        npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe"
3. Set up database by running `psql -f server/database_setup.sql`
4. `cd` into `client/` and run `npm install`
5. Run `ng build` to compile client assets
6. `cd` into `server/` and run `npm install`
7. `npm start` to run the server

