#!/bin/bash

# Variables
BUILD_DIR="frontend/build"  # The build folder path in your React project
NODE_MODULES_DIR="node_modules"
ENV_FILE=".env"
REMOTE_USER="<CWL>"  # SSH username
REMOTE_HOST="remote.students.cs.ubc.ca"  # SSH server address
REMOTE_PATH="/home/<FIRST_LETTER_OF_YOUR_CWL>/<CWL>/<REPLACE_WITH_PROJECT_DIRECTORY>"  # Target path on the SSH server

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build directory does not exist. Run 'npm run build' first."
  exit 1
fi

if [ ! -d "$NODE_MODULES_DIR" ]; then
  echo "node_modules directory does not exist. Run 'npm install' first."
  exit 1
fi

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file does not exist. Please ensure it is in the project directory."
  exit 1
fi

# Upload .env file to the root of the project folder
echo "Uploading $ENV_FILE to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH..."
rsync -avz "$ENV_FILE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"

# Create /frontend/build directory on the remote server if it doesn't exist
echo "Creating /node_modules directory on the remote server..."
ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH/node_modules"

# Upload the entire build folder to the /frontend folder on the server
echo "Uploading $NODE_MODULES_DIR to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
rsync -avz "$NODE_MODULES_DIR" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

# Create /frontend/build directory on the remote server if it doesn't exist
echo "Creating /frontend/build directory on the remote server..."
ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH/frontend/build"

# Upload the entire build folder to the /frontend folder on the server
echo "Uploading $BUILD_DIR to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend..."
rsync -avz "$BUILD_DIR" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/frontend"

echo "Upload complete!"
