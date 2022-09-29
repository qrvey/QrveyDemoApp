var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
let raw_users, users, raw_plans, plans, raw_organizations, organizations;

function getUsersPlansOrganizations() {
  raw_users = fs.readFileSync('./routes/database/users.json');
  users = JSON.parse(raw_users);
  raw_plans = fs.readFileSync('./routes/database/plans.json');
  plans = JSON.parse(raw_plans);
  raw_organizations = fs.readFileSync('./routes/database/organizations.json');
  organizations = JSON.parse(raw_organizations);
}

function updateAdmins(taskid, clear) {
  getUsersPlansOrganizations();
  let updated_users = [];
  users.forEach(u => {
    if (u.type == 'admin') {
      u.taskId = clear ? null : taskid;
      u.taskStatus = clear ? null : "DEPLOYING";
      updated_users.push(u);
    }
  });
  let user_data = JSON.stringify(users);
  fs.writeFileSync('./routes/database/users.json', user_data);
  return updated_users;
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
    if (p.id == planid && !p.pages_access.includes(page.name)) {
      p.pages_access.push(page.name);
      update = true;
    } else {
      if (p.id < planid && !p.pages_access.includes(page.name)) {
        p.pages_access.push(page.name);
        update = true;
      }
    }
  });

  if (update) {
    let plans_data = JSON.stringify(plans);
    fs.writeFileSync('./routes/database/plans.json', plans_data);
  }

  return res.send(plans);
})


router.post('/run', (req, res, next) => {
  let { body } = req;
  let url = `${process.env.DEPLOYMENT_PATH}/admin/task/execute`;
  // let api = process.env.API_KEY;
  const appname = "Base Line App";

  let dbody = {
    "eventType": "SYNC_APPLICATIONS",
    "payload": {
      "masterEmail": process.env.DEPLOYMENT_MASTER_EMAIL,
      "adminCenterUsername": process.env.ADMIN_USER_NAME,
      "adminCenterUserPassword": process.env.ADMIN_PASSWORD,
      "serverName": process.env.ADMIN_SERVER_NAME,
      "packageName": process.env.ADMIN_PACKAGE_NAME,
      "packageVersionName": process.env.ADMIN_PACKAGE_V_NAME,
      "tenantList": []
    }
  }

  getUsersPlansOrganizations();

  organizations.forEach(o => {
    let t = {
      name: appname,
      email: o.qrvey_info.email
    }
    dbody.payload.tenantList.push(t);
  })

  let data = JSON.stringify(dbody);

  var config = {
    method: 'post',
    url: url,
    headers: {
      "Content-Type": 'application/json'
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      return res.send(response.data)
    })
    .catch(function (error) {
      res.status(500).send(error.response.data)
    });
})


router.get('/progress/:taskid', (req, res, next) => {
  let url = `${process.env.DEPLOYMENT_PATH}/admin/task/${req.params.taskid}`;
  let updated_users = [];
  var config = {
    method: 'get',
    url: url,
    headers: {
      "Content-Type": 'application/json'
    }
  };
  axios(config)
    .then(function (response) {
      updated_users = updateAdmins(response.data.taskId);
      response.data['updated_parent_app_users'] = updated_users;
      return res.send(response.data);
    })
    .catch(function (error) {
      res.status(500).send(error.responses)
    });
});


router.put('/clear-task', (req, res, next) => {
  let updated_parent_app_users = updateAdmins(null, true);
  return res.send({ updated_parent_app_users });
});





module.exports = router;