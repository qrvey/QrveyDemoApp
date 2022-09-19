var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
let raw_users, users, raw_plans, plans, raw_organizations, organizations;

function getUsersPlansOrganizations(){
  raw_users = fs.readFileSync('./routes/database/users.json');
  users = JSON.parse(raw_users);
  raw_plans = fs.readFileSync('./routes/database/plans.json');
  plans = JSON.parse(raw_plans);
  raw_organizations = fs.readFileSync('./routes/database/organizations.json');
  organizations = JSON.parse(raw_organizations);
}

router.get('/', (req, res, next) => {
  return res.send(users)
})

router.put('/addPagePlan', (req, res, next) => {
  let { body } = req;
  let planid = +body.planid;
  let page = body.page;
  getUsersPlansOrganizations();
  let update = false;
  plans.forEach(p => {
    if(p.id == planid && !p.pages_access.includes(page.name)){
      p.pages_access.push(page.name);
      update = true;
    }else{
      if(p.id < planid && !p.pages_access.includes(page.name)){
        p.pages_access.push(page.name);
        update = true;
      }
    }
  });

  if(update){
    let plans_data = JSON.stringify(plans);
    fs.writeFileSync('./routes/database/plans.json', plans_data);
  }
  
  return res.send(plans);
})


module.exports = router;