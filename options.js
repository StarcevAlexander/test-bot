module.exports = {
    gameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'фото', callback_data: '1' }, { text: 'видео', callback_data: '2' },],
                [{ text: 'эксклюзив', callback_data: '3' }],
                [{ text: 'техподдержка', callback_data: '4' }],
            ]
        })
    },

    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'В начало', callback_data: '/start' }],
            ]
        })
    }
}
