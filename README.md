# project_template

# Make sure to fill out the README with the information specified in the project description!

## How to deploy

In order to deploy onto the ugrad servers (i.e `<CWL>@pender.students.cs.ubc.ca` or `<CWL>@remote.students.cs.ubc.ca`)
please follow these steps:

1. Have the repository on your ugrad server. This can be achieved either through using git and pulling the files directly
   from the server, or uploading the project directory manually through something like Cyberduck. If you would like to set
   it up to directly pull from the git repository, you can follow <a href="https://medium.com/@kyledeguzmanx/quick-step-by-step-guide-to-generating-an-ssh-key-in-github-d3c6f7e185bb" target="_blank">this</a>
   guide.

2. Run

   ```
   npm run build
   ```

   locally within the `/frontend` directory. This will generate a `/build` directory located at `/frontend/build`.

3. Upload this newly generated `build` directory to `/frontend` in the project on the ugrad server. The `build` directory is not committed to GitHub, nor are you able to run any `npm` commands on the ugrad server
   so this must be done locally.
4. Make sure the `.env` file on the ugrad server has the correct credentials for the database. i.e. change
   ```
   ORACLE_USER=ora_YOUR-CWL-USERNAME
   ORACLE_PASS=aYOUR-STUDENT-NUMBER
   ```
5. Run

   ```
   sh remote-start.sh
   ```

   on the project in the ugrad server. If this is successful, it should say

   ```
   Updated ./.env with PORT=<PORT NUMBER>.
   Server running at http://localhost:<PORT NUMBER>/
   Connection pool started
   ```

   Take note of the `PORT NUMBER` as we will need it in the next step.

6. Now we need to build an SSH tunnel. In the root directory of the project on your device, if you are on Mac, run:
   ```
   sh ./scripts/mac/server-tunnel.sh
   ```
   or if you are on Windows, run:
   ```
   .\scripts\win\server-tunnel.cmd
   ```
   It will prompt you with
   ```
   Enter your remote Node starting port number:
   ```
   to which you need to enter the `PORT NUMBER` from the previous step. It will then prompt you for your CWL and password.
   After entering those, you should be able to access the application from
   ```
   http://localhost:<PORT NUMBER>
   ```
7. When you are done using the application, remember to close your connection with `Ctrl + c` on the ugrad server to close the connection pool.

## Node version

Because the ugrad servers have node version 12.22.9, we also need to match the node version locally. Use node version manager
to change your node version locally with

```
source $(brew --prefix nvm)/nvm.sh
```

```
nvm use 12.22.9
```

Using this version of node requires using the `module.export` syntax for exporting functions.

## How to set up to run locally

To avoid having to deploy every time you want to view your changes in the application, we can run the app locally by creating
a tunnel to the Oracle DB on the ugrad servers.

### Prerequisites

You need to have [Oracle Instant Client](https://www.oracle.com/database/technologies/instant-client/downloads.html) installed.
Here are the steps to install it:

1. From the link above, on Mac, download the Basic Package (DMG) as well as SQL\*PLUS Package (DMG).

2. Create a new folder in `/users/<name>` and name it `instantclient`. Open the two DMGs and drag all the files into this new
   folder.

3. Make a new directory called `lib` also in `/users/<name>`.

4. Next, we need to create a symbolic link in the `lib` directory to the `libclntsh.dylib` file in `instantclient`.
   Use the following command in `/users/<name>`:

   ```
   ln -s ~/instantclient/libclntsh.dylib ~/lib/
   ```

   Confirm that indeed a symbolic link was created by doing `cd lib` and `ls -la`.

5. Next, we need to add some Oracle environment variables to `.zshrc` located in `/users/<name>`. You can check it is
   in there with `ls -la` again. Add the following lines to the file (replace `<name>` with whatever your user directory is called):

   ```
   export PATH=/Users/<name>/instantclient:$PATH
   export ORACLE_HOME=/Users/<name>/instantclient
   export DYLD_LIBRARY_PATH=/Users/<name>/instantclient
   export OCI_LIB_DIR=/Users/<name>/instantclient
   ```

6. Save the file and set the variables with the command:

   ```
   source .zshrc
   ```

   Check that this was successful with:

   ```
   echo $ORACLE_HOME
   ```

   As well as all the other variables.

### Creating the tunnel to DB

Now, on Mac, run the script:

```
sh scripts/mac/db-tunnel.sh
```

in the root folder of the project. It will respond with

```
Building SSH tunnel on port <PORT_NUMBER> to your oracle database...
```

Now your project will be able to access the database through `localhost:<PORT_NUMBER>`.

If you are on IntelliJ, you can use the built-in database client to view the database directly.

### Setting up Intellij DB client

On IntelliJ, click on database (it should be an icon on either the side or the top) > Add data source > Oracle
Enter the following fields:

```
Host: localhost
Port: <PORT_NUMBER>
SID: stu
User: ora_<CWL>
Password: a<STUDENT_NUMBER>
```

Click on Test connection to check the connection.

Now, when you run `node server.js`, all the errors involving Oracle DB should be gone, and your application can now access
the database directly.

## SQL Scripts

Before you can run the SQL scripts on your own ugrad Oracle DB, you must change the schema names in the scripts:

In `scripts/sql/Init.sql` and `scripts/sql/DropTables.sql` replace <CWL> in the first line with your CWL

```
ALTER SESSION SET CURRENT_SCHEMA = ORA_<CWL>;
```
