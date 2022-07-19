var express = require('express');
var router = express.Router();
const axios = require('axios');

var users = [
  { 
    id: 0,
    email: "admin@ica.com",
    name: "ICA Admin",
    type: "admin"
  },
  { 
    id: 1,
    email: "composer@autoberlin.com",
    name: "Composer Autoberlin",
    organization: {
      name: "Auto Berlin",
      id: 1,
      planid: 1
    },
    type: "composer"
  },
  { 
    id: 2,
    email: "viewer@autoberlin.com",
    name: "Viewer Autoberlin",
    organization: {
      name: "Auto Berlin",
      id: 1,
      planid: 1
    },
    type: "viewer"
  },
  { 
    id: 3,
    email: "composer@v8cars.com",
    name: "Composer V8Cars",
    organization: {
      name: "V8 Cars",
      id: 2,
      planid: 2
    },
    type: "composer"
  },
  { 
    id: 4,
    email: "viewer@v8cars.com",
    name: "Viewer V8Cars",
    organization: {
      name: "V8 Cars",
      id: 2,
      planid: 2
    },
    type: "viewer"
  },
  { 
    id: 5,
    email: "composer@autopartsllc.com",
    name: "Composer Autopars LLC",
    organization: {
      name: "Autopars LLC",
      id: 3,
      planid: 3
    },
    type: "composer"
  },
  { 
    id: 6,
    email: "viewer@autopartsllc.com",
    name: "Viewer Autopars LLC",
    organization: {
      name: "Autopars LLC",
      id: 3,
      planid: 3
    },
    type: "viewer"
  }
];

var organizations = [
  {
    name: "Auto Berlin",
    id: 1,
    planid: 1
  },
  {
    name: "V8 Cars",
    id: 2,
    planid: 2
  },
  {
    name: "Autopars LLC",
    id: 3,
    planid: 3
  }
];

router.get('/', (req, res, next) => {
  return res.send(users)
})

router.get('/organizations', (req, res, next) => {
  return res.send(organizations);
})

router.post('/auth', (req, res, next) => {
  let { body } = req;
  console.log(body);
  let user = users.filter(u => u.email == body.email)[0];
  if(!user){
    res.status(500).send({message: "User does not exist."});
  }
  return res.send(user);
})

router.get('/:userid', (req, res, next) => {
  let user = users.filter(u => u.id == req.params.userid)[0];
  if(!user){
    res.status(500).send({message: "User does not exist."});
  }
  return res.send(user);
})

router.get('/organizations/:organizationid', (req, res, next) => {
  let org = organizations.filter(u => u.id == req.params.organizationid)[0];
  if(!org){
    res.status(500).send({message: "Organization does not exist."});
  }
  return res.send(org)
})

module.exports = router;