let tracklist = document.getElementById("tracklist");

let artiste = "";
let listTrack = [];

const getArtiste = async () => {
    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://api.deezer.com/artist/${artiste}`);
        return response.json();
    } catch (err) {
        throw new Error(err);
    }
}

const getTrackist = async (id) => {
    try {
        const response = await fetch(`https://api.allorigins.win/raw?url=https://api.deezer.com/artist/${id}/top?limit=50`);
        return response.json();
    } catch (err) {
        throw new Error(err);
    }
}

document.getElementById('button-submit').addEventListener("click", function submit() {
    submitArtiste();
});

const submitArtiste = () => {
    artiste = document.forms["form-artiste"]["artiste"].value;
    getArtiste(artiste).then(res => {
        titreH1();
        listTrack = [];
        getTrackist(res.id).then(res => {
            listTrack = res.data;
            console.log(listTrack);
            list();
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
}

const titreH1 = () => {
    const h1 = document.getElementById("h1-tracklist");
    h1.textContent = `Tracklist de ${ artiste.charAt(0).toUpperCase() + artiste.substr(1) } (Top 50)`;
}

const list = () => {
    const div = document.querySelector(".list");
    div.innerHTML = "";
    if ("content" in document.createElement("template")) {
        let template = document.querySelector("#trackpanel");
        listTrack.forEach((track, index)=> {
            let objTrack = {
                index: index + 1,
                title: track.title,
                duration: track.duration,
                contributors: [],
                album: track.album.title,
                cover: track.album.cover_medium
            }
            track.contributors.forEach(contributor => {
                objTrack.contributors.push(contributor.name);
            });
            let clone = document.importNode(template.content, true);
            let h4 = clone.querySelector("h4");
            h4.innerHTML = objTrack.title;
            let img = clone.querySelector("img");
            img.src = objTrack.cover;
            let p = clone.querySelectorAll("p");
            p[0].innerHTML = objTrack.index;
            p[1].innerHTML = objTrack.duration;
            p[2].innerHTML = objTrack.contributors;
            p[3].innerHTML = objTrack.album;
            div.appendChild(clone);
        });
        tracklist.appendChild(div);
    }
}