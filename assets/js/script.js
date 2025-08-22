let data = {
  our_album: "Our Albums",
  pre_wedding_title: "Album Pre-Wedding – Cột mốc đẹp giữa Paris",
  pre_wedding_content: `Ngày 3 tháng 4 năm 2025, 
  chúng tôi trở lại Paris để chụp ảnh pre-wedding cho đám cưới.
  Năm 2025 đánh dấu những cột mốc đẹp và ý nghĩa: 10 năm bên nhau, 
  cả hai vợ chồng cùng bước sang tuổi 30, 
  và có Gấu – con trai đầu lòng – lúc này con vừa được 7 tháng tuổi. 
  May mắn có thể lưu giữ lại 
  bằng những khoảnh khắc đáng nhớ giữa thành phố gắn với nhiều kỷ niệm tuổi trẻ này.
  Hai đứa đều học master và Nhân thì làm phd ở đây. 
  Dù khởi đầu cùng nhau vào thời điểm bùng phát dịch COVID-19 năm 2020 
  nên cuộc sống những năm tháng đó cũng không bình thường suôn sẻ 
  nhưng những kỉ niệm tươi đẹp vẫn luôn hiện lên rõ nét trong lòng.
  Mùa xuân hoa anh đào, tulip, thuỷ tiên nở khắp nơi, mùa thu lá vàng, 
  mùa đông có những ngày tuyết rơi ngập đường, những tối đi làm về ngắm tháp Effel lên đèn.
Quay trở lại Paris lần này, không còn là hai người trẻ nữa, mà là một gia đình nhỏ ba người, 
cảm thấy thời gian như khép lại một vòng tròn thật trọn vẹn. 
Bộ ảnh này không chỉ ghi lại hình ảnh, mà còn đánh dấu một hành trình dài
 – của tình yêu, trưởng thành và hạnh phúc.`,
};

let vnData = {
  our_album: "Our Albums",
  pre_wedding_title: "Our Pre-Wedding Album – A Beautiful Milestone in Paris",
  pre_wedding_content: `On April 3rd, 2025, we returned to Paris to capture a very special moment — our own pre-wedding photos.

That day marked a beautiful milestone: 10 years together, both of us turning 30, and our first son, Gấu, reaching 7 months old. The round and meaningful numbers inspired us to preserve this time with heartfelt memories in a city filled with our shared youth.

Paris holds a sweet place in our hearts. At 23, my husband came here to pursue his Master’s degree. In 2020, I joined him for my own studies while he began his PhD. Though the world was going through the COVID-19 pandemic then, we experienced some of the most beautiful years of our lives here.

This time, we returned not as a young couple, but as a family of three. It felt like life had come full circle. This photo session wasn’t just about taking pictures — it was our way of honoring a long journey of love, growth, and joy.`,
};

const toggleButton = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuLinks = mobileMenu.querySelectorAll("a");

toggleButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

const isSmOrSmaller = window.matchMedia("(max-width: 767px)").matches;

const textContent = document.getElementById("textContent");
const readMoreBtn = document.getElementById("readMoreBtn");

function checkOverflow() {
  const isOverflowing = textContent.scrollHeight > textContent.clientHeight;
  readMoreBtn.style.display = isOverflowing ? "block" : "none";
}

let expanded = false;
let maxHeight = "max-h-[30vh]";
let overflowY = "overflow-y-auto";
if (isSmOrSmaller) {
  maxHeight = "max-h-none";
  overflowY = "";
}
readMoreBtn.addEventListener("click", () => {
  expanded = !expanded;
  if (expanded) {
    textContent.classList.remove("overflow-hidden");
    textContent.classList.add(maxHeight);
    readMoreBtn.textContent = "Read less";
    if (overflowY) {
      textContent.classList.add(overflowY);
    }
  } else {
    textContent.classList.add("overflow-hidden");
    textContent.classList.remove(maxHeight);
    readMoreBtn.textContent = "Read more";
    if (overflowY) {
      textContent.classList.remove(overflowY);
    }
    // Scroll to top of the container
    textContent.scrollTop = 0;
  }
});

// Call when DOM is loaded
window.addEventListener("load", checkOverflow);
window.addEventListener("resize", checkOverflow);

// Create link thumbnail from Google Drive
function convertDriveThumbnailLink(id, size = 200) {
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${size}` : null;
}

// Create link preview from Google Drive
function convertDriveLink(id) {
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

// Cal page size for screen size
function calcPageSize(thumbWidth = 240) {
  return Math.floor(window.innerWidth / thumbWidth) + 1;
}

// Get data for 1 page
function getPageImages({ images, page, pageSize }) {
  const start = page * pageSize;
  const end = start + pageSize;
  const pageImages = images.slice(start, end);

  return pageImages.map((id, idx) => ({
    id,
    thumb: convertDriveThumbnailLink(id),
    preview: convertDriveLink(id),
    isDefault: page === 0 && idx === 0,
  }));
}

// === Renderer functions (side effects) ===

// Render 1 page img
function renderPage({ pageImages, galleryEl, previewEl }) {
  pageImages.forEach((imgData) => {
    const img = document.createElement("img");
    img.src = imgData.thumb;
    img.className = "h-40 cursor-pointer hover:opacity-80 transition";
    img.addEventListener("click", () => {
      previewEl.src = imgData.preview;
    });
    galleryEl.appendChild(img);

    if (imgData.isDefault) {
      previewEl.src = imgData.preview;
    }
  });
}

// Update prev/next
function updateButtons({
  galleryEl,
  prevBtn,
  nextBtn,
  currentPage,
  pageSize,
  images,
}) {
  prevBtn.style.display = galleryEl.scrollLeft <= 0 ? "none" : "block";

  const maxScrollLeft = galleryEl.scrollWidth - galleryEl.clientWidth;
  const isAtEnd = galleryEl.scrollLeft + 5 >= maxScrollLeft; // tránh sai số
  const isLastPage = (currentPage + 1) * pageSize >= images.length;

  nextBtn.style.display = isAtEnd && isLastPage ? "none" : "block";
}

// === Controller ===
function initGallery({ galleryId, previewId, prevBtnId, nextBtnId, jsonPath }) {
  const galleryEl = document.getElementById(galleryId);
  const previewEl = document.getElementById(previewId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  let images = [];
  let currentPage = 0;
  let pageSize = calcPageSize() * 2;
  const scrollAmount = 320;

  // Update pageSize khi resize
  window.addEventListener("resize", () => {
    pageSize = calcPageSize();
  });

  // Fetch img list from JSON
  fetch(jsonPath)
    .then((res) => res.json())
    .then((data) => {
      images = data;

      const pageImages = getPageImages({ images, page: 0, pageSize });
      renderPage({ pageImages, galleryEl, previewEl });
      currentPage = 0;
      updateButtons({
        galleryEl,
        prevBtn,
        nextBtn,
        currentPage,
        pageSize,
        images,
      });
    })
    .catch((err) => console.error("Lỗi load JSON:", err));

  // Sự kiện click nút prev
  prevBtn.addEventListener("click", () => {
    galleryEl.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    setTimeout(() => {
      updateButtons({
        galleryEl,
        prevBtn,
        nextBtn,
        currentPage,
        pageSize,
        images,
      });
    }, 500);
  });

  // create click btn next
  nextBtn.addEventListener("click", () => {
    if ((currentPage + 1) * pageSize < images.length) {
      const pageImages = getPageImages({
        images,
        page: currentPage + 1,
        pageSize,
      });
      renderPage({ pageImages, galleryEl, previewEl });
      currentPage++;
    }
    galleryEl.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(() => {
      updateButtons({
        galleryEl,
        prevBtn,
        nextBtn,
        currentPage,
        pageSize,
        images,
      });
    }, 500);
  });

  // When scroll gallery
  galleryEl.addEventListener("scroll", () => {
    updateButtons({
      galleryEl,
      prevBtn,
      nextBtn,
      currentPage,
      pageSize,
      images,
    });
  });
}

// === init Gallery Pre Wed ===
initGallery({
  galleryId: "galleryPreWed",
  previewId: "previewPreWed",
  prevBtnId: "prevBtnPreWed",
  nextBtnId: "nextBtnPreWed",
  jsonPath: "assets/imgIds/imgsPreWed.json",
});

// === initGallery 0208 ===
initGallery({
  galleryId: "gallery0208",
  previewId: "preview0208",
  prevBtnId: "prevBtn0208",
  nextBtnId: "nextBtn0208",
  jsonPath: "assets/imgIds/imgs0208.json",
});

// === initGallery 0308 ===
initGallery({
  galleryId: "gallery0308",
  previewId: "preview0308",
  prevBtnId: "prevBtn0308",
  nextBtnId: "nextBtn0308",
  jsonPath: "assets/imgIds/imgs0308.json",
});

// === initGallery 1008 Morning ===
initGallery({
  galleryId: "gallery1008Morning",
  previewId: "preview1008Morning",
  prevBtnId: "prevBtn1008Morning",
  nextBtnId: "nextBtn1008Morning",
  jsonPath: "assets/imgIds/imgs1008Morning.json",
});

// === initGallery 1008 Night ===
initGallery({
  galleryId: "gallery1008Night",
  previewId: "preview1008Night",
  prevBtnId: "prevBtn1008Night",
  nextBtnId: "nextBtn1008Night",
  jsonPath: "assets/imgIds/imgs1008Night.json",
});
