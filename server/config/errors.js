function errorHTML(errorCode, errorTitle, errorMessage) {
    return `<!DOCTYPE HTML>
    <html>
    <head>
        <meta charset="utf-8">
        <title>${errorTitle}</title>
    </head>
    <body>
        <h2>HTTP ${errorCode} ERROR: ${errorTitle}</h2>
        <p>${errorTitle}</p>
        <p>${errorMessage}</p>
    </body></html>`;
}
function errorJSON(errorCode, errorTitle, errorMessage) {
    return {
        "errorCode": errorCode,
        "errorTitle":errorTitle,
        "errorMessage":errorMessage,
    };
}
module.exports.static = errorHTML("500", "Could Not Find Static Files",
    `Make sure you ran <code>npm install</code> and <code>ng build</code>
    (or <code>npm run-script ng build</code>)
    in the <code>client</code> directory.`);

module.exports.methodNotAllowed = function(prohibitedVerb) {
    return errorJSON("405", "Method Not Allowed",
    `${prohibitedVerb} is not allowed at that URL.`);
}
module.exports.forbidden = errorJSON("403","Forbidden",
    `You do not have the necessary permission to do that.`);
