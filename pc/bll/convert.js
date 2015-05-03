module.exports = {
    toBool: function(val){
        //can not use "!!" to convert!

        if(val == "true" || val === true){
            return true;
        }

        return false;
    }
};
