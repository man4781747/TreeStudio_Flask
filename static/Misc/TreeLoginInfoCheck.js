var LoginPagePath = "http://34.80.222.210:8999/loginPage"

var TreeLoginInof = {'login_info': {'user_name': ''}}
var loginWindow;

function checkLoginCookie(parent=null){
    // 檢查cookie中有無登入token資訊
    // 沒有的話，要跳轉至Login頁面
    try {
        loginToken = document.cookie.slice(document.cookie.match("treesys-login-token").index).split(';')[0].split('=')[1]
        // console.log(loginToken)
        checkLoginInfo(loginToken)
        .then(function(data) {
            if (data.result == 'success'){
                TreeLoginInof.login_info = {
                    'user_name' : data.data.message.split('dn:cn=')[1].split(',')[0]
                }
            } else {
                if (parent==null){
                    console.log('找不到登入資訊，開啟登入頁面')
                    openLoginWindow()
                }
                else if (parent=='noOpen'){
                    onsole.log('找不到登入資訊')
                }
                else {
                    console.log('找不到登入資訊，開啟登入內面')
                    OpenLoginIframe(parent)
                }
            }
        })
    } catch(e){
        if (parent==null){
            console.log('找不到登入資訊，開啟登入頁面')
            openLoginWindow()
        }
        else if (parent=='noOpen'){
            console.log('找不到登入資訊')
        }
        else {
            console.log('找不到登入資訊，開啟登入內面')
            OpenLoginIframe(parent)
        }
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

function openLoginWindow(){
    win=popupCenter({
        url:LoginPagePath, 
        title:"TREE Login", 
        w:600, 
        h:600
    })
}

const popupCenter = ({url, title, w, h}) => {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop - 300
    const newWindow = window.open(url, title, 
      `
      scrollbars=no,toolbar=no,location=no,status=no
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    )
    if (window.focus) newWindow.focus();
    return newWindow
}

function reloadAccountInfo(){
    loginToken = document.cookie.slice(document.cookie.match("treesys-login-token").index).split(';')[0].split('=')[1]
    checkLoginInfo(loginToken)
    .then(function(data) {
        if (data.result == 'success'){
            console.log('獲得登入資訊')
            TreeLoginInof.login_info = {
                'user_name' : data.data.message.split('dn:cn=')[1].split(',')[0]
            }
            console.log(TreeLoginInof)
        } else {
            v_console.log('找不到登入資訊，開啟登入頁面')
            openLoginWindow()
        }
    })
}

function LoginOut(){
    TreeLoginInof['login_info'] = {'user_name': ''}
    Cookies.remove("treesys-login-token")
}

function CloseIframe(){
    var loginIframe =document.getElementById("login-iframe")
    if (loginIframe){
        loginIframe.remove()
    }
}

function OpenLoginIframe(parent){
    CloseIframe()
    var iframe = document.createElement('iframe');
    iframe.id='login-iframe'
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.position = "absolute";
    // iframe.style.backgroundColor = "rgba(0,0,0,.5)";
    iframe.style.border = "0";
    iframe.style.padding = "0";
    iframe.style.margin = "0";
    iframe.style.left = "0";
    iframe.style.top = "0";
    iframe.style.zIndex = "1052";
    iframe.src = LoginPagePath
    parent.appendChild(iframe);
}

checkLoginCookie('noOpen')
// OpenLoginIframe(document.getElementById("wrapper_page"))