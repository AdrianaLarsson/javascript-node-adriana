function getNews() {
  //fetching data news
  function fetchingNews() {
    fetch("https://www.di.se/rss")
      .then((response) => response.text())
      .then((response) => {
        convertXmlString(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //convert xml
  function convertXmlString(response) {
    const domParser = new DOMParser();
    const documentXml = domParser.parseFromString(response, "text/xml");
    return getXmlTagNames(documentXml);
  }

  const getConvertSweDate = (pubDateValue) => {
    const sweDate = new Date(pubDateValue).toLocaleDateString("swe");
    const sweTime = new Date(pubDateValue).toLocaleTimeString("swe", {
      date: "4-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const holeDateSwe = `${sweDate} ${sweTime}`;
    return holeDateSwe;
  };

  const sortedArticlesNews = (articlesNews) =>
    articlesNews.sort(
      (a, b) =>
        Date.parse(new Date(b.pubDate)) - Date.parse(new Date(a.pubDate))
    );

  function getXmlTagNames(documentXml) {
    const channels = documentXml.querySelectorAll("channel");
    const items = documentXml.querySelectorAll("item");

    const articlesNews = [];
    let headerNews = {};

    for (const channel of channels) {
      const keyTitle = channel.querySelector("title").tagName;
      const valueTitle = channel.querySelector("title").textContent;
      const keyLink = channel.querySelector("link").tagName;
      const valueLink = channel.querySelector("link").textContent;
      const keyDescription = channel.querySelector("description").tagName;
      const valueDescription = channel.querySelector("description").textContent;

      headerNews = {
        [keyTitle]: valueTitle,
        [keyLink]: valueLink,
        [keyDescription]: valueDescription,
      };
    }

    for (const item of items) {
      //get the titles, link, desc ets by querySelector
      const keyTitle = item.querySelector("title").tagName;
      const valueTitle = item.querySelector("title").textContent;
      const keyLink = item.querySelector("link").tagName;
      const valueLink = item.querySelector("link").textContent;
      const keyDescription = item.querySelector("description").tagName;
      const valueDescription = item.querySelector("description").textContent;
      const pubDateTitle = item.querySelector("pubDate").tagName;
      const pubDateValue = item.querySelector("pubDate").textContent;
      const guidTitle = item.querySelector("guid").tagName;
      const guidValue = item.querySelector("guid").textContent;
      const linkTitle = item.querySelector("link").tagName;
      const linkValue = item.querySelector("link").textContent;
      const dc_creatorValue =
        item.getElementsByTagName("dc:creator")[0]?.textContent;

      const holeDateSwe = getConvertSweDate(pubDateValue);

      articlesNews.push({
        [keyTitle]: valueTitle,
        [keyLink]: valueLink,
        [keyDescription]: valueDescription,
        [pubDateTitle]: pubDateValue,
        [guidTitle]: guidValue,
        [linkTitle]: linkValue,
        ["dc_creator"]: dc_creatorValue,
        ["dateValueSwe"]: holeDateSwe,
      });
    }

    showHederNews(headerNews);
    showArticles(sortedArticlesNews(articlesNews));
  }
  fetchingNews();

  const showHederNews = (headerNews) => {
    document.getElementById("headerNews").innerHTML = headerNews?.title;
  };

  const createdBy = (author) => {
    return author ? `Skapad av ${author}` : "";
  };

  const showArticles = (articlesNews) => {
    var mainContainer = document.getElementById("articles");
    for (let index = 0; index < articlesNews.length; index++) {
      if (index >= 0 && index <= 10) {
        var div = document.createElement("div");
        div.innerHTML = `
            <article id="card" class="card">
              <a href="${articlesNews[index].link}">
                <div class="card-content">
                  <h2 id="card-title">
                  ${articlesNews[index].title}
                  </h2>
                  <p>${articlesNews[index].description}</p>
  
                     <div class"createdBy">  ${createdBy(
                       articlesNews[index]["dc_creator"]
                     )}</div>
                     <p> Publicerad: ${articlesNews[index].dateValueSwe}</p>
                </div>    
              </a>
            </article>
     `;
      }

      mainContainer.appendChild(div);
    }
  };
}

getNews();
