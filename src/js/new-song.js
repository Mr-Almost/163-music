{
    let view={
        el:'.newSong',
        template:`
        新建歌曲
        `,
        render(data){
            $(this.el).html(this.template)
        }

    }
    let model={}
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
            this.active()  //一开始的初始化
            this.bindEvents()
        },
        bindEvents(){
            //////////////////////////////////////////////////////////
            //发布，1被点，1会addClass，2会removeClass，4会页面清空
            //订阅，2被点，1会remove
            //订阅，3被点，1会addClass
            //订阅，4被点，更新：1remove 增加：1addClass
            //////////////////////////////////////////////////////////


            $(this.view.el).on('click', (e)=>{
              //发布，1被点，1会addClass，2会removeClass，4会页面清空
                this.active() //1addClass
                window.eventHub.emit('list-select', '') //4页面清空
                window.eventHub.emit('list-no-select', '')   //2removeClass
              })
              //订阅，2被点，1会remove
           window.eventHub.on('new-no-select', ()=>{
                $(this.view.el).removeClass('active ')
            })
              //订阅，3被点，1会addClass
            window.eventHub.on('new-select', ()=>{
                $(this.view.el).addClass('active')
            })

            //订阅，4被点，更新：1remove 增加：1addClass
            window.eventHub.on('updata', ()=>{
                this.remove() 
            })
            window.eventHub.on('create', ()=>{
               this.active()
            })

        },
        active(){
            $(this.view.el).addClass('active')
        },
        remove(){
            $(this.view.el).removeClass('active ')
        }
    }
    controller.init(view,model)



}