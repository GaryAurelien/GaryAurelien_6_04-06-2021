const resizeOptimizeImages = require("resize-optimize-images");


const resizeImages = async (url)=>{
    
    const options = {
        images: [ url ],
        width: 300,
        height: 300,
        quality: 90
    };
 
    await resizeOptimizeImages(options);
}

module.exports  = resizeImages;
