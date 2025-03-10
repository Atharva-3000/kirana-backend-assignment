# Backend Intern Assignment

Retail Pulse wants to create a service to process thousands of images collected from stores.

1. [The service receives the jobs with image URLs and store id](about:blank#1-submit-job)
    
    There can be multiple jobs with thousands of images each at a given time, a job can take few minutes to an hour to complete. Using the above API a user submits the job.
    
2. To process a job, the service downloads the images and calculates the perimeter `2* [Height+Width]` of each image. After calculating the perimeter of the image you need to have a **random sleep time of 0.1 to 0.4 secs** (this is to imitate GPU processing). After this, we store the results at an image level.
3. Refer [Store Master](https://drive.google.com/file/d/1dCdAFEBzN1LVUUKxIZyewOeYx42PtEzb/view?usp=sharing) for the `store_id`, `store_name` and `area_code`
4. Once the job is created, [Get Job Info](https://www.notion.so/Backend-Intern-Assignment-529d5850691d483db61c3561cfaa7293?pvs=21) API can check its status

## 1. Submit Job

Create a job to process the images collected from stores.

**URL**: `/api/submit/`

**Method**: `POST`

**Request Payload**

```
{
   "count":2,
   "visits":[
      {
         "store_id":"S00339218",
         "image_url":[
            "https://www.gstatic.com/webp/gallery/2.jpg",
            "https://www.gstatic.com/webp/gallery/3.jpg"
         ],
         "visit_time": "time of store visit"
      },
      {
         "store_id":"S01408764",
         "image_url":[
            "https://www.gstatic.com/webp/gallery/3.jpg"
         ],
         "visit_time": "time of store visit"
      }
   ]
}
```

### Success Response

**Condition**: If everything is OK, and a job is created.

**Code**: `201 CREATED`

**Content example**

```
{    "job_id": 123}
```

### Error Responses

**Condition**: If fields are missing OR count != len(visits)

**Code**: `400 BAD REQUEST`

**Content example**

```
{    "error": ""}
```

## 2. Get Job Info

**URL** : `/api/status?jobid=123`

**URL Parameters**: - `jobid` Job ID received while creating the job

**Method**: `GET`

### Success Response

**Condition**: If everything is OK and jobID exists.

**Code**: `200 OK`

**Content example**

- **job status**: completed / ongoing

```
{
    "status": "completed",
    "job_id": ""
}
```

- **job status**: failed

If a `store_id` does not exist or an image download fails for any given URL. The error message contains only the failed `store_id`

```
{
    "status": "failed",
    "job_id": "",
    "error": [{
         "store_id":"S00339218",
         "error": ""
      }]
}
```

### Error Responses

**Condition**: If `jobID` does not exist

**Code**: `400 BAD REQUEST`

**Content**

```
{}
```

## Project Requirements:

- Application must be written in Go using Go Modules.
- Provide a [docker](https://www.docker.com/) solution for setup, but also ensure it works without docker too. (normal go run works too)
- Write the project documentation containing:
    - Description;
    - Assumptions you took if any;
    - Installing (setup) and testing instructions;
    - Brief description of the work environment used to run this project (Computer/operating system, text editor/IDE, libraries, etc).
    - If given more time, what improvements will you do?

**Have fun!**


here is how the refer storemaster file looks like:
https://drive.google.com/file/d/1dCdAFEBzN1LVUUKxIZyewOeYx42PtEzb/view?usp=sharing

and this is some of the contents inside it.
there are 3 columns:
AreaCode, StoreName, StoreID

and this just the first 5 rows of the data:
7100015	B P STORE	RP00001
7100015	MONAJ STORE	RP00002
7100015	ZARDA HOUSE	RP00003
7100015	BHARAT STORE	RP00004
7100015	BASANA PAN GHAR	RP00005
7100015	BHAGWANDAS RADHESHYAM	RP00006
7100015	SURUCHI	RP00007
7100015	NEW VERITY STORE	RP00008

and we have lots of it.


this is an assignment for an intern position, i wanna make it in node.js. skip the documentation for now, lets make this.