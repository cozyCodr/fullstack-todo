#!/bin/bash

# Function to check command success
check_command() {
  if [ $? -ne 0 ]; then
    echo "$1 failed. Exiting..."
    exit 1
  fi
}

# Build Spring Boot application with Maven
echo "Building Spring Boot application..."
mvn clean package
check_command "Spring Boot application build"

# Build Docker image
echo "Building Docker image..."
docker build -t todo .

# Check if Docker image build was successful
check_command "Docker image build"

# Run Docker Compose
echo "Running Docker Compose..."
docker-compose up -d

# Check if Docker Compose was successful
check_command "Docker Compose"

echo "Application deployed successfully."
