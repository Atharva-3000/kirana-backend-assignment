# Kirana API Documentation for Postman

## API Overview

This document provides detailed information about the Kirana API endpoints for image processing jobs. These endpoints allow you to submit jobs for processing store images and check their status.\
### Every job is successfully registered, and the real error is returned when checked against the jobid kinda like real life scenario.

## Base URL

```
http://localhost:3000
```

## Endpoints

### 1. Submit Job

Creates a new job to process images from store visits.

**URL**: `/api/submit`

**Method**: `POST`

**Request Body**:

```json
{
    "count": 2,
    "visits": [
        {
            "store_id": "RP00001",
            "image_url": [
                "https://picsum.photos/200/300.jpg",
                "https://picsum.photos/200/301.jpg"
            ],
            "visit_time": "2023-03-10T12:00:00Z"
        },
        {
            "store_id": "RP00002",
            "image_url": [
                "https://picsum.photos/200/302.jpg"
            ],
            "visit_time": "2023-03-10T13:00:00Z"
        }
    ]
}
```

**Response (Success - 201 Created)**:

```json
{
    "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438"
}
```

**Response (Error - 400 Bad Request)**:

```json
{
    "error": "Invalid count or visits structure"
}
```

### 2. Check Job Status

Retrieve the current status of a job.

**URL**: `/api/status`

**Method**: `GET`

**Query Parameters**:
- `jobid` (required): The ID of the job to check

**Example**: `/api/status?jobid=7589c601-71e2-4a28-a82d-23594e9e9438`

**Response (Success - 200 OK)** - For completed job:

```json
{
     "status": "completed",
     "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438"
}
```

**Response (Success - 200 OK)** - For ongoing job:

```json
{
     "status": "ongoing",
     "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438"
}
```

**Response (Success - 200 OK)** - For failed job:

```json
{
     "status": "failed",
     "job_id": "7589c601-71e2-4a28-a82d-23594e9e9438",
     "error": [
          {
                "store_id": "RP00001",
                "error": "Invalid store ID"
          }
     ]
}
```

**Response (Error - 400 Bad Request)** - For non-existent job:

```json
{}
```

### 3. Health Check

Check if the API is running.

**URL**: `/health`

**Method**: `GET`

**Response (Success - 200 OK)**:

```json
{
     "status": "ok"
}
```

### 4. Metrics (If Implemented)

Get system metrics for monitoring.

**URL**: `/metrics`

**Method**: `GET`

**Response (Success - 200 OK)**:

```json
{
     "status": "ok",
     "metrics": {
          "uptime": 123.45,
          "timestamp": 1678432198765,
          "requests": 42,
          "errors": 2,
          "memory": {
                "rss": 78643200,
                "heapTotal": 35651584,
                "heapUsed": 26905936,
                "external": 1221718
          },
          "queue": {
                "waiting": 0,
                "active": 2,
                "completed": 38,
                "failed": 2
          }
     }
}
```

## Testing Edge Cases

### Submit Job with Invalid Store ID

```json
{
     "count": 1,
     "visits": [
          {
                "store_id": "INVALID_STORE",
                "image_url": ["https://picsum.photos/200/300.jpg"],
                "visit_time": "2023-03-10T12:00:00Z"
          }
     ]
}
```

### Submit Job with Invalid Image URL

```json
{
     "count": 1,
     "visits": [
          {
                "store_id": "RP00001",
                "image_url": ["https://invalid-url-that-does-not-exist.jpg"],
                "visit_time": "2023-03-10T12:00:00Z"
          }
     ]
}
```

### Submit Job with Count Mismatch

```json
{
     "count": 2,
     "visits": [
          {
                "store_id": "RP00001",
                "image_url": ["https://picsum.photos/200/300.jpg"],
                "visit_time": "2023-03-10T12:00:00Z"
          }
     ]
}
```

### Check Status with Invalid Job ID

```
/api/status?jobid=invalid-id
```

## Setting Up in Postman

### 1. Create a New Collection

1. Open Postman
2. Click on "Collections" in the sidebar
3. Click the "+" button to create a new collection
4. Name it "Kirana API"

### 2. Set Up Environment Variables

1. Click on "Environments" in the sidebar
2. Click the "+" button to create a new environment
3. Name it "Kirana Local"
4. Add the following variables:
    - `base_url`: `http://localhost:3000`
    - `job_id`: Leave this empty (will be populated during tests)
5. Click "Save"
6. Make sure to select the "Kirana Local" environment from the dropdown in the top-right corner

### 3. Create Requests

#### Submit Job Request

1. In the "Kirana API" collection, click "Add request"
2. Name it "Submit Job"
3. Set the method to POST
4. Set the URL to `{{base_url}}/api/submit`
5. Go to the "Body" tab
6. Select "raw" and "JSON" format
7. Enter the submit job JSON payload (from the example above)
8. Go to the "Tests" tab
9. Add the following script to save the job ID:
    ```javascript
    if (pm.response.code === 201) {
      const responseJson = pm.response.json();
      pm.environment.set("job_id", responseJson.job_id);
      console.log("Job ID saved: " + responseJson.job_id);
    }
    ```
10. Save the request

#### Check Status Request

1. In the "Kirana API" collection, click "Add request"
2. Name it "Check Job Status"
3. Set the method to GET
4. Set the URL to `{{base_url}}/api/status?jobid={{job_id}}`
5. Save the request

#### Health Check Request

1. In the "Kirana API" collection, click "Add request"
2. Name it "Health Check"
3. Set the method to GET
4. Set the URL to `{{base_url}}/health`
5. Save the request

#### Metrics Request

1. In the "Kirana API" collection, click "Add request"
2. Name it "Metrics"
3. Set the method to GET
4. Set the URL to `{{base_url}}/metrics`
5. Save the request

### 4. Create a Test Flow (Collection Runner)

1. Click on the "..." menu next to the "Kirana API" collection
2. Select "Run collection"
3. Arrange the requests in this order:
    - Health Check
    - Submit Job
    - Check Job Status
4. Set the delay between requests to 2000ms
5. Click "Run Kirana API"

This will run through the complete flow of checking if the API is up, submitting a job, and checking its status.

## Debugging Tips

1. If you get connection errors, make sure the server is running on port 3000
2. Check the "Console" tab in Postman for any errors or log messages
3. Verify that the store IDs used in your tests exist in the `store_master.csv` file
4. If image processing fails, try using different image URLs (e.g., from picsum.photos)
5. For persistent issues, check the server logs for more detailed error information
