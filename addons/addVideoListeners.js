"use strict";

(Array.from(document.getElementsByClassName('vineThumbnails'))).forEach( (vineProfile, index) => {
  let xhr = new XMLHttpRequest();
  let image = vineProfile.getElementsByClassName('thumbnailImage')[0];
  let video = vineProfile.getElementsByClassName('thumbnailVideo')[0];

  image.width = 600;
  image.height = 600;

  xhr.onreadystatechange = (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      try {
        let response = JSON.parse(xhr.responseText).data.records[0].videoDashUrl;

        if (response !== null) {
          video.setAttribute('src', response);
          video.load();

          vineProfile.addEventListener('mouseover', () => {
            video.play();
          });

          vineProfile.addEventListener('mouseleave', () => {
            video.pause();
          });
        }
      }
      catch (err) {

      }
      finally {
        video.setAttribute('width', 600);
        video.setAttribute('height', 600);
      }
    }
  };

  xhr.open('GET', `https://api.vineapp.com/timelines/users/${video.getAttribute('apiLink')}`, true);
  xhr.send();
});
