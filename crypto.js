
const apiKey = process.env.NEWSAPI_KEY;
const url = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=${apiKey}`;

async function fetchNews() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const articles = data.articles;
    let review = '';
    articles.forEach(article => {
      const title = article.title;
      const description = article.description;
      const source = article.source.name;
      review += `**${title}**\n\n${description}\n\nSource: ${source}\n\n`;
    });
    console.log('Revue quotidienne des actualités sur la cryptomonnaie :');
    console.log(review);
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités :', error);
  }
}

fetchNews();
