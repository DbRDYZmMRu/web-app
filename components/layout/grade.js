// grade.js

class Grade {
  constructor(container, img_selector, callback) {
    this.callback = callback || null;
    this.container = container;
    this.image =
      this.container.querySelector(img_selector) ||
      this.container.querySelector("img");
    this.gradientData = [];
    if (!this.image || !this.container) {
      return;
    }
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.imageDimensions = {
      width: 0,
      height: 0,
    };
    this.imageData = [];
    this.readImage();
  }
  
  readImage() {
    this.imageDimensions.width = this.image.width * 0.1;
    this.imageDimensions.height = this.image.height * 0.1;
    this.render();
  }
  
  getImageData() {
    const imageData = this.ctx.getImageData(
      0,
      0,
      this.imageDimensions.width,
      this.imageDimensions.height
    ).data;
    this.imageData = Array.from(imageData);
  }
  
  getChunkedImageData() {
    const perChunk = 4;
    const chunked = this.imageData.reduce((ar, it, i) => {
      const ix = Math.floor(i / perChunk);
      if (!ar[ix]) {
        ar[ix] = [];
      }
      ar[ix].push(it);
      return ar;
    }, []);
    
    return chunked.filter((rgba) =>
      rgba.slice(0, 2).every((val) => val < 250 && val > 0)
    );
  }
  
  getRGBAGradientValues(top) {
    return top
      .map((color, index) =>
        `rgb(${color.rgba.slice(0, 3).join(",")}) ${index === 0 ? "0%" : "100%"}`
      )
      .join(",");
  }
  
  getCSSGradientProperty(top) {
    const prefixes = ["webkit"];
    const top1 = [top[1]];
    const val1 = this.getRGBAGradientValues(top1);
    const val2 = `${val1},rgb(0,0,0) 100%`;
    return prefixes
      .map(
        (prefix) =>
        `background-image: -${prefix}-linear-gradient(180deg,${val2})`
      )
      .concat([`background-image: linear-gradient(180deg,${val2})`])
      .join(";");
  }
  
  getMiddleRGB(start, end) {
    const w = 0.5 * 2 - 1;
    const w1 = (w + 1) / 2.0;
    const w2 = 1 - w1;
    return [
      parseInt(start[0] * w1 + end[0] * w2),
      parseInt(start[1] * w1 + end[1] * w2),
      parseInt(start[2] * w1 + end[2] * w2),
    ];
  }
  
  getSortedValues(uniq) {
    const occurs = Object.keys(uniq)
      .map((key) => {
        const components = key.split("|");
        const brightness =
          (components[0] * 299 + components[1] * 587 + components[2] * 114) / 1000;
        return {
          rgba: components,
          occurs: uniq[key],
          brightness,
        };
      })
      .sort((a, b) => b.occurs - a.occurs)
      .slice(0, 10);
    return occurs.sort((a, b) => b.brightness - a.brightness);
  }
  
  getTextProperty(top) {
    const rgb = this.getMiddleRGB(
      top[0].rgba.slice(0, 3),
      top[1].rgba.slice(0, 3)
    );
    const brightness = Math.round(
      (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) /
      1000
    );
    return brightness > 125 ? "color: #000" : "color: #fff";
  }
  
  getTopValues(uniq) {
    const sorted = this.getSortedValues(uniq);
    return [sorted[0], sorted[sorted.length - 1]];
  }
  
  getUniqValues(chunked) {
    return chunked.reduce((accum, current) => {
      const key = current.join("|");
      accum[key] = (accum[key] || 0) + 1;
      return accum;
    }, {});
  }
  
  renderGradient() {
    const ls = window.localStorage;
    const item_name = `grade-${this.image.getAttribute("src")}`;
    let top = null;
    
    if (ls && ls.getItem(item_name)) {
      top = JSON.parse(ls.getItem(item_name));
    } else {
      const chunked = this.getChunkedImageData();
      top = this.getTopValues(this.getUniqValues(chunked));
      if (ls) {
        ls.setItem(item_name, JSON.stringify(top));
      }
    }
    
    if (this.callback) {
      this.gradientData = top;
      return;
    }
    
    const gradientProperty = this.getCSSGradientProperty(top);
    const textProperty = this.getTextProperty(top);
    const style =
      (this.container.getAttribute("style") || "") +
      "; " +
      gradientProperty +
      "; " +
      textProperty;
    this.container.setAttribute("style", style);
  }
  
  render() {
    this.canvas.width = this.imageDimensions.width;
    this.canvas.height = this.imageDimensions.height;
    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.imageDimensions.width,
      this.imageDimensions.height
    );
    this.getImageData();
    this.renderGradient();
  }
}

// Main Grade function
function initializeGrade(containers, img_selector, callback) {
  const init = (container, img_selector, callback) => {
    const grade = new Grade(container, img_selector, callback);
    const gradientData = grade.gradientData;
    if (!gradientData.length) {
      return null;
    }
    return {
      element: container,
      gradientData,
    };
  };
  
  const results = (NodeList.prototype.isPrototypeOf(containers) ?
    Array.from(containers).map((container) => init(container, img_selector, callback)) :
    [init(containers, img_selector, callback)]
  ).filter(Boolean);
  
  if (results.length && callback) {
    return callback(results);
  }
}

// Initialize event listeners
function setupEventListeners() {
  // Grade initialization on window load
  window.addEventListener("load", () => {
    initializeGrade(document.querySelectorAll(".gradient-wrap"));
  });
  
  // Album container functionality on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    const albumContainers = document.querySelectorAll(".album-container");
    albumContainers.forEach((container) => {
      container.addEventListener("click", () => {
        const trackList = container.querySelector(".track-list");
        trackList.classList.toggle("show");
      });
    });
  });
}

// Run setup immediately for global access
setupEventListeners();

// Export the Grade function as default
export default initializeGrade;