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
            let { songs} = data
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
                if(data.selectSongId===song.id) {$li.addClass('active')  }   
                return $li
            })
            $el.find('ul').empty()
            liList.map((domLi) => {$el.find('ul').append(domLi)})
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }

    let model = {
        data: { songs: [] , selectSongId:undefined},
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
            this.model.find().then(() => { this.view.render(this.model.data) })
            this.bindEvents()
        },

        bindEvents() {
            //////////////////////////////////////////////////////////
            //订阅，1被点，2removeClass
            //通知，2被点，1removeClass，2addClass，4换内容
            //订阅。3被点，2removeClass
            //订阅。4被点，如果是更新，2不变；如果是增加，2removeClass
            //////////////////////////////////////////////////////////////


            //订阅，1被点，2removeClass
            //订阅。3被点，2removeClass     
            window.eventHub.on('list-no-select', () => {
                $(this.view.el).find('li').removeClass('active')
            })

            //通知，2被点，1removeClass，2addClass，4换内容
            $(this.view.el).on('click', 'li', (e) => {
                //1removeClass
                window.eventHub.emit('new-no-select', '')
                //2addClass 被点到就add，没被点到就remove
                $(this.view.el).find('li').removeClass('active')
                $(e.currentTarget).addClass('active')
                //4换内容
                let data
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectSongId=songId
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) { if (songs[i].id === songId) { data = songs[i]; break } }
                window.eventHub.emit('list-select', JSON.parse(JSON.stringify(data)))
            })

            //订阅。4被点，如果是更新，2不变；如果是增加，2removeClass
            //这是更新
            window.eventHub.on('update', (song) => {
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) { if (songs[i].id === song.id) { Object.assign(songs[i], song) } }
                console.log(this.model.data)
                this.view.render(this.model.data)
            })

            //这是增加
            window.eventHub.on('create', (data) => {
                Data = JSON.parse(JSON.stringify(data))
                this.model.data.songs.push(Data)
                this.view.render(this.model.data)
                console.log(this.model.data)
            })
        }


    }
    controller.init(view, model)
}