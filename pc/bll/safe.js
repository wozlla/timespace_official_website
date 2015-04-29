module.exports = (function(){
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHTML(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function removeHtmlLabel(string){
        var htmlStr = [
            "&quot;","&amp;","&lt;","&nbsp;", "&gt;", "&#39", "&#x2F"
        ].join("|");

        return String(string).replace(new RegExp("<[^>]+>|<\/[^>]+>|" + htmlStr, "g"), "");
    }

    return {
        escapeHTML:escapeHTML,
        removeHtmlLabel: removeHtmlLabel
    }
}());
