var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// Generate token to embed widgets with security token
router.post('/api/generateJwt', (req, res, next) => {

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

router.post('/api/getReports', (req, res, next) => {
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
            if(body.getshared){
                let org = body.system_user_id ? body.system_user_id.split('@')[1] : '';
                console.log(org);
                response.data.Items = response.data.Items.filter( r => {
                    let report_org = r.system_user_id ? r.system_user_id.split('@')[1] : '';
                    console.log(report_org);
                    return r.shared && (r.system_user_id != body.system_user_id) && (org == report_org);
                });
            }

            if(body.system_user_id && !body.getshared){
                response.data.Items = response.data.Items.filter( r => r.system_user_id == body.system_user_id ||!r.system_user_id);
            }

            return res.send(response.data)
        })
        .catch(function (error) {
            res.status(500).send(error)
        });
})

router.post('/api/createReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/?limit=100`;
    let api = process.env.API_KEY;

    // let GENERATE_BODY = {
    //     "name": body.name,
    //     "description": "",
    //     "private": false,
    //     "published": false,
    //     "active": false,
    //     "editing": true,
    //     "system_user_id": body.userid //Custom prop
    // };

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

router.post('/api/cloneReport', (req, res, next) => {
    let { body } = req;
    let url = `${process.env.BASE_PATH}/devapi/v3/user/${body.userid}/app/${body.appid}/builder/page/${body.pageid}/clone`;
    let api = process.env.API_KEY;

    // let GENERATE_BODY = {
    //     "name": body.name,
    //     "description": "",
    //     "private": false,
    //     "published": false,
    //     "active": false,
    //     "editing": true,
    //     "system_user_id": body.userid //Custom prop
    // };

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

router.post('/api/getReport', (req, res, next) => {
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

router.post('/api/compareReport', (req, res, next) => {
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

router.put('/api/updateReport', (req, res, next) => {
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

router.post('/api/datasetLookup', (req, res, next) => {
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

router.post('/api/deleteReport', (req, res, next) => {
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
