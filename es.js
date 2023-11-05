const request = require('request');
const cheerio = require('cheerio');

const baseURL = 'https://www.diziyou.co/the-marked-heart-1-sezon-';
const numEpisodes = 10;
const episodes = {};

function getM3ULink(episodeNumber) {
  const episodeURL = `${baseURL}${episodeNumber}-bolum/`;

  request(episodeURL, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const m3uLink = $('#diziyouSource').attr('src');

      episodes[`tt18974572:1:${episodeNumber}`] = {
        name: "The Marked Heart",
        type: "series",
        url: m3uLink
      };

      if (episodeNumber === numEpisodes) {
        console.log(JSON.stringify(episodes, null, 2));
      }
    }
  });
}

for (let i = 1; i <= numEpisodes; i++) {
  getM3ULink(i);
}
