const axios = require('axios');

module.exports = function (text='') {
    console.log(text)
    return new Promise((re, rj) => {
        axios.post('http://openapi.tuling123.com/openapi/api/v2', {
            "reqType": 0,
            "perception": {
                "inputText": {
                    "text": text
                },
            },
            "userInfo": {
                "apiKey": "5ad74a10472f4fc3b4516d7f4f3bfb01",
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