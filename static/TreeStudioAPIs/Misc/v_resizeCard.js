Vue.component('resize-card', {
    template: `
<div>
<div class='box-card' style=''>
    <div style="height:0;">{{resize_window}} {{resize}}</div>
    <div class='box-card-header' style="font-weight: bolder;cursor: pointer;" 
        :style="'background-color:'+backgroundColor+';border-top: 3px '+borderTopColor+' solid;color: '+fontColor+';'"
        @click="switchWindowUnfold()">
        <slot name="title-str">
            預設文字
        </slot>
        <slot name="title-active-btn">
        </slot>
    </div>
    <div class='box-card-body' 
        style="transition: all .5s;"
        :style="window_unfold?'height:' +window_size+'px;':'height:0px;margin: 0 1.25rem;'"
    >
        <div :id="card_id" @click="testList.push('test')">
            <slot name="body-content">
                預設內容
            </slot>
        </div>
    </div>
</div>
<br>
</div>
    `,
    data: function () {
      return {
        window_unfold: false,
        window_size: 0,
        card_id: uuidv4(),
        testList: ['test'],
      }
    },
    props: ['resize_window', 'background_color', 'window_unfold',
            'border_top_color', 'font_color', 'parent_id'],
    
    methods: {
        calcWindowSize(){
            var This = this
            this.$nextTick(() => {
                This.window_size = document.getElementById(This.card_id).scrollHeight 
            })
        },

        switchWindowUnfold(){
            var This = this
            this.calcWindowSize()
            if (this.window_unfold == undefined){
                this.window_unfold = false
            }
            this.window_unfold = !this.window_unfold
            if (this.window_unfold == true & this.parent_id != undefined){
                this.$nextTick(() => {
                    jumpToDOM("#"+This.parent_id)
                })
            }

            this.$emit('window_unfold', this.window_unfold)
        },

    },

    computed: {
        fontColor(){
            if (this.font_color != undefined){
                return this.font_color
            }
            else {
                return "var(--white);"
            }
        },

        borderTopColor(){
            if (this.border_top_color != undefined){
                return this.border_top_color
            }
            else {
                return "unset"
            }
        },

        backgroundColor(){
            if (this.background_color != undefined){
                return this.background_color
            }
            else {
                return "var(--info);"
            }
        },

        resize(){
            if (this.resize_window == true){
                var This = this
                this.calcWindowSize()
                setTimeout(function(){
                    This.$emit('resize', true)
                },100)
            }
            return this.resize_window
        },
    },

    mounted(){
        var This = this
        setTimeout(function(){
            // console.log('123')
            This.resize_window = true
        },100)
    },
})

function jumpToDOM(dom_id){
    $("html, body").animate(
        { scrollTop: $(dom_id)[0].offsetTop - 10}, 
        500
    );
}