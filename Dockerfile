# Use a specific tag for the node image to avoid unexpected changes in the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the application code to the working directory
COPY server.js ./

# Since there is no package.json, the npm install step is not included

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]

# Comments and Fixes:
# 1. Specify the base image tag to avoid unexpected changes (e.g., security updates or breaking changes in the base image).
# 2. Set the working directory inside the container to /usr/src/app.
# 3. Copy the application code (server.js) to the working directory.
# 4. Expose the necessary port for the application (3000).
# 5. Use CMD to specify the command to run the application.
