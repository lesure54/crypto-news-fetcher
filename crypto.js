const ; // Utiliser la clé API fournie si la variable d'environnement n'est pas définie
const url = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=${apiKey}`;

async function fetchNews() {
  try {
    if (!apiKey) {
      throw new Error('NEWSAPI_KEY environment variable is not set');
    }

    const response = await fetch(url);
    const data = await response.json();
    
    console.log('API Response:', data); // Log the full API response

    if (!response.ok) {
      throw new Error(`API Error: ${data.message || 'Unknown error'}`);
    }
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid API response format');
    }

    let review = '';
    data.articles.forEach(article => {
      const title = article.title;
      const description = article.description;
      const source = article.source.name;
      review += `**${title}**\n\n${description}\n\nSource: ${source}\n\n`;
    });
    
    console.log('Revue quotidienne des actualités sur la cryptomonnaie :');
    console.log(review);
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités :', error.message);
  }
}

fetchNews();