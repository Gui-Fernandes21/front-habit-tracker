# -----------------------
# 1) Build Stage
# -----------------------
FROM node:18-alpine AS build

# Create and switch to the app directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the Nuxt 3 app
# This will generate the .output folder
RUN npm run build

# -----------------------
# 2) Production Stage
# -----------------------
FROM node:18-alpine AS production

WORKDIR /app

# Copy only the build output and necessary files
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose Nuxt 3 default port
EXPOSE 3000

# Start the Nuxt 3 server
CMD ["node", ".output/server/index.mjs"]
