// Extend : https://www.npmjs.com/package/anime-scraper
const Anime = require('anime-scraper').Anime
const AnimeInfos = require("../models/AnimeInfos")
const axios = require("axios");
const malScraper = require("mal-scraper");

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
async function upAnime(name, url, userID){
    const animeExist = await AnimeInfos.findOne({name: name, url: url});
    if (!animeExist){
        const infos = await malScraper.getInfoFromName(name);
        const newAnime = new AnimeInfos({
            name: name,
            url: url,
            image: infos.picture,
            fame: 0,
        })
        const success = await newAnime.save();
        if (!success) throw new Error("Couldn't add the anime to the database.")
        const createdAnime = await AnimeInfos.findOne({name: name, url: url});
        createdAnime.alreadyUpVoted.push({
            userID: userID,
            date: (Date.now() + 86400000)
        })
        createdAnime.fame = createdAnime.fame + 1;
        const secondSuccess = await createdAnime.save();
        if (!secondSuccess) throw new Error("Couldn't upvote the anime in the database.")
        return {message: "Success of creating and upvoting the anime"}
    }else{
        let userVoteAnime;
        animeExist.alreadyUpVoted.forEach(userVote => {
            if (userID === userVote.userID) {
                if (userVote.date <= Date.now()){
                    userVoteAnime = true;
                    animeExist.alreadyUpVoted.pull(userVote);
                }else{
                    userVoteAnime = false;
                }

            }
        })
        if (!userVoteAnime) return {message: "User already upvoted this anime during the last 24 hours"}
        animeExist.alreadyUpVoted.push({
            userID: userID,
            date: (Date.now() + 86400000)
        })
        animeExist.fame = animeExist.fame + 1;
        const success = await animeExist.save();
       if (!success) throw new Error("Couldn't update the anime in the database.")
        return {message: "Success of creating and upvoting the anime"}
    }
}
async function deleteAnimeFromDB(name){
    const anime = await AnimeInfos.findOneAndDelete({name: name});
    if (!anime) throw new Error("Anime not found!");
    return {message: "Anime deleted from database"};
}
module.exports = {
    searchAnime,
    getAnimeInfos,
    getEpisodeInfos,
    getAnimeByName,
    upAnime,
    deleteAnimeFromDB
}