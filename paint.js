(function () {
  if (location.search.indexOf("preview") !== -1) return;
  document.documentElement.classList.add("paint");

  const exit = document.createElement("a");
  exit.className = "exit";
  exit.href = "../gallery.html";
  exit.textContent = "X";
  exit.setAttribute("aria-label", "Back to gallery");
  document.body.appendChild(exit);
})();
