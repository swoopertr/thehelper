var news = {
    init: function(prms){
        console.log('news js file is loaded');
        if(Object.keys(prms).length){
            console.log(JSON.stringify(prms) +" comes from the parameter");
        }
    }
};
