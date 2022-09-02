var express = require('express');
var router = express.Router();
const axios = require('axios');


router.get('/', (req, res, next) => {
  return res.send(users)
})

/*
PACKAGE
1- create new package version /api/v4/qrvey/admin/content/deployment/package/{packageID}/job/version - this will return a jobTrackerID
1.1 - do aput on the package with status: Loading /api/v4/qrvey/admin/content/deployment/package/{packageID}
2- check job for updates /api/v4/qrvey/admin/content/deployment/worker/job/{jobTrackerID}
2.1- when the job is completed, do a PUT with status: Completed /api/v4/qrvey/admin/content/deployment/package/{packageID} 

DEPLOYMENT DEFINITION
1- Create a New definition /api/v4/qrvey/admin/content/deployment/definition - this will return a definition object with a definitionID
{
    "name": "Untitled 74",
    "description": "This is the definition description"
}
2- Do a PUT with all the info???

Deployment Job
1-  create a deployment job /api/v4/qrvey/admin/content/deployment/job/
{
    "name": "Untitled 93",
    "description": "Deployment Job Description"
}
2
*/


module.exports = router;