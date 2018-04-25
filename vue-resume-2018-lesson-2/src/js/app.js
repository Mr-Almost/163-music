let app = new Vue({
  el: '#app',
  data: {
    editingName: false, loginVisible: false, signUpVisible: false,
    currentUser: {
      id: undefined,
      email: '',
      fuck: 'fuck'
    },
    resume: {
      name: '姓名',
      gender: '女',
      birthday: '1990年1月',
      jobTitle: '前端工程师',
      phone: '138111111111',
      email: 'example@example.com'
    }, login: {
      email: '',
      password: ''
    },
    signUp: {
      email: '',
      password: ''
    },
  },
  methods: {
    onEdit(key, value){
      this.resume[key] = value
    },
    onLogin(e){
      AV.User.logIn(this.login.email, this.login.password).then((user) => {
        this.currentUser.id = user.id
        this.currentUser.email = user.attributes.email
      }, (error) => {
        if (error.code === 211) {
          alert('邮箱不存在')
        } else if (error.code === 210) {
          alert('邮箱和密码不匹配')
        }
      })
    },
    onLogout(e){
      AV.User.logOut();
      alert('注销成功')
      window.location.reload()
    },
    onSignUp(e){
      const user = new AV.User()
      user.setUsername(this.signUp.email)
      user.setPassword(this.signUp.password)
      user.setEmail(this.signUp.email)
      user.signUp().then((user) => {
      }, (error) => {
      })
    },
    onClickSave(){
      let currentUser = AV.User.current()
      if (!currentUser) {
        this.loginVisible = true
      } else {
        this.saveResume()
      }
    },
    saveResume(){
      let {id} = AV.User.current()
      let user = AV.Object.createWithoutData('User', id)
      user.set('resume', this.resume)
      user.save()
    },
  }
})

let currentUser = AV.User.current()
if (currentUser) {
  app.currentUser = currentUser.toJSON()
}
