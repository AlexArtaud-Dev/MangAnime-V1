// Extend : https://www.npmjs.com/package/anime-scraper
const Anime = require('anime-scraper').Anime


async function searchAnime(name, offset = 100, startfrom = 1) {
    const untreatedAnimeArray = [];
    const treatedAnimeArray = [];

    const animeResults = await Anime.search(name);
    if (offset > animeResults.length){
        offset = animeResults.length;
    }
    for(let i =0; i < (startfrom-1) + offset ; i++){
        const animeInfos = await animeResults[i].toAnime();
        const animeObject = {
            id: animeInfos.id,
            name: animeInfos.name,
            url: animeInfos.url.replace("https://gogoanime.io", ""),
            date: animeInfos.released,
            episodesNumber: animeInfos.episodes.length
        };
        treatedAnimeArray.push(animeObject);
    }
    return treatedAnimeArray;
}
async function getAnimeInfos(url){
    if (!url.includes("https://ww1.gogoanime.io/category/") && !url.includes("https://www1.gogoanime.ai/category/") && !url.includes('https://gogoanime.io/category/')){
        console.log(url);
         throw new Error("Bad URL format!")
    }
    const data = await Anime.fromUrl(url)
    return {
        id: data.id,
        name: data.name,
        summary: data.summary,
        genres: data.genres,
        releaseDate: data.released,
        numberEpisode: data.episodes.length !== undefined ? data.episodes.length : 0
    }
}
async function getAnimeByName(name){
    const anime = await Anime.search(name);
    return anime[0];
}
async function getEpisodeInfos(name, episode){
    const anime = await Anime.fromName(name);
    return await anime.episodes[episode].fetch();
}

module.exports = {
    searchAnime,
    getAnimeInfos,
    getEpisodeInfos,
    getAnimeByName
}