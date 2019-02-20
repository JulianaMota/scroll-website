"use strick";
const menu = document.getElementById("menu");
const header = document.getElementById("moveheader");

const easingOutQuint = (x, t, b, c, d) =>
  c * ((t = t / d - 1) * t * t * t * t + 1) + b;
const hasNativeSmoothScroll = testSupportsSmoothScroll();
const indicators = document.querySelectorAll(".indicator-btn");
const scroller = document.querySelector(".scroll");

let numSteps = 20.0;
let contactBox;
let prevRatio = 0.0;
let increasingColor = "rgba(22, 38, 61, ratio)";
let decreasingColor = "rgba(190, 40, 40, ratio)";

console.log(easingOutQuint);

// Menu scroll
window.onscroll = function() {
  scrollMenu();
};

function scrollMenu() {
  if (
    document.body.scrollTop > 500 ||
    document.documentElement.scrollTop > 500
  ) {
    menu.style.position = "fixed";
    menu.style.left = "40%";
    header.style.position = "fixed";
    menu.style.paddingTop = "0px";
    header.style.paddingTop = "0px";
    header.style.opacity = "0.5";
    menu.style.opacity = "0.5";

    //header.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
  } else {
    menu.style.position = "relative";
    menu.style.left = "0%";
    header.style.position = "relative";
    header.style.backgroundColor = "transparent";
    menu.style.backgroundColor = "transparent";
    menu.style.paddingTop = "20px";
    header.style.paddingTop = "20px";
    header.style.opacity = "1";
    menu.style.opacity = "1";
  }
}

// scroll functions from "A PEN BY Nolan Lawson" I was trying to understand the code
function smoothScrollPolyfill(node, key, target) {
  console.log(Date.now());
  const startTime = Date.now();
  const offset = node[key];
  const gap = target - offset;
  const duration = 1000;
  let interrupt = false;

  const step = () => {
    const elapsed = Date.now() - startTime;
    const precentage = elapsed / duration;

    if (interrupt) {
      return;
    }
    if (percentage > 1) {
      cleanup();
      return;
    }
    node[ket] = easingOutQuint(0, elapsed, offset, gap, duration);
    requestAnimationFrame(step);
  };
  const cancel = () => {
    interrupt = true;
    cleanup();
  };

  const cleanup = () => {
    node.removeEventListener("wheel", cancel);
    node.removeEventListener("touchstart", cancel);
  };
  node.addEventListener("wheel", cancel, { passive: true });
  node.addEventListener("touchstart", cancel, { passive: true });

  step();

  return cancel;
}

function testSupportsSmoothScroll() {
  let supports = false;
  try {
    let div = document.createElement("div");
    div.scrollTo({
      top: 0,
      get behavior() {
        supports = true;
        return "smooth";
      }
    });
  } catch (err) {}
  return supports;
}

function smoothScroll(node, topOrLeft, horizontal) {
  if (hasNativeSmoothScroll) {
    return node.scrollTo({
      [horizontal ? "left" : "top"]: topOrLeft,
      behavior: "smooth"
    });
  } else {
    return smoothScrollPolyfill(
      node,
      horizontal ? "scrollLeft" : "scrollTop",
      topOrLeft
    );
  }
}

function debounce(func, ms) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func();
    }, ms);
  };
}

function setAriaLabels() {
  indicators.forEach((indicator, i) => {
    indicator.setAttribute("aria-label", `Scroll to item #${i + 1}`);
  });
}
function setAriaPressed(index) {
  indicators.forEach((indicator, i) => {
    indicator.setAttribute("aria-pressed", !!(i === index));
  });
}
indicators.forEach((indicator, i) => {
  indicator.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    setAriaPressed(i);
    const scrollLeft = Math.floor(scroller.scrollWidth * (i / 4));
    smoothScroll(scroller, scrollLeft, true);
  });
});
scroller.addEventListener(
  "scroll",
  debounce(() => {
    let index = Math.round((scroller.scrollLeft / scroller.scrollWidth) * 4);
    setAriaPressed(index);
  }, 200)
);

setAriaLabels();

//change color contact section
window.addEventListener(
  "load",
  function(event) {
    contactBox = document.querySelector("#contact");
    console.log(contactBox);

    createObserver();
  },
  false
);
function createObserver() {
  let observer;
  let options = {
    root: null,
    rootMargin: "0px",
    threshold: buildThresholdList()
  };
  observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(contactBox);
}
function buildThresholdList() {
  let thresholds = [];
  let numSteps = 20;

  for (let counter = 1.0; counter <= numSteps; counter++) {
    let ratio = counter / numSteps;
    console.log(ratio);
    thresholds.push(ratio);
  }
  thresholds.push(0);
  return thresholds;
}
function handleIntersect(entries, observer) {
  console.log(entries);
  entries.forEach(function(entry) {
    console.log(entry);
    if (entry.intersectionRatio > prevRatio) {
      entry.target.style.backgroundColor = increasingColor.replace(
        "ratio",
        entry.intersectionRatio
      );
    } else {
      entry.target.style.backgroundColor = decreasingColor.replace(
        "ratio",
        entry.intersectionRatio
      );
    }

    prevRatio = entry.intersectionRatio;
  });
}
