{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let { songs } = data
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name)
                //if(song.id === selectedSongId){ $li.addClass('active') }
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi) => {
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: { songs: [] },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    
                    return { id: song.id, ...song.attributes }
                   
                })
                console.log(songs)
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data) => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (data) => {
                Data = JSON.parse(JSON.stringify(data))
                this.model.data.songs.push(Data)
                this.view.render(this.model.data)
                console.log(this.model.data)
            })
            this.getAllSongs()
        },
        getAllSongs(){
            return this.model.find().then(()=>{
              this.view.render(this.model.data)
            })
        }
        }
    controller.init(view, model)
}