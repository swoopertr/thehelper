const CONTEXT_2D = '2d';
const CONTEXT_WEBGL = 'webgl';
const EXPERIMENTAL_WEBGL = 'experimental-webgl';
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
    drawLine: function(canvas, x1, y1, x2, y2, color,lineWidth=3) {
        //get context 
        let ctx = helper.Canvas2D.getContext(canvas);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    },
    drawRectange: function(canvas, x1, y1, x2, y2, color){
        const ctx = helper.Canvas2D.getContext(canvas);
        ctx.fillStyle = color;
        ctx.fillRect(x1, y1, x2, y2);
    },
    pointToPointBeizerCurve: function(canvas, x1, y1, x2, y2, color, lineWidth=3){
        let ctx = helper.Canvas2D.getContext(canvas);
        
        ctx.moveTo(x1,y1);
        ctx.bezierCurveTo(50,90,159,-30, x2,y2);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
};

//canvas context is 3D;
helper.Canvas3D = {
    getCanvas:function (selector) {
        const canvas = document.querySelector(selector);
        return canvas;
    },
    getContext : function(canvas){
        return canvas.getContext(CONTEXT_3D);
    },
    initializeWebGL : function() {
        var webgl = canvas.getContext(CONTEXT_WEBGL) 
            || canvas.getContext(EXPERIMENTAL_WEBGL);
 
        if (!webgl || !(webgl instanceof WebGLRenderingContext) ) {
            alert('Failed to get WebGL context.');
        } else {
            alert('Great, your browser supports WebGL.');
        }
        return webgl;
    },
    

}