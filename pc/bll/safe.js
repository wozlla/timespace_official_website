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
        return String(string).replace(/<[^>]+>|<\/[^>]+>/g, "");
    }

    return {
        escapeHTML:escapeHTML,
        removeHtmlLabel: removeHtmlLabel
    }
}());
