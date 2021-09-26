const {Wechaty} = require('wechaty');
const tuLing = require('./api/tuLing');
const {boot} = require('./api/paddle');

const name = 'wechat-puppet-wechat';
let bot = '';
bot = new Wechaty({
    name, // generate xxxx.memory-card.json and save login data for the next login
});
// let roomId = '@@48f2bb76660835b634b810362e608683bdfc781dd9dd04688206e7d5924971d9'
let roomId = []
let fromId = []

//  二维码生成
function onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
    const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
    ].join('');
    console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
    console.log(`贴心小助理${user}登录了`);
    // if (config.AUTOREPLY) {
    //     console.log(`已开启机器人自动聊天模式`);
    // }
}

//登出
function onLogout(user) {
    console.log(`小助手${user} 已经登出`);
}


bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot
    .start()
    .then(() => console.log('开始登陆微信'))
    .catch((e) => console.error(e));

bot.on('message', async (message) => {
    const room = message.room()
    const from = message.talker()
    const mentionSelf = await message.mentionSelf()
    // 文字内容
    const text = message.text()
    // console.log(room, 1, from, 2, mentionSelf, 3, text)
    // console.log(`[${room ? room.payload.topic : ''}]:${from.payload.name}:${text.substr(0, 50)}`)
    if (room != null) {
        console.log(`[${room.id}:${room.payload.topic}]:${from.payload.name}:${text.substr(0, 50)}`)
    } else {
        console.log(`[${from.id}]:${from.payload.name}:${text.substr(0, 50)}`)
    }
    if (text == '阿瓦达啃大瓜') {
        if (room == null) {
            fromId.push(from.id);
            await from.say("Avada Kedavra")
        } else if (mentionSelf) {
            roomId.push(room.id);
            await room.say("Avada Kedavra")
        }
    } else if (text == '除你武器') {
        if (room == null) {
            fromId = fromId.filter(v => v != from.id);
            await from.say("Expelliarmus")
        } else if (mentionSelf) {
            roomId = roomId.filter(v => v != room.id);
            await room.say("Expelliarmus")
        }
    } else {
        if (room != null && roomId.includes(room.id) && mentionSelf) {
            let [info] = await boot(text);
            let texts = info || '你猜我知不知道'
            await room.say(texts)
        } else if (room == null && fromId.includes(from.id)) {
            let [info] = await boot(text);
            let texts = info || '你猜我知不知道'
            await from.say(texts)
        }
    }

})
