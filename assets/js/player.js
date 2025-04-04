function playYouTubeVideo(container) {
    const videoId = "KFxYzec-od0";
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1`);
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.classList.add("embed-responsive-item");

    container.innerHTML = ""; // Clear the thumbnail
    container.appendChild(iframe);
  }