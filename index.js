const axios = require('./node_modules/axios/dist/node/axios.cjs'); // node
const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '6601477232:AAG41Ryo8ZQ2osPMtqzJsXlFov1Kpmb4okI'
const chat_id = '-4063598750'
const myTgNickname = 'whitefox2000'
const bot = new TelegramApi(token, { polling: true })

//src="https://api.cryptocloud.plus/static/widget/v2/js/app.js"

let invoice_id;
const api_key =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1dWlkIjoiTVRjek5UST0iLCJ0eXBlIjoicHJvamVjdCIsInYiOiIwZjY3YzFhMzc0YTI4NDBhYzNkYjhiYTBmYTJlZDM2MjBkNTFhY2E3ZGNlODMzZjJmODZkODgyYzYwZGM3NzhiIiwiZXhwIjo4ODEwMTI0MTk3OX0.xrbi0U7zPHBajnpYdnYLtUitgWfoIzw5hiROuBETUp0";

const start = async () => {

    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/check', description: 'Проверить счёт' },
        { command: '/pay', description: 'Сделать заказ' },
    ])

    bot.on('message', async msg => {
        function createPayment() {
            const headers = {
                Authorization: "Token " + api_key,
            };
            const payload = {
                shop_id: "N72PF2WZXNrBcJKk",
                amount: 777,
            };

            axios
                .post("https://api.cryptocloud.plus/v1/invoice/create", payload, { headers: headers })
                .then((response) => {
                    // console.log("Pay url: " + response.data.pay_url);
                    // console.log("invoice_id: " + response.data.invoice_id);
                    // console.log("status: " + response.data.status);
                    invoice_id = response.data.invoice_id;
                    bot.sendMessage(chatId, `счёт создан`);
                    bot.sendMessage(chatId, `ссылка для отплаты ${response.data.pay_url}`);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
        function checkPayment() {
            const url = "https://api.cryptocloud.plus/v1/invoice/info";

            const headers = {
                Authorization: "Token " + api_key,
            };

            const params = {
                uuid: invoice_id,
            };

            axios
                .get(url, { headers: headers, params: params })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.status_invoice === "created") {
                        bot.sendMessage(chatId, `счёт создан, но не оплачен`);
                    }
                    if (response.data.status_invoice === "paid") {
                        bot.sendMessage(chatId, `счёт оплачен`);
                    }
                    // status_invoice: 'created'
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }


        const text = msg.text;
        const chatId = msg.chat.id;
        const nick = msg.from.username
        const first_name = msg.from.first_name
        const last_name = msg.from.last_name

        try {
            if (text === '/start') {
                await bot.sendMessage(chatId, `Добро пожаловать ${first_name ? first_name : ''} ${last_name ? last_name : ''}! Чтобы узнать все его возможности нажми кнопку "меню" внизу слева`);
                await bot.sendMessage(chatId, 'Выбери, что именно тебе интересно', gameOptions);
                return 
            }
            if (text === '/check') {
                checkPayment();
                bot.sendMessage(chatId, `Меня зовут Александр, если хочешь продолжить общение нажми @${myTgNickname}`);
                return
            }
            if (text === '/pay') {

                url_api = `https://api.telegram.org/bot${token}/sendMessage`
                let message = 'с тобой хочет связаться пользователь @' + nick + " " + first_name + " " + last_name
                axios.post(url_api, {
                    chat_id: chat_id,
                    parse_mode: 'html',
                    text: message
                })
                bot.sendMessage(chatId, `Ваше сообщение ушло мою группу. Я получу контакт для связи в формате: \n + ${message}`);
                createPayment();
                return
            }
            else {
                return bot.sendMessage(chatId, 'Я тебя не понимаю, выбери команду в меню внизу слева)');
            }
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!'/*  + e.message */);
        }
    })


}
start()

