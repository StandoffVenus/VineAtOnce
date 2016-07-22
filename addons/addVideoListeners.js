"use strict";

Array.from(document.getElementsByClassName('thumbnailVideo')).forEach( (video) => {
  let xhr = new XMLHttpRequest();

  xhr.onreadystatechange = (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      try {
        let response = JSON.parse(xhr.responseText).data.records[0].videoDashUrl;

        if (response !== null) {
          video.setAttribute('src', response);
          video.load();

          video.addEventListener('mouseover', () => {
            video.play();
          });

          video.addEventListener('mouseleave', () => {
            video.pause();
          });
        }
      }
      catch (exception) {
        video.setAttribute('src', 'hi.png')
      }
    }
  };

  xhr.open('GET', `https://api.vineapp.com/timelines/users/${video.getAttribute('apiLink')}`, true);
  xhr.send();
});
