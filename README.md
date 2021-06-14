##Follow the procedure: 

Before running the project please install [PostgreSQL 10](https://www.postgresql.org/download/) or above.

If you're a Windows 10 user there might be an issue with encoding check if it's relative to you
the troubleshooting might be to open a config file:

`C:\Program Files\PostgreSQL\VERSION\data\postgresql.conf`
changing the `lc_messages` value of `Russian_Ukraine.1251` to `en_EN.
utf-8`

Next, open a Windows Environment variables and add the following line to PATH

`C:\Program Files\PostgreSQL\YOUR_CURRENT_VERSION\bin`

Change values in METHOD column to trust provided you're under development mode

`C:/Program Files/PostgreSQL/YOUR_CURRENT_VERSION/data/pg_hba.conf`

Run psql and reload your config. Alternatively if you're a Windows user go 
to a control panel, open services and restart a postgresql service itself

`select pg_reload_conf(); - reload config`

Use "postgres" username to enter to a postgresql CLI once you run psql and 
then your password would be the password you specified during PostgreSQL installation.
If you're going to create your own account, type the command:

`create role USERNAME login superuser;`

Mind! All commands should be closed with semicolon! Enter the line to create 
a new password for your just created account:

`\password USERNAME;`

You won't be able to use your account if you haven't created a new database:

`create database USERNAME;`


The PostgreSQL command to list existing databases

`\l`

Open Terminal and then go to server directly. Initialize a project database
`npm run initdb`