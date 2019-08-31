let LANG = "en";

const tr = function(message, context=null) {
    if (window[LANG] !== undefined && typeof window[LANG] === "object") {
        if (context === null && message in window[LANG] && window[LANG][message] !== "") {
            return window[LANG][message]
        } else if (message + "|||" + context in window[LANG] && window[LANG][message + "|||" + context] !== "") {
            return window[LANG][message + "|||" + context]
        }
    }
    return message;
};