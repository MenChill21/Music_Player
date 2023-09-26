
const $=document.querySelector.bind(document);
const $$=document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY='PLAYER'

const header=$('header h2')
const cdThumb=$('.cd-thumb')
const audio=$('#audio')
const cd=$('.cd')
const playBtn=$('.btn-toggle-play')
const player=$('.player')
const progress=$('.progress')
const next=$('.btn-next')
const prev=$('.btn-prev')
const random=$('.btn-random')
const repeat=$('.btn-repeat')
const playlist=$('.playlist')
const app={
    currentIndex:0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    setConfig: function(key,value){
        this.config[key]=value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs: [
        {
            name: "Hoa cỏ lao",
            singer: "Phong max",
            path: "./assets/music/hoacolao1.mp3",
            image:
                "./assets/imgs/gaixinh01.jpg"
        },
        {
            name: "À Lôi",
            singer: "Không biết",
            path: "./assets/music/aloi.mp3",
            image:
                "./assets/imgs/gaixinh02.jpg"
        },
        {
            name: "Ừ Có Anh Đây",
            singer: "Timo",
            path:
                "./assets/music/AnhDay.mp4",
            image: "./assets/imgs/gaixinh03.jpg"
        },
        {
            name: "Một Bước Yêu, Vạn Dặm Đau",
            singer: "Mr. Siro",
            path: "./assets/music/MotBuocYeu .mp4",
            image: "./assets/imgs/gaixinh04.jpg"
        },
        
        {
            name: "FIFTY FIFTY",
            singer: ",...",
            path: "./assets/music/fifty.mp4",
            image: "./assets/imgs/gaixinh05.jpg"
        },
        {
            name: "Attention",
            singer: ",...",
            path: "./assets/music/attention.mp4",
            image: "./assets/imgs/gaixinh06.jpg"
        },
        {
            name: "Lạc trôi",
            singer: ",...",
            path: "./assets/music/lactroi.mp4",
            image: "./assets/imgs/gaixinh07.jpg"
        }
    ],
    render: function(){
        const htmls=this.songs.map((song,index)=>{
            return ` <div class="song ${index===this.currentIndex?"active":""}" data-index=${index}>
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML=htmls.join('')
    },

    handleEvents: function(){
        _this=this;
        //xử lý CD quay dừng
        const cdThumbAnimate=cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 3000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ CD
        const cdWidth=cd.offsetWidth
        document.onscroll=function(){
            const scrollTop=window.scrollY || document.documentElement.scrollTop
            const newCdWidth=cdWidth - scrollTop;
            cd.style.width=newCdWidth > 0 ? newCdWidth + 'px':0
            cd.style.opacity= newCdWidth/cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick=function(){
            if(app.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
            audio.onplay=function(){
                player.classList.add('playing')
                app.isPlaying=true
                cdThumbAnimate.play();
            }
            audio.onpause=function(){
                player.classList.remove('playing')
                app.isPlaying=false
                cdThumbAnimate.pause();
            }
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate=function(){
            // Trang tải trước khi tệp âm thanh được tải nên ban đầu có NaN
            if(audio.duration){
                const progressRecent=Math.floor((audio.currentTime+1) / audio.duration *100)
                progress.value=progressRecent
            }
        }
        // Xử lý khi tua
        progress.onchange=function(e){
            const seekTime=(e.target.value * audio.duration / 100)
            audio.currentTime=seekTime
        }
        // Xử lý next song
        next.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
                _this.isPlaying=true
                player.classList.add('playing')
            }else{
                _this.nextSong()
                _this.isPlaying=true
                player.classList.add('playing')
            }
            cdThumbAnimate.play()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
         // Xử lý Previos song
         prev.onclick=function(){
            if(_this.isRandom){
                _this.playRandomSong()
                _this.isPlaying=true
                player.classList.add('playing')
            }else{
                _this.previosSong()
                _this.isPlaying=true
                player.classList.add('playing')
            }
            cdThumbAnimate.play()
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random song
        random.onclick=function(){
            _this.isRandom=!_this.isRandom
            random.classList.toggle('active',_this.isRandom)
            _this.setConfig('isRandom',_this.isRandom)
        }

        // Xử lý repeat song
        repeat.onclick=function(){
            _this.isRepeat=!_this.isRepeat
            repeat.classList.toggle('active',_this.isRepeat)
            _this.setConfig('isRepeat',_this.isRepeat)
        }

        // Xử lý next song khi ended
        audio.onended=function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                next.click();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick=(e)=>{
            const songNode=e.target.closest('.song:not(.active)')
            if(songNode || !e.target.closest('.option')){
                    if(songNode){
                        _this.currentIndex=Number(songNode.getAttribute('data-index')) //or songNode.dataset.index
                        _this.loadCurrentSong()
                        audio.play()
                        _this.render()
                    }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
    },
    // Định nghĩa ra properties cho đôi tượng app
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex=0;
        }
        this.loadCurrentSong()
    },
    previosSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex=this.songs.length-1;
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex=newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function(){
        header.textContent=this.currentSong.name
        cdThumb.style.backgroundImage=`url(${this.currentSong.image})`
        audio.src=this.currentSong.path

    },
    loadConfig: function(){
        this.isRandom=this.config.isRandom
        this.isRepeat=this.config.isRepeat

        random.classList.toggle('active',this.isRandom)
        repeat.classList.toggle('active',this.isRepeat)
    },
    start: function(){
        // Gắn cấu hình từ config vào app
        this.loadConfig()

        // Định nghĩa các properties cho object
        this.defineProperties()

        // Lắng nghe xử lý các sự kiện DOM
        this.handleEvents()

        // Load thông tin bài hát đầu tiên vào UI khi run app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        random.classList.toggle('active',this.isRandom)
        repeat.classList.toggle('active',this.isRepeat)
    }
}
app.start()