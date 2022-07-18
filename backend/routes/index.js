var express = require('express');
var router = express.Router();
const axios = require('axios');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

// Generate Token for login with cookies
router.post('/api/cookieToken', (req, res, next) => {
    var { body } = req;

    let data = {
        userid: body.userid,
        expirationTime: "2s"
    }


    var config = {
        method: 'post',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/generateToken`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Generate token to embed widgets with security token
router.post('/api/securityToken', (req, res, next) => {

    let { body } = req;
    let url = `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/core/login/token`;
    let api = body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY;
    delete body.custom_config;
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


// SURVEYS
router.post('/api/surveys', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body.filter)

    var config = {
        method: 'post',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/dataset-dashboard`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

//Create Wenform
router.post('/api/surveys/create', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body.webform)

    var config = {
        method: 'post',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
            "Content-Type": 'application/json'
        },
        data: data
    };

    if (!body.webform.default_questions) {
        axios(config)
        .then(async function (response) {
            return res.send(response.data)
        })
        .catch(function (error) {
            console.log(error)
            res.status(500).send(error.response.data)
        });
    }else{
        axios(config)
        .then(async function (response) {
            let webform;
            return await createQuestions(body.custom_config, response.data.qrveyid, "userid", async (r) => {
                return await createQuestions(body.custom_config, response.data.qrveyid, "email", async (r) => {
                    return await createQuestions(body.custom_config, response.data.qrveyid, "name", async () => {
                        webform = await getWebform(body.custom_config, response.data.qrveyid);
                        return res.send(await updateWebform(body.custom_config, webform));
                    });
                });
            });
        })
        .catch(function (error) {
            console.log(error)
            res.status(500).send(error.response.data)
        });
    }
    
})

async function createQuestions(custom_config, webformid, field, callback) {
    const q = {
        "answers": [
            {
                "answer": "TEXTFIELD"
            }
        ],
        "id": `${webformid}__${field}`,
        "text": `${field}`,
        "type": "TEXTFIELD",
        "question": "main",
        "maxChar": 120,
        "textAnalysis": false,
        "incomplete": false,
        "questionIndex": 1,
        "defaultQuestion": true,
        "visibility": "hidden"
    }

    let data = JSON.stringify(q)

    var config = {
        method: 'post',
        url: `${custom_config != null ? custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${custom_config != null ? custom_config.USER_ID : process.env.USER_ID}/app/${custom_config != null ? custom_config.APP_ID : process.env.APP_ID}/qrvey/${webformid}/question`,
        headers: {
            'x-api-key': custom_config != null ? custom_config.API_KEY : process.env.API_KEY,
            "Content-Type": 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            callback(response.data);
        })
        .catch(function (error) {
            callback({ status: 'error', error });
        });
}

async function getWebform(custom_config, webformid) {

    var config = {
        method: 'get',
        url: `${custom_config != null ? custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${custom_config != null ? custom_config.USER_ID : process.env.USER_ID}/app/${custom_config != null ? custom_config.APP_ID : process.env.APP_ID}/qrvey/${webformid}`,
        headers: {
            'x-api-key': custom_config != null ? custom_config.API_KEY : process.env.API_KEY,
            "Content-Type": 'application/json'
        }
    };

    return axios(config)
        .then(function (response) {
            // updateWebform(response.data);
            return response.data;
        })
        .catch(function (error) {
            return error;
        });
}

async function updateWebform(custom_config, webform) {
    webform["questionOrder"] = [`${webform.qrveyid}__userid`, `${webform.qrveyid}__email`, `${webform.qrveyid}__name`];
    let data = JSON.stringify(webform);
    var config = {
        method: 'put',
        url: `${custom_config != null ? custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${custom_config != null ? custom_config.USER_ID : process.env.USER_ID}/app/${custom_config != null ? custom_config.APP_ID : process.env.APP_ID}/qrvey/${webform.qrveyid}`,
        headers: {
            'x-api-key': custom_config != null ? custom_config.API_KEY : process.env.API_KEY,
            "Content-Type": 'application/json'
        },
        data: data
    };

    return axios(config)
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return error.response.data
        });
}

// Get Webform
router.post('/api/surveys/:surveyid', (req, res, next) => {
    let { body } = req;
    var config = {
        method: 'get',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Update Webform
router.put('/api/surveys/:surveyid', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body)

    var config = {
        method: 'put',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Delete Webform
router.delete('/api/suveys/delete/:surveyid', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body)

    var config = {
        method: 'delete',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Create Webform Question
router.post('/api/surveys/:surveyid/question/create', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body)

    var config = {
        method: 'post',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}/question`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Change webform Status
router.put('/api/surveys/status/:surveyid/:status', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body)

    var config = {
        method: 'put',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}/${req.params.status}`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Send wenform to list of emails
router.post('/api/suveys/send/:surveyid', (req, res, next) => {

    let { body } = req

    let data = JSON.stringify(body)

    var config = {
        method: 'post',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}/send`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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

// Get QrveyLookup
router.post('/api/surveys/lookup/:surveyid', (req, res, next) => {
    let { body } = req

    var config = {
        method: 'get',
        url: `${body.custom_config != null ? body.custom_config.BASE_PATH : process.env.BASE_PATH}/devapi/v4/user/${body.custom_config != null ? body.custom_config.USER_ID : process.env.USER_ID}/app/${body.custom_config != null ? body.custom_config.APP_ID : process.env.APP_ID}/qrvey/${req.params.surveyid}/lookup`,
        headers: {
            'x-api-key': body.custom_config != null ? body.custom_config.API_KEY : process.env.API_KEY,
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
