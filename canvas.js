const CONTEXT_2D = '2d';
if(helper){
    //ok
}else{
    window.helper={};
}

//canvas context is 2D;
helper.Canvas2D = {
    getCanvas:function (selector) {
        const canvas = document.querySelector(selector);
        return canvas;
    },
    getContext : function(canvas){
        return canvas.getContext(CONTEXT_2D);
    },
    setSize : function(canvas, height, width){
        canvas.height = height;
        canvas.width = width;
    },
    draw: function(canvas){
        //get context 
        const ctx = helper.Canvas2D.getContext(canvas);
        ctx.fillStyle = "rgb(255 0 255 / 75%)";
        ctx.fillRect(25, 100, 175, 50);
    }
};