document.fullscreenEnabled =
	document.fullscreenEnabled ||
	document.mozFullScreenEnabled ||
	document.documentElement.webkitRequestFullScreen;

function requestFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	}
}

function exitFullscreen() {
    if (document.exitFullscreen) { 
        document.exitFullscreen(); 
    } 
    else if (document.mozCancelFullScreen) { 
        document.mozCancelFullScreen(); 
    } 
    else if (document.webkitCancelFullScreen) { 
        document.webkitCancelFullScreen(); 
    } 
    else if (document.msExitFullscreen) { 
        document.msExitFullscreen(); 
    } 
}

function Fun_isFullScreen() {
    let fullScreenCheck = document.fullscreenElement ||
                            document.msFullscreenElement ||
                            document.mozFullscreenElement ||
                            document.webkitFullscreenElement || false;
    if (fullScreenCheck == false) {
        return false
    }
    return true
}

var Vue_TopMenuWindow =  new Vue({
    el: '#top-menu',
    data: {
        message: 'test',
        isFullScreen: false,
        TreeLoginInof: {},
    },

    computed:{
        fullScreen(){
            let fullScreenCheck = document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullscreenElement ||
            document.webkitFullscreenElement || false;
            if (fullScreenCheck == false) {
                return false
            }
            return true
        },
    },

    methods:{
        saveAsPDF() {
            html2canvas(document.getElementById("wrapper_page"), {
                onrendered: function(canvas) {
                var img = canvas.toDataURL('image/png'); //image data of canvas
                //  var doc = new jsPDF({orientation: 'landscape',format:'a4'});
                var doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);
                //console.log([canvas.width, canvas.height])
                doc.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
                doc.save('page.pdf');
                }
            })
        },

        switchFullScreen(){
            if (this.isFullScreen==false){
                requestFullscreen(document.documentElement);
            } else {
                exitFullscreen()
            }
            this.isFullScreen = !Fun_isFullScreen()
        },

        switchSmallToolBox(){
            Vue_mainToolBox.smallToolBox = !Vue_mainToolBox.smallToolBox
        },
    },
    mounted(){
        Vue.set(
            this,
            'TreeLoginInof',
            TreeLoginInof
        )
    },
    beforeUpdate(){
        Vue.set(
            this,
            'TreeLoginInof',
            TreeLoginInof
        )
    },
})

// function saveAsPDF() {
//     html2canvas(document.getElementById("wrapper_page"), {
//        onrendered: function(canvas) {
//          var img = canvas.toDataURL('image/png'); //image data of canvas
//          //  var doc = new jsPDF({orientation: 'landscape',format:'a4'});
//          var doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);
//          //console.log([canvas.width, canvas.height])
//          doc.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height);
//          doc.save('page.pdf');
//        }
//     });
//  };