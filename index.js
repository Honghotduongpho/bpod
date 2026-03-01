const login = require("fca-unofficial");
const fs = require("fs");

// Lấy dữ liệu Appstate từ GitHub Secrets (Tên biến phải khớp)
const appStateData = process.env.APPSTATE_SECRET;

if (!appStateData) {
    console.error("Lỗi: Bạn chưa cấu hình APPSTATE_SECRET trong GitHub Secrets!");
    process.exit(1);
}

// Ghi tạm appstate ra file để bot đăng nhập
fs.writeFileSync('appstate.json', appStateData);

login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error("Lỗi đăng nhập! Có thể Appstate đã hết hạn.");

    console.log("Bot đã online và sẵn sàng!");

    api.listenMqtt((err, message) => {
        if(err || !message.body) return;

        const content = message.body.toLowerCase();

        // Chức năng 1: Spam tin nhắn
        // Cú pháp: !spam [nội dung]
        if (content.startsWith("!spam")) {
            const text = message.body.slice(6);
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    api.sendMessage(`[Bot Spam]: ${text}`, message.threadID);
                }, i * 2000); // Cách nhau 2 giây mỗi tin
            }
        }

        // Chức năng 2: Thả icon tự động
        if (content.includes("haha")) {
            api.setMessageReaction("😆", message.messageID, () => {}, true);
        }
        if (content.includes("love") || content.includes("yêu")) {
            api.setMessageReaction("❤️", message.messageID, () => {}, true);
        }
    });
});
