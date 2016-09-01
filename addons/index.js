document.addEventListener("scroll", () => {
  if (window.pageYOffset > 1200) {
    document.getElementById('vineUsernameGroup').style.position = "fixed";
  }
  else {
    document.getElementById('vineUsernameGroup').style.position = "relative";
  }
})
