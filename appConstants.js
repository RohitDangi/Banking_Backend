const deviceType = {
    WEB: "1",
    ANDROID: "2",
    IOS: "3"
};

const transactionTypes = {
    Credit: "Credit",
    Debit: "Debit",
};


const DEFALUT_LIMIT = 10;
const DEFALUT_SKIP = 0;

const loginType = {
    USER: "1",
    ADMIN: "2"
}


  const LOCAL_DATE_FORMAT = "MMMM DD, YYYY";
const LOCAL_DATE_S_FORMAT = "MMM DD, YYYY HH:mm A";
const LOCAL_DATE_TIME_SHORT_FORMAT = "MMM DD, YYYY hh:mm A";
const LOCAL_DATE_SHORT_FORMAT = "MMM DD, YYYY";
const DATE_FORMAT = "YYYY-MM-DD";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";

module.exports = {
    deviceType,
    transactionTypes,
    loginType,
   
    DEFALUT_LIMIT,
    DEFALUT_SKIP,
    LOCAL_DATE_S_FORMAT,
    DATE_FORMAT,
    LOCAL_DATE_FORMAT,
    LOCAL_DATE_SHORT_FORMAT,
    LOCAL_DATE_TIME_SHORT_FORMAT,
    DATE_TIME_FORMAT,
}