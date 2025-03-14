const apiKey = 'b345c8822c324de09d6c5c8ab3389809'; // Remplacez par votre clé API NewsAPI
const url = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=${apiKey}`;
fetch(url)
  .then(response => response.json())
  .then(data => {
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
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des actualités :', error);
  });
