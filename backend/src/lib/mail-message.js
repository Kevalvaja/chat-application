export const WelcomeMessage = (userName, userEmail) => {
    return `
        <html>
            <body>
                <div>👋 Welcome to ${process.env.APPLICATION_NAME}, ${userName} (${userEmail})!</div>
                <div>We're thrilled to have you on board! 🌟 Connect with friends, meet new people, and enjoy seamless conversations anytime, anywhere.</div>
                <div>Dive in and make every chat memorable. Happy chatting! 💬✨</div>
            </body>
        </html>
    `;
}

export const FriendRequestMessage = (userName, userEmail) => {
    return `
        <html>
            <body>
                <div>🔔 ${userName} (${userEmail}) has sent you a friend request!</div>
                <div>Accept the request to connect and start chatting.</div>
                <div>Once accepted, the sender will be added to your contacts for seamless communication. 🤝💬</div>
            </body>
        </html>
    `;
}

export const ForgetPasswordMessage = () => {
    const number = Math.floor(1000 + Math.random() * 9000);
    const message = `
        <html>
            <body>
                <div>🛡️ Password Reset Request:</div>
                <div>To reset your password, enter the following <span>OTP: [${number}]</span>.</div> 
                <div>This code is valid for 10 minutes.</div>
                <div>If you didn’t request this, please ignore this message and keep your account secure.</div>
            </body>
        </html>`;
    return { message, number }
}