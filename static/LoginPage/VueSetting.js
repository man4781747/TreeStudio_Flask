TREESTUDIO_PATH = "http://34.80.222.210:8999"

var Vue_loginWindow = new Vue({
	el: '#login-window',
	data: {
		login_info: {
            account: '',
            password: '',
        },
        if_remeberMe: false,
	},
  
	computed: {
        bodyColor(){
            if (window.frames.length == parent.frames.length){
                return "#e9ecef"
            } else {
                return "rgba(0,0,0,.5)"
            }
        },
	},
  
	methods: {
        getPublicKey(){
            fetch_getPublicKey = fetch('/loginKeyGet', {
                method: 'GET',
            }).then(function(response) {
                return response.json();
            })
            return fetch_getPublicKey
        }, 

        goLogin(){
            this.encodePassword(this.login_info.password)
        },

        encodePassword(S_password){
            this.getPublicKey()
            .then(function(data) {
                // console.log(data)
                encrypt = new JSEncrypt();
                encrypt.setPublicKey(data['data']['Publickey']);
                password = encrypt.encrypt(S_password);
                Vue_loginWindow.sendLoginInfo(password, data['data']['Publickey'])
            })
        },

        sendLoginInfo(S_password_encoded, pubKey){
            var form = new FormData();
            form.append("password",S_password_encoded)
            form.append("pubKey",pubKey)
            form.append("account",this.login_info.account)

            fetch('/login', {
                method: 'POST',
                body: form,
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if (data.result == 'success'){
                    v_console.success("OK")
                    if (window.opener != null){
                        // 判斷為別人開啟地跳出式視窗
                        window.opener.reloadAccountInfo()
                        window.close()
                    }
                    if (window.frames.length != parent.frames.length){
                        // 判斷為別人開啟地嵌入式視窗
                        window.parent.reloadAccountInfo()
                        window.parent.CloseIframe()
                    }
                    else {
                        // 判斷為獨立開啟的登入視窗
                        v_console.log('暫定跳轉至TreeStudio')
                        window.location.href=TREESTUDIO_PATH
                    }
                } else {
                    v_console.error(data.data.message)
                }
            })
        },
    },

	mounted: function(){
        if (window.frames.length == parent.frames.length){
            document.body.style.backgroundColor="#e9ecef"
        } else {
            document.body.style.backgroundColor="rgba(0,0,0,.5)"
        }
	},
})


if ((window.opener==null) & (window.frames.length == parent.frames.length)){
    console.log('獨立開啟，檢查登入狀態')
    checkLoginCookie()

}

function checkLoginCookie(){
    // 檢查cookie中有無登入token資訊
    try {
        loginToken = document.cookie.slice(document.cookie.match("treesys-login-token").index).split(';')[0].split('=')[1]
        checkLoginInfo(loginToken)
        .then(function(data) {
            if (data.result == 'success'){
                window.location.href=TREESTUDIO_PATH
            } else {
                
            }
        })
    } catch(e){
    }
}

function checkLoginInfo(loginToken){
    fetch_login = fetch('/checkLoginInfo', {
        method: 'GET',
        headers: {
            'treesys-login-token': loginToken,
        },
    }).then(function(response) {
        return response.json();
    })
    return fetch_login
}