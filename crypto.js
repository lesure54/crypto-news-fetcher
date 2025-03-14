const apiKey = process.env.NEWSAPI_KEY || 'b345c8822c324de09d6c5c8ab3389809'; // Utiliser la clé API fournie si la variable d'environnement n'est pas définie
const newsUrl = `https://newsapi.org/v2/everything?q=cryptocurrency&sortBy=publishedAt&apiKey=${apiKey}`;
const hnUrl = 'http://hn.algolia.com/api/v1/search?query=cryptocurrency&tags=story';
const fs = require('fs');
const nodemailer = require('nodemailer');

async function fetchNews() {
  try {
    if (!apiKey) {
      throw new Error('NEWSAPI_KEY environment variable is not set');
    }

    const response = await fetch(newsUrl);
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

    // Sauvegarder les résultats dans un fichier
    fs.writeFileSync('crypto_news.txt', review);

    // Envoyer les résultats par email
    await sendEmail(review);

    // Récupérer les articles de Hacker News
    await fetchHackerNews();

  } catch (error) {
    console.error('Erreur lors de la récupération des actualités :', error.message);
  }
}

async function fetchHackerNews() {
  try {
    const response = await fetch(hnUrl);
    const data = await response.json();

    console.log('Hacker News API Response:', data); // Log the full API response

    if (!response.ok) {
      throw new Error(`API Error: ${data.message || 'Unknown error'}`);
    }

    if (!data || !Array.isArray(data.hits)) {
      throw new Error('Invalid API response format');
    }

    let review = '';
    data.hits.forEach(article => {
      const title = article.title;
      const url = article.url;
      const author = article.author;
      review += `**${title}**\n\nURL: ${url}\n\nAuthor: ${author}\n\n`;
    });

    console.log('Revue quotidienne des actualités de Hacker News :');
    console.log(review);

    // Sauvegarder les résultats dans un fichier
    fs.writeFileSync('hacker_news.txt', review);

    // Envoyer les résultats par email
    await sendEmail(review);

  } catch (error) {
    console.error('Erreur lors de la récupération des actualités de Hacker News :', error.message);
  }
}

async function sendEmail(content) {
  // Skip email sending if credentials are not set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email credentials not set - skipping email send');
    return;
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'recipient@example.com',
    subject: 'Revue quotidienne des actualités sur la cryptomonnaie et Hacker News',
    text: content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error.message);
  }
}

fetchNews();