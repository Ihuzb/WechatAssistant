const {Wechaty} = require('wechaty');
const tuLing = require('./api/tuLing');

const name = 'wechat-puppet-wechat';
let bot = '';
bot = new Wechaty({
    name, // generate xxxx.memory-card.json and save login data for the next login
});
// let roomId = '@@48f2bb76660835b634b810362e608683bdfc781dd9dd04688206e7d5924971d9'
let roomId = '@@ab17a0c49c9b1459244e5f4db327b0a3dacbb7ab5b23e8fdd092507ce1746bc2'
let fromId = '@4e1f2ce30361811bde1d5ca485cc491b'
let fromUserId = '@e3a71f977cdd53c856c11f3070c24304807bf234548221866a05cb3e62a17b8f'

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
    console.log(`[${room ? room.payload.topic : ''}]:${from.payload.name}:${text.substr(0,50)}`)
    if (room != null && room.id == roomId && from.id != fromId) {
        let [info] = await getInfo(text);
        let texts = info.resultType == 'text' ? info.values.text : '你猜我知不知道'
        await room.say(texts)
    // } else if (room == null && from.id == fromUserId && from.id != fromId) {
    //     let [info] = await getInfo(text);
    //     let texts = info.resultType == 'text' ? info.values.text : '你猜我知不知道'
    //     await from.say(texts)
    }
})
