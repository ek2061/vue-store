const CryptoJS = require("crypto-js");
// const secretKey = "ThisIsMyKey";
const secretKey = process.env.VUE_APP_SECRETKEY;

module.exports = {
    // 加密啦
    doDESencrypt: function(word) {
        const afterEncrypt = CryptoJS.DES.encrypt(word, CryptoJS.enc.Utf8.parse(secretKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
        // console.log(afterEncrypt);//8/nZ2vZXxOzPhU7ZHBwz7w==
        return afterEncrypt;
    },
    // 解密啦
    doDESDecrypt: function(word) {
        const afterDecrypt = CryptoJS.DES.decrypt(word, CryptoJS.enc.Utf8.parse(secretKey), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        // console.log(afterDecrypt);//encryptCode
        return afterDecrypt;
    }
}