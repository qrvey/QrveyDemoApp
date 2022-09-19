var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
let raw_users = fs.readFileSync('./routes/database/users.json');
let raw_organizations = fs.readFileSync('./routes/database/organizations.json');
let raw_plans = fs.readFileSync('./routes/database/plans.json');

var users = JSON.parse(raw_users);

var organizations = JSON.parse(raw_organizations);

var plans = JSON.parse(raw_plans);

router.get('/', (req, res, next) => {
  return res.send(users)
})

router.put('/', (req, res, next) => {
  let { body } = req;
  let user;
  users.forEach(u => {
    if (u.id == body.id) {
      u.type = body.type;
      user = u;
    }
  })
  let data = JSON.stringify(users);
  fs.writeFileSync('./routes/database/users.json', data);
  return res.send(user);
})

router.get('/organizations', (req, res, next) => {
  return res.send(organizations);
})

router.get('/plans', (req, res, next) => {
  return res.send(plans);
})

router.get('/tenants-users', (req, res, next) => {
  let org = [...organizations];
  org.forEach(o => {
    o['users'] = users.filter(u => u.organization.id == o.id)
  })
  return res.send(org);
})

router.post('/auth', (req, res, next) => {
  let { body } = req;
  let user = users.filter(u => u.email == body.email)[0];
  if (!user) {
    res.status(500).send({ message: "User does not exist." });
  }
  return res.send(user);
})

router.get('/:userid', (req, res, next) => {
  let user = users.filter(u => u.id == req.params.userid)[0];
  if (!user) {
    res.status(500).send({ message: "User does not exist." });
  }
  return res.send(user);
})


router.get('/organizations/:organizationid', (req, res, next) => {
  let org = organizations.filter(u => u.id == req.params.organizationid)[0];
  if (!org) {
    res.status(500).send({ message: "Organization does not exist." });
  }
  org['users'] = users.filter(u => u.organization.id == org.id)
  return res.send(org)
})

router.put('/organizations/:organizationid/changeplan', (req, res, next) => {
  let { body } = req;
  let orgid = req.params.organizationid;
  let organization;
  organizations.forEach(o => {
    if(o.id == orgid){
      o.planid = body.planid;
      organization = o;
    }
  });
  users.forEach(u => {
    if(u.organization.id == orgid){
      u.organization.planid = body.planid;
    }
  });
  let user_data = JSON.stringify(users);
  let org_data = JSON.stringify(organizations);
  fs.writeFileSync('./routes/database/users.json', user_data);
  fs.writeFileSync('./routes/database/organizations.json', org_data);
  return res.send(organization);
})

module.exports = router;