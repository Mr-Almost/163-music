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
            let html=this.template
            let placeholders=['name','url','singer','id']   
            placeholders.map( (string)=>{
                html=html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
  

    let model = {
        data: { name: '', singer: '', url: '', id: '' },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            }, (error) => { console.error(error); });
        },
        update(data) {
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('lyrics', data.lyrics)
            song.set('url', data.url)
            song.set('cover', data.cover)
            return song.save().then((response) => {
                Object.assign(this.data, data)
                return response
            })
        }



}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
        },
        bindEvents() {
            //////////////////////////////////////////////////////////
            //订阅，1,被点，4内容为空
            //订阅，2被点，4换内容
            //订阅，3被点，且上传完成，4换内容
            //发布，4更新：2的addClass保持；4增加：1addClass 2removeClass 
            //////////////////////////////////////////////////////////

             //订阅，1,被点，4内容为空
             window.eventHub.on('new-select', () => {
                this.view.reset()
            })


              //订阅，2被点，4换内容
            window.eventHub.on('list-select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })

              //订阅，3被点，且上传完成，4换内容
              window.eventHub.on('upload', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })


            //发布，4被点，更新：2的addClass保持；4增加：1addClass 2removeClass 
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })

        },
        update() {
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.update(data).then(() => {
                window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        create() {
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = $(this.view.el).find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()
                //this.model.data === 'ADDR 108'
                let string = JSON.stringify(this.model.data)
                let object = JSON.parse(string)
                window.eventHub.emit('create', object)
                window.eventHub.emit('list-no-select', '')
                window.eventHub.emit('new-select', '')
            })
        }
    }
controller.init(view,model)

}