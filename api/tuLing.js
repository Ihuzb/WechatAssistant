const axios = require('axios');

module.exports = function (text='') {
    return new Promise((re, rj) => {
        axios.post('http://openapi.tuling123.com/openapi/api/v2', {
            "reqType": 0,
            "perception": {
                "inputText": {
                    "text": text
                },
            },
            "userInfo": {
                "apiKey": "841b58af8dce46828279c9e73dc68a41",
                "userId": "DiTing"
            }
        }).then((res) => {
            let info = res.data.results
            re(info)
        }).catch((error) => {
            console.error(error)
        });
    })
}