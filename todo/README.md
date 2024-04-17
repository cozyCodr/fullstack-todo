# Todo App Backend

## Running the App with Docker (build-and-run.sh script)

This script automates the process of building, deploying, and running a Dockerized application.

**Functionality:**

1. **Gradle Build:**
    * Executes the `./mvn clean package` command to build the application using Maven.
    * Checks the exit code (`$?`) to ensure the build was successful (exit code 0).
    * Exits with an error message if the build fails (exit code non-zero).

2. **Docker Image Build:**
    * Builds a Docker image for the application using the `docker build -t twitter-analog .` command.
        * `-t`: Tag the image with the name `todo`.
        * `.`: Build the image from the current directory (where the Dockerfile resides).
    * Checks the exit code (`$?`) to ensure the image build was successful.
    * Exits with an error message if the image build fails.

3. **Run Docker Compose:**
    * Starts the application using Docker Compose with the `docker-compose up -d` command.
        * `-d`: Runs the containers in detached mode (background).
    * Checks the exit code (`$?`) to ensure Docker Compose ran successfully.
    * Exits with an error message if Docker Compose fails.

4. **Success Message:**
    * If all steps are successful, the script displays a message indicating "Application deployed successfully."

**How to Use:**

1.  Make the script executable: `chmod +x build-and-run.sh`
2.  Run the script: `./build-and-run.sh`

**Assumptions:**

* The script assumes a Gradle build is configured for the project.
* A Dockerfile named `Dockerfile` is present in the current directory.
* A docker-compose.yml file is present in the current directory to define the application's services.
