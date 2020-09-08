function init(){

  document.querySelector("#file-upload-icon-btn").addEventListener("click", function(){
    document.querySelector('input[type="file"]').click();
  });


  document.getElementById("filter-list").addEventListener("click", function(event){
    originalImage.hidden = true;
    filteredImage.hidden = false;

    context = filteredImage.getContext('2d');
    filteredImage.width = originalImage.width;
    filteredImage.height = originalImage.height;

    context.drawImage(originalImage, 0, 0);

    var filterName = event.target.getAttribute("filter-name");
    var imageData = Filter[filterName](context);

    context.putImageData(imageData, 0, 0);
  });
}
init();

function readFile(input){
  if(input.files && input.files[0]){
    var fileReader = new FileReader();
    fileReader.onload = function(event){
      document.getElementById("loaded-image").setAttribute("src", event.target.result);
      originalImage.hidden = false;
      filteredImage.hidden = true;
    };
    fileReader.readAsDataURL(input.files[0]);
  }
}

var originalImage = document.getElementById("loaded-image");
var filteredImage = document.getElementById("filtered-image");

filteredImage.hidden = true;





var Filter = {
  'FilterOne': function(context){

    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageArray = imageData.data;

    for(var i = 0, n = imageArray.length; i < n; i+=4){
      imageArray[i] = imageArray[i];
      imageArray[i+1] = imageArray[i];
      imageArray[i+2] = imageArray[i];
      imageArray[i+3] = imageArray[i];
    }
    return imageData;
  },
  'FilterTwo': function(context){
    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageArray = imageData.data;

    for(var i = 0, n = imageArray.length; i < n; i+=4){
      imageArray[i] = imageArray[i];
      imageArray[i+1] = 255;
      imageArray[i+2] = 255;
      imageArray[i+3] = imageArray[i];
    }
    return imageData;
  },
  'neon-filter': function(context){
    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);

     var vertical = Filter.convolute(Filter.greyScale(context),
                    [ -1, 0, 1,
                      -2, 0, 2,
                      -1, 0, 1 ]);
     var horizontal = Filter.convolute(Filter.greyScale(context),
                  [ -1, -2, -1,
                     0,  0,  0,
                     1,  2,  1 ]);


    for (var i=0; i<imageData.data.length; i+=4) {
        // make the vertical gradient red
        var v = Math.abs(vertical.data[i]);
        imageData.data[i] = v;
        // make the horizontal gradient green
        var h = Math.abs(horizontal.data[i]);
        imageData.data[i+1] = h;
        // and mix in some blue for aesthetics
        imageData.data[i+2] = (v+h)/4;
        imageData.data[i+3] = 255; // opaque alpha
      }
      return imageData;
  },
  'outline-filter': function(context){
    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageData2 = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageArray = imageData.data;

     var vertical = Filter.convolute(Filter.greyScale(context),
                    [ -1, 0, 1,
                      -2, 0, 2,
                      -1, 0, 1 ]);
     var horizontal = Filter.convolute(Filter.greyScale(context),
                  [ -1, -2, -1,
                     0,  0,  0,
                     1,  2,  1 ]);


    for (var i=0; i<imageData2.data.length; i+=4) {
        // make the vertical gradient red
        var v = Math.abs(vertical.data[i]);
        imageData2.data[i] = v;
        // make the horizontal gradient green
        var h = Math.abs(horizontal.data[i]);
        imageData2.data[i+1] = h;
        // and mix in some blue for aesthetics
        imageData2.data[i+2] = (v+h)/4;
        imageData2.data[i+3] = 150; // opaque alpha
      }

    for(var i = 0, n = imageArray.length; i < n; i+=4){
      imageArray[i] = (imageArray[i]+imageData2.data[i])/2;
      imageArray[i+1] = (imageArray[i+1]+imageData2.data[i+1])/2;
      imageArray[i+2] = (imageArray[i+2]+imageData2.data[i+2])/2;
      //imageArray[i+3] = imageData2.data[i+3];
    }
    return imageData;
  },
  convolute: function(data, weights, opaque){
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side/2);
    var src = data.data.slice();
    var sw = data.width;
    var sh = data.height;
    var w = sw;
    var h = sh;
    var dst = data.data;
    var alphaFac = opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
      for (var x=0; x<w; x++) {
        var sy = y;
        var sx = x;
        var dstOff = (y*w+x)*4;
        // calculate the weighed sum of the source image pixels that
        // fall under the convolution matrix
        var r=0, g=0, b=0, a=0;
        for (var cy=0; cy<side; cy++) {
          for (var cx=0; cx<side; cx++) {
            var scy = sy + cy - halfSide;
            var scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              var srcOff = (scy*sw+scx)*4;
              var wt = weights[cy*side+cx];
              r += src[srcOff] * wt;
              g += src[srcOff+1] * wt;
              b += src[srcOff+2] * wt;
              a += src[srcOff+3] * wt;
            }
          }
        }
        dst[dstOff] = r;
        dst[dstOff+1] = g;
        dst[dstOff+2] = b;
        dst[dstOff+3] = a + alphaFac*(255-a);
      }
    }
    return data;
  },
  greyScale: function(context){

    var imageData = context.getImageData(0,0,filteredImage.width, filteredImage.height);
    var imageArray = imageData.data.slice();

    for(var i = 0, n = imageArray.length; i < n; i+=4){
      var r = imageArray[i], g = imageArray[i+1], b = imageArray[i+2];
      var rgb = 0.2126*r + 0.7152*g + 0.0722*b;
      imageArray[i] = imageArray[i+1] = imageArray[i+2] = rgb;
    }

    return imageData;
  }
};
