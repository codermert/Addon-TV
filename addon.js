const { addonBuilder } = require("stremio-addon-sdk");
const magnet = require("magnet-uri");

const manifest = { 
    "id": "org.codermert",
    "version": "1.0.0",

    "name": "Mert Addon",
    "description": "@codermert tarafından yazıldı",
    "background": "",
    "logo": "https://avatars.githubusercontent.com/u/53333294?v=4",
    "resources": [
        "catalog",
        "stream"
    ],

    "types": ["movie", "series"], 

    "catalogs": [
        {
            type: 'movie',
            id: 'helloworldmovies'
        },
        {
            type: 'series',
            id: 'helloworldseries'
        }
    ],

    "idPrefixes": [ "tt" ]

};

const dataset = {
    

    "tt18974572:1:1": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18301_tr/play.m3u8" },
    "tt18974572:1:2": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18302_tr/play.m3u8" },
    "tt18974572:1:3": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18303_tr/play.m3u8" },
    "tt18974572:1:4": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18304_tr/play.m3u8" },
    "tt18974572:1:5": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18305_tr/play.m3u8" },
    "tt18974572:1:6": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18306_tr/play.m3u8" },
    "tt18974572:1:7": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18307_tr/play.m3u8" },
    "tt18974572:1:8": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18308_tr/play.m3u8" },
    "tt18974572:1:9": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18309_tr/play.m3u8" },
    "tt18974572:1:10": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18310_tr/play.m3u8" },
    "tt18974572:1:11": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18311_tr/play.m3u8" },
    "tt18974572:1:12": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18312_tr/play.m3u8" },
    "tt18974572:1:13": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18313_tr/play.m3u8" },
    "tt18974572:1:14": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18314_tr/play.m3u8" },

    "tt18974572:2:1": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18315_tr/play.m3u8" },
    "tt18974572:2:2": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18316_tr/play.m3u8" },
    "tt18974572:2:3": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18317_tr/play.m3u8" },
    "tt18974572:2:4": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18318_tr/play.m3u8" },
    "tt18974572:2:5": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18319_tr/play.m3u8" },
    "tt18974572:2:6": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18320_tr/play.m3u8" },
    "tt18974572:2:7": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18321_tr/play.m3u8" },
    "tt18974572:2:8": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18322_tr/play.m3u8" },
    "tt18974572:2:9": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18323_tr/play.m3u8" },
    "tt18974572:2:10": { "name": "The Marked Heart", "type": "series", "url": "https://storage.diziyou.co/episodes/18324_tr/play.m3u8" },
};

function fromMagnet(name, type, uri) {
    const parsed = magnet.decode(uri);
    const infoHash = parsed.infoHash.toLowerCase();
    const tags = [];
    if (uri.match(/720p/i)) tags.push("720p");
    if (uri.match(/1080p/i)) tags.push("1080p");
    return {
        name: name,
        type: type,
        infoHash: infoHash,
        sources: (parsed.announce || []).map(function(x) { return "tracker:"+x }).concat(["dht:"+infoHash]),
        tag: tags,
        title: tags[0], 
    }
}

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
})

const METAHUB_URL = "https://images.metahub.space"

const generateMetaPreview = function(value, key) {
 
    const imdbId = key.split(":")[0]
    return {
        id: imdbId,
        type: value.type,
        name: value.name,
        poster: METAHUB_URL+"/poster/medium/"+imdbId+"/img",
    }
}

builder.defineCatalogHandler(function(args, cb) {
    const metas = Object.entries(dataset)
	.filter(([_, value]) => value.type === args.type)
	.map(([key, value]) => generateMetaPreview(value, key))

    return Promise.resolve({ metas: metas })
})

module.exports = builder.getInterface()
