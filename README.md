# Kirana - Backend Image Processing Service

## Overview
Kirana is a RESTful service built with Node.js/TypeScript that processes images collected from retail stores. It implements a job queue system that handles asynchronous processing of thousands of images, calculating the perimeter of each image (using the formula 2 * [Height + Width]).

## API Endpoints

### 1. Submit Job
Create a job to process images collected from stores.

**URL:** `/api/submit/`

**Method:** `POST`

**Request Payload:**
```json
{
   "store_ids": [1, 2, 3],
   "image_urls": ["http://example.com/1.jpg", "http://example.com/2.jpg", "http://example.com/3.jpg"],
   "count": 3
}
```

**Success Response:**
- **Code:** 201 CREATED
- **Content:**
```json
{
   "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438",
   "status": "created"
}
```

**Error Response:**
- **Code:** 400 BAD REQUEST
- **Content:**
```json
{
   "error": "Invalid request. Missing required fields or count mismatch."
}
```

### 2. Get Job Info
Check the status of a submitted job.

**URL:** `/api/status?jobid=7589c601-71e2-4a28-a82d-23594e9e9438`

**Method:** `GET`

**URL Parameters:**
- `jobid` - Job ID received when creating the job

**Success Response (Completed Job):**
- **Code:** 200 OK
- **Content:**
```json
{
   "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438",
   "status": "completed",
   "results": [
      {"store_id": 1, "image_url": "http://example.com/1.jpg", "perimeter": 1280},
      {"store_id": 2, "image_url": "http://example.com/2.jpg", "perimeter": 1920},
      {"store_id": 3, "image_url": "http://example.com/3.jpg", "perimeter": 2560}
   ]
}
```

**Success Response (Failed Job):**
- **Code:** 200 OK
- **Content:**
```json
{
   "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438",
   "status": "failed",
   "error": "Store ID 4 not found in store master"
}
```

**Error Response:**
- **Code:** 400 BAD REQUEST
- **Content:**
```json
{
   "error": "Job ID not found"
}
```

## Project Documentation

### Description
The service validates store IDs against a master list, downloads and processes images, and tracks job status throughout the lifecycle of each request.

### Assumptions
- Store IDs are validated against the provided CSV file
- Image URLs are publicly accessible without authentication
- A simulated processing delay (0.1-0.4 seconds) mimics GPU processing
- In-memory storage is sufficient for this assignment

### Installation and Testing

#### Prerequisites
- Bun (>= 1.0.0)
- Docker (optional, for containerized deployment)

#### Setup and Running

**Without Docker**
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
bun install

# Build and run the application
bun run build
bun run start

# For development with automatic reloading
bun run dev
```

**With Docker**
```bash
# Build and start the Docker container
docker build -t kirana .
docker run -p 3000:3000 kirana
```

#### Testing the API
```bash
# Submit a job
curl -X POST -H "Content-Type: application/json" -d '{"store_ids":[1,2,3],"image_urls":["http://example.com/1.jpg","http://example.com/2.jpg","http://example.com/3.jpg"],"count":3}' http://localhost:3000/api/submit

# Check job status
curl http://localhost:3000/api/status?jobid=<job_id>
```

### Work Environment
- Programming Language: TypeScript/JavaScript
- Runtime Environment: Bun (Node.js compatible)
- Libraries: express, axios, image-size, csv-parser, uuid

### Future Improvements
- Persistent storage with database integration
- Message queue system for better job handling
- Security enhancements including auth and rate limiting
- Monitoring, logging, and comprehensive testing
- Performance optimizations and caching


(Honestly speaking i was not able to test the docker setup, as my system simply doesn't have enough resources to run docker, so i have tested the code without docker and it is working fine.)