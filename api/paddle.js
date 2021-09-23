const axios = require('axios');
const {api} = require('../config/index')
const path = require('path');
const QueryLinesReader = require('query-lines-reader');
let headers = {"Content-type": "application/json"}

module.exports = {
    gushi: () => {
        let queryLinesReader = new QueryLinesReader(path.resolve(__dirname, '../files/train.tsv'));
        // 随机行数 max=294598
        let start = Math.floor(Math.random() * 294598);
        queryLinesReader.queryLines({
            start,
            end: start + 4
        }).then(res => {
            let info = res.lineList;
            if (info.length > 1) {
                info = info.map(v => v.replace(/\u0002/g, '').split('\t')[0])
            } else {
                info = info[0].replace(/\u0002|\t/g, '')
                info = info.split(/。/).filter(v => v);
                info = info.slice(0, 2);
            }
            console.log(info)
            let data = {
                'texts': info,
                'use_gpu': false, 'beam_width': 5
            }
            let url = `${api}:8866/predict/ernie_gen_poetry`
            axios.post(url, data, {
                headers
            }).then(res => {
                let info = res.data.results;
                console.log(res.data.results)
            })
        })
    },
    boot: (text) => {
        let url = `${api}:8866/predict/plato-mini`
        return new Promise((re, rs) => {
            axios.post(url, {"data": [[text]]}, {
                headers
            }).then(res => {
                re(res.data.results)
            })
        })
    }
}
