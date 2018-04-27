{
    let view = {
        el: '.songList-container',
        template: `
        <ul class="songList">
        <li></li>
      </ul>
        `,
        render(data) {
            
        let { songs } = data
        console.log(3)
        let liList = songs.map((song)=> {
            console.log(222222)
            let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
            if(song.id === selectedSongId){ $li.addClass('active') }
            return $li
          })
        console.log(4)
 
    console.log(liList)
    let $el=$(this.el)
    $el.find('ul').empty()
    liList.map( (domLi)=>{
        $el.find('ul'.append(domLi))
    })
    $(this.el).html(this.template)

         },
clearActive(){
    $(this.el).find('.active').removeClass('active')
 }
    }
let model = {
    data: {songs:[]},
    find(){
        var query = new AV.Query('Song');
        return query.find().then((songs)=>{
          this.data.songs = songs.map((song)=>{
            return {id: song.id, ...song.attributes}
          })
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
          
            this.model.data.push(data)
            this.view.render(this.model.data)
            console.log(this.model.data)
        })
    }
}
controller.init(view, model)



}