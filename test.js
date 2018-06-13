document.getElementById("checkImages").addEventListener('click', () => {
  console.log("Popup DOM fully loaded and parsed");
  function modifyDOM() {
    function parseImages(images) {
      let hasBlurryImages = false;
      images.forEach(function (image) {
        let renderedImageWidth = image.clientWidth;
        let renderedImageHeight = image.clientHeight;
        let renderedImageRatio = image.clientWidth/ image.clientHeight;
        // Check if the image is visible
        if(renderedImageRatio) {
          image.classList.remove(BLURRY_EXTENSION_IMG);
          originalImage.src = image.src;

          let originalImageWidth = originalImage.clientWidth;
          let originalImageHeight = originalImage.clientHeight;

          if(renderedImageHeight && originalImageWidth && (renderedImageWidth > originalImageWidth || renderedImageHeight > originalImageHeight)) {
            console.log('Blurry image: ');
            console.log('Url: ', originalImage.src);
            console.log(`Original size: ${originalImageWidth}X${originalImageHeight}`);
            console.log(`Rendred size: ${renderedImageWidth}X${renderedImageHeight}\n`);
            image.classList.add(BLURRY_EXTENSION_IMG);
            hasBlurryImages = true;
          }
        }
      });

      return hasBlurryImages;
    }
    const BLURRY_EXTENSION_IMG = 'blurry-extension__img';
    const BLURRY_EXTENSION_ORIGINAL_IMG = 'blurry-extension__original-img';
    const BLURRY_STYLE_IS = 'blurry-style';
    if(!document.querySelector(`#${BLURRY_STYLE_IS}`)) {
      // Append style
      var css = `
            .${BLURRY_EXTENSION_IMG} {outline: 2px solid red;}
            .${BLURRY_EXTENSION_ORIGINAL_IMG} {position: absolute; top: -10000em; left: 0; width:auto !important; height: auto!important;}
    `,
          head = document.head || document.getElementsByTagName('head')[0],
          style = document.createElement('style');

      style.type = 'text/css';
      style.id = BLURRY_STYLE_IS;
      style.appendChild(document.createTextNode(css));

      head.appendChild(style);
    }
    //You can play with your DOM here or check URL against your regex
    let allImages = document.querySelectorAll('img');
    let originalImage = document.createElement('img');
    originalImage.classList.add(BLURRY_EXTENSION_ORIGINAL_IMG);
    document.body.appendChild(originalImage);
    let hasBlurryImages = parseImages(allImages);

    if(!hasBlurryImages) {
      console.log('Alles ok!')
    }


    document.addEventListener("DOMNodeInserted", function(e) {
      if(e.target && e.target.querySelectorAll) {
        let images = e.target.querySelectorAll('img');
        parseImages(images);
      }
    },false);


    return document.body.innerHTML;
  }

  //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
  }, (results) => {
      //Here we have just the innerHTML and not DOM structure
      console.log('Popup script:')
    console.log(results[0]);
  });
});