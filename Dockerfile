FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Create data directory
RUN mkdir -p data

# Move store_master.csv to data directory if it exists at project root
RUN if [ -f store_master.csv ]; then mv store_master.csv data/; fi

# Build the project (if needed)
RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]