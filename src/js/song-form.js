{
    let view={
        el:'.page>main',
        template:`
        <h1>新建歌曲</h1>
        <form>
            <div class="row">
                <label>
                    歌名
                    <input name="name" type="text" value="__name__">
                </label>
            </div>
            <div class="row">
                <label>
                    歌手
                    <input name="singer" type="text" value="__singer__">
                </label>
            </div>

            <div class="row">
                <label>
                    外链
                    <input name="url" type="text" value="__url__">
                </label>
            </div>
            <div class="row"> 
                     <button type="submit">保存</button>
                </div>
            

        </form>
        `,
        render(data={}){
            let placeholders=['name','url','singer','id']
            let html=this.template
            placeholders.map( (string)=>{
                html=html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
  

let model={
data:{name:'',singer:'',url:'',id:''},
create(data){ 
    // 声明类型
    var Song= AV.Object.extend('Song');
    // 新建对象
    var song = new Song();
   song.set('name',data.name);
   song.set('singer',data.singer);
   song.set('url',data.url);
  return song.save().then( (newSong)=> {
       let {id,attributes}=newSong
       Object.assign(this.data,{
           id,
           ...attributes
       })
    },  (error)=> {
      console.error(error);
    });
}



}
let controller={
    init(view,model){
        this.view=view
        this.model=model
        this.bindEvents()
        this.view.render(this.model.data)
        window.eventHub.on('upload',(data)=>{
            this.view.render(data)
        })
    },
    bindEvents(){
        $(this.view.el).on('submit','form',(e)=>{
            e.preventDefault()
        let need='name singer url'.split(' ')
        let data={}
        need.map((string)=>{
            data[string]=$(this.view.el).find(`[name=${string}]`).val()
        })
    
        this.model.create(data).then(()=>{
            this.view.reset()
           window.eventHub.emit('create',this.model.data)
         
          })
        })
     
    },
   

}
controller.init(view,model)

}