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

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// Generate token to embed widgets with security token
router.post('/generateJwt', (req, res, next) => {

    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v4/core/login/token`;
    let api = process.env.API_KEY;
    let data = JSON.stringify(body);

    var config = {
        method: 'post',
        url: url,
        headers: {
            'x-api-key': api,
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

router.post('/getReports', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/?limit=100`;
    let api = process.env.API_KEY;

    var config = {
        method: 'get',
        url: url,
        headers: {
            'x-api-key': api,
            "Content-Type": 'application/json'
        }
    };

    axios(config)
        .then(function (response) {
            if (body.getshared) {
                let org = body.system_user_id ? body.system_user_id.split('@')[1] : '';
                
                response.data.Items = response.data.Items.filter(r => {
                    let report_org = r.system_user_id ? r.system_user_id.split('@')[1] : '';
                    return r.shared && r.system_user_id && (org == report_org);
                });
            }

            if (body.system_user_id && !body.getshared) {
                response.data.Items = response.data.Items.filter(r => (r.system_user_id == body.system_user_id) || !r.system_user_id);
            }

            getUsersPlansOrganizations();
            let user = users.filter(u => u.email == body.system_user_id)[0];

            // Filter Plan
            if (body.system_user_id && user.organization.planid) {
                let plan = plans.filter(p => p.id == user.organization.planid)[0];
                response.data.Items = response.data.Items.filter(r => {
                    return r.system_user_id || plan.pages_access.includes(r.name);
                })
            }
            return res.send(response.data)
        })
        .catch(function (error) {
            res.status(500).send(error)
        });
})

router.post('/createReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/?limit=100`;
    let api = process.env.API_KEY;

    let data = JSON.stringify(body.qbody);

    var config = {
        method: 'post',
        url: url,
        headers: {
            'x-api-key': api,
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

router.post('/cloneReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/${body.pageid}/clone`;
    let api = process.env.API_KEY;

    let data = JSON.stringify(body.qbody);

    var config = {
        method: 'post',
        url: url,
        headers: {
            'x-api-key': api,
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

router.post('/getReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/${body.pageid}`;
    let api = process.env.API_KEY;


    var config = {
        method: 'get',
        url: url,
        headers: {
            'x-api-key': api,
            "Content-Type": 'application/json'
        }
    };

    axios(config)
        .then(function (response) {
            return res.send(response.data)
        })
        .catch(function (error) {
            res.status(500).send(error.response.data)
        });
})

router.post('/compareReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/${body.pageid}/compare`;
    let api = process.env.API_KEY;
    let data = JSON.stringify(body.qbody);

    var config = {
        method: 'post',
        url: url,
        headers: {
            'x-api-key': api,
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

router.put('/updateReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/${body.pageid}`;
    let api = process.env.API_KEY;
    let data = JSON.stringify(body.qbody);

    var config = {
        method: 'put',
        url: url,
        headers: {
            'x-api-key': api,
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

router.post('/datasetLookup', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v4/user/${body.userid}/app/${body.appid}/qollect/dataset/all`;
    let api = process.env.API_KEY;

    const filter_body = {
        "limit": 1,
        "filters": [
            {
                "filterType": "CONTAINS",
                "column": "search",
                "value": body.datasetname.toLowerCase()
            }
        ],
        "warning": false
    };

    let data = JSON.stringify(filter_body);

    var config = {
        method: 'post',
        url: url,
        headers: {
            'x-api-key': api,
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

router.post('/deleteReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/${body.pageid}`;
    let api = process.env.API_KEY;

    var config = {
        method: 'delete',
        url: url,
        headers: {
            'x-api-key': api,
            "Content-Type": 'application/json'
        }
    };

    axios(config)
        .then(function (response) {
            return res.send(response.data)
        })
        .catch(function (error) {
            res.status(500).send(error.response.data)
        });
})

module.exports = router;
