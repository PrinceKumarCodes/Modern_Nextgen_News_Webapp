var cardsContainer = document.getElementById("cards-container");
var newsTitle = document.getElementById("news-title");
var newsSource = document.getElementById("news-source");
var newsDesc = document.getElementById("news-desc");

//  API Key and Base URL
const API_KEY = "c5dd68b66f2e40e9ad985c2a105c9660";
const url = "https://newsapi.org/v2/everything?q=";

// Proxy URL (to solve CORS issue)
const PROXY_URL = "https://api.allorigins.win/get?url=";

// Load default news (India) on page load
window.addEventListener("load", () => fetchNews("india"));

// Reload the entire page
function reload() {
  window.location.reload();
}

// Toggle Dark/Light Theme
var themeIcon = document.getElementById("sun-icon");
themeIcon.onclick = function () {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    themeIcon.src = "/Image/sun-48.png";
  } else {
    themeIcon.src = "/Image/sun-50.png";
  }
};

// Fetch News with Proxy
async function fetchNews(query) {
  try {
    const finalUrl = `${url}${query}&apikey=${API_KEY}`;
    const proxyUrl = PROXY_URL + encodeURIComponent(finalUrl);

    const res = await fetch(proxyUrl);
    const data = await res.json();

    // Proxy wraps response in "contents", so we need to parse it
    const parsedData = JSON.parse(data.contents);

    console.log(parsedData);
    bindData(parsedData.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    alert("Unable to load news. Please try again later");
  }
}

// Bind news articles to the cards
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);

    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Fill data inside each news card
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-image");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} 🪙  ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "__blank");
  });
}

// Navigation and Search Functionality
let curSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// Search button click
searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
// Search on "Enter" key press
searchText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
  }
});
