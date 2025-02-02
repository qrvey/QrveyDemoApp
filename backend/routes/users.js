var express = require('express');
var router = express.Router();
const axios = require('axios');

var users = [
  {
    id: 0,
    email: "admin@ica.com",
    name: "ICA Admin",
    type: "admin",
    qrvey_info: {
      userid: "iN3xBZfkO",
      appid: "vt1gmR0cH"
    },
    organization: {
      hexcolor: "#2E5DF4"
    }
  },
  {
    id: 1,
    email: "composer@avstores.com",
    name: "AVStoresCo Composer",
    organization: {
      name: "AV Stores, Co.",
      id: 187,
      planid: 1,
      hexcolor: "#BE1E2D",
      logo: "AVStores.svg",
      logowidth: 146
    },
    type: "composer",
    qrvey_info: {
      userid: "vc1xpuGjz",
      appid: "7QPNzup4O"
    }
  },
  {
    id: 7,
    email: "composer2@avstores.com",
    name: "AVStoresCo Composer2",
    organization: {
      name: "AV Stores, Co.",
      id: 187,
      planid: 1,
      hexcolor: "#BE1E2D",
      logo: "AVStores.svg",
      logowidth: 146
    },
    type: "composer",
    qrvey_info: {
      userid: "vc1xpuGjz",
      appid: "7QPNzup4O"
    }
  },
  {
    id: 2,
    email: "viewer@avstores.com",
    name: "AVStoresCo Viewer",
    organization: {
      name: "AV Stores, Co.",
      id: 187,
      planid: 1,
      hexcolor: "#BE1E2D",
      logo: "AVStores.svg",
      logowidth: 146
    },
    type: "viewer",
    qrvey_info: {
      userid: "vc1xpuGjz",
      appid: "7QPNzup4O"
    }
  },
  {
    id: 3,
    email: "composer@clovercollections.com",
    name: "CloverCollections Composer",
    organization: {
      name: "Clover Collections, Co.",
      id: 189,
      planid: 2,
      hexcolor: "#22B573",
      logo: "CloverCollection.svg",
      logowidth: 126
    },
    type: "composer",
    qrvey_info: {
      userid: "K5aX7Ykvh",
      appid: "hvrMRg551"
    }
  },
  {
    id: 8,
    email: "composer2@clovercollections.com",
    name: "CloverCollections Composer2",
    organization: {
      name: "Clover Collections, Co.",
      id: 189,
      planid: 2,
      hexcolor: "#22B573",
      logo: "CloverCollection.svg",
      logowidth: 126
    },
    type: "composer",
    qrvey_info: {
      userid: "K5aX7Ykvh",
      appid: "hvrMRg551"
    }
  },
  {
    id: 4,
    email: "viewer@clovercollections.com",
    name: "CloverCollections Viewer",
    organization: {
      name: "Clover Collections, Co.",
      id: 189,
      planid: 2,
      hexcolor: "#22B573",
      logo: "CloverCollection.svg",
      logowidth: 126
    },
    type: "viewer",
    qrvey_info: {
      userid: "K5aX7Ykvh",
      appid: "hvrMRg551"
    }
  },
  {
    id: 5,
    email: "composer@volvomodelsreplicas.com",
    name: "VolvoModelReplicas Composer",
    organization: {
      name: "Volvo Model Replicas, Co",
      id: 144,
      planid: 3,
      hexcolor: "#254083",
      logo: "VolvoModelReplicas.svg",
      logowidth: 88
    },
    type: "composer",
    qrvey_info: {
      userid: "oYDACWI0C",
      appid: "9ouUXHfDK"
    }
  },
  {
    id: 9,
    email: "composer2@volvomodelsreplicas.com",
    name: "VolvoModelReplicas Composer2",
    organization: {
      name: "Volvo Model Replicas, Co",
      id: 144,
      planid: 3,
      hexcolor: "#254083",
      logo: "VolvoModelReplicas.svg",
      logowidth: 88
    },
    type: "composer",
    qrvey_info: {
      userid: "oYDACWI0C",
      appid: "9ouUXHfDK"
    }
  },
  {
    id: 6,
    email: "viewer@volvomodelsreplicas.com",
    name: "VolvoModelReplicas Viewer",
    organization: {
      name: "Volvo Model Replicas, Co",
      id: 144,
      planid: 3,
      hexcolor: "#254083",
      logo: "VolvoModelReplicas.svg",
      logowidth: 88
    },
    type: "viewer",
    qrvey_info: {
      userid: "oYDACWI0C",
      appid: "9ouUXHfDK"
    }
  }
];

var organizations = [
  {
    name: "AV Stores, Co.",
    id: 187,
    planid: 1,
    hexcolor: "#BE1E2D",
    logo: "AVStores.svg"
  },
  {
    name: "Clover Collections, Co.",
    id: 189,
    planid: 2,
    hexcolor: "#22B573",
    logo: "CloverCollection.svg"
  },
  {
    name: "Volvo Model Replicas, Co",
    id: 144,
    planid: 3,
    hexcolor: "#254083",
    logo: "VolvoModelReplicas.svg"
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
  return res.send(org)
})

module.exports = router;