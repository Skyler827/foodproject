# Foodproject
*A point of sale/restaraunt item ordering and management system*
##About
This web application is currently in development, but is intended to work across all platforms.
## Setup
1. Ensure that node, npm, bash, and PostgreSQL are all installed (uses git bash on Windows)
2. If deploying to a production server:
    
    2.1 Ensure that nginx is also installed

    2.2 Create a user for the foodproject application:

       useradd -s /bin/bash -m -d /home/foodproject foodproject
    
    2.3 Clone (or move) this repository to the home directory of the `foodproject` user:

       git clone git@github.com:Skyler827/foodproject.git
    (note: if you are deploying to a production server and you aren't Skyler, be sure to 
    set up a different remote repository so you can update npm packages as required to 
    fix published vulnerabilities)

3. If on Windows, run the following command: 

        npm config set script-shell "C:\\Program Files (x86)\\git\\bin\\bash.exe"
4. Set up database by running `psql -f server/database_setup.sql`
5. `cd` into `client/` and run `npm install`
6. If deploying to production, Find and Fix any vulnerabilities with `npm audit`
7. Run `npx ng build` to compile client assets
8. If deploying to a production server where `$URL` is the domain, create a site configuration file (with name: `$URL`) under nginx `sites-available` as follows, substituting `$URL` below for the actual host domain you will use:

        server {
            listen 80;
            server_name $URL;
            error_page 404 /index.html
            location / {
                root /var/www/$URL;
            }
            location /api/ {
                proxy_pass http://127.0.0.1:3000;
           }
        }
    Next, create a symbolic link from `sites-enabled/$URL` to `sites-available/$URL` to enable the web service:

        sudo ln -s /etc/nginx/sites-available/$URL /etc/nginx/sites-enabled/$URL
9. `cd` into `server/` and run `npm install`
10. `npm start` to run the server (for development or local testing)

The remaining steps are only necessary if you are deploying on a production server:

11. Assuming your server uses systemd, create a systemd service as `/etc/systemd/foodproject`:

        [Unit]
        Description=Foodproject web service
        After=network.target
        StartLimitIntervalSec=0

        [Service]
        Type=simple
        Restart=always
        RestartSec=1
        WorkingDirectory=/home/foodproject/foodproject/server
        User=foodproject
        Group=foodproject
        ExecStartPre=npm install
        ExecStartPre=rm -rf /home/foodproject/foodproject/server/out
        ExecStartPre=/usr/bin/npx tsc
        ExecStart=/usr/bin/node /home/foodproject/foodproject/server/out/server.ts

        [Install]
        WantedBy=multi-user.target

    (If your server does not use systemd, use whatever init system that is available to ensure that the foodproject application runs, or skip this step and start it manually with `nohup` or something if you prefer)
12. Set up certbot
