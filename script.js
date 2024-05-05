let songs;

async function getSongs() {
    let response = await fetch("http://127.0.0.1:3000/songs/");
    let htmlContent = await response.text();
    let div = document.createElement("div");
    div.innerHTML = htmlContent;
    let links = div.getElementsByTagName("a");
    
    let songs = [];
    for (let index = 0; index < links.length; index++) {
        const link = links[index];
        let href = link.getAttribute("href");
        if (href && href.endsWith(".mp3")) {
            let songName = href.replace(/^.*?\\songs\\/, ''); // Remove "\songs\" prefix
            songs.push(songName);
        }
    }
    return songs;
}



let currentSong = new Audio();

const playMusic = (track,pause=false)=>{
  //  let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main() {
    
    songs = await getSongs();
    playMusic(songs[0],true)
    console.log(songs);
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    
    for (const song of songs) {
        let songTitle = typeof song === 'string' ? song : (song.title ?? '');
        console.log(typeof songTitle);
        // Check if the song has a 'replaceA11' property before trying to access it
        let replacedTitle = song.replaceAll ? songTitle.replace(song.replaceAll, 'replacement') : songTitle;
        songUl.innerHTML += `<li>                
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${replacedTitle.replaceAll("%20", " ")}</div>
                <div>Yogi</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",Element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)  
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    });
     
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // listen for tmeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML =` ${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
    })

    // add an event listener in seekbar
    document.querySelector(".seekbar").addEventListener("click" , e =>{
       let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration)* percent)/100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button 
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener for Previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume = parseInt(e.target.value)/100
   })

}  

main();
