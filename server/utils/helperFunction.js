import Crypto from 'crypto';
import Config from 'config';
import 'regenerator-runtime/runtime'

const encrypt = (text) => {
    let algorithm = Config.get("cryptoConfig.algorithm"),
        cryptoKey = Config.get("cryptoConfig.key");
    let cipher = Crypto.createCipher(algorithm, cryptoKey)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

const decrypt = (text) => {
    let algorithm = Config.get("cryptoConfig.algorithm"),
        cryptoKey = Config.get("cryptoConfig.key");
    let decipher = Crypto.createDecipher(algorithm, cryptoKey)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return decrypted;
}
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}


module.exports = { 
    encrypt,
    decrypt,
    asyncForEach
}