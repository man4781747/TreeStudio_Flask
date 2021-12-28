var v_console_div = document.createElement("div")
v_console_div.id = "v-console-window"

var v_console_item_div = document.createElement("v-console-main-item")
v_console_item_div.setAttribute('v-bind:d_consolelist', 'D_consoleList')
v_console_item_div.setAttribute('v-bind:delete_console', 'deleteConsole')

v_console_div.appendChild(v_console_item_div)
document.body.appendChild(v_console_div)

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

Vue.component("v-console-main-item", {
    template:`
<div>
    <div v-for="(D_console, S_uuid, index) in d_consolelist"
        style="display: flex;justify-content: flex-end;"
        >
        <div class="v-console-item animate__animated" :class="D_console.style_set">
            <div class="v-console-item-icon" :style="'border-color:'+D_console.color+';'">
                <div class="v-console-item-icon v-console-item-icon-delete-btn">
                    <i class="fas fa-trash-alt v_console_del_btn" style="color: var(--dark);"
                        @click="deleteConsole(S_uuid)"
                    ></i>
                </div>
                <i v-if="D_console.type=='log'" class="fas fa-info-circle" :style="'color:'+D_console.color+';'"></i>
                <i v-else-if="D_console.type=='error'" class="far fa-times-circle" :style="'color:'+D_console.color+';'"></i>
                <i v-else-if="D_console.type=='warning'" class="fas fa-exclamation-triangle" :style="'color:'+D_console.color+';'"></i>
                <i v-else-if="D_console.type=='debug'" class="fas fa-bug" :style="'color:'+D_console.color+';'"></i>
                <i v-else-if="D_console.type=='success'" class="far fa-check-circle" :style="'color:'+D_console.color+';'"></i>
            </div>
            <div class="v-console-item-content">
                <div>{{D_console.content}}</div>
            </div>
        </div>
    </div>
</div>
`,
    props: ['d_consolelist','test'],
    methods:{
        deleteConsole(S_uuid){
            if (v_console.D_consoleList[S_uuid] == undefined){
                return null
            }
            v_console.D_consoleList[S_uuid].style_set="animate__bounceOutRight"
            setTimeout(function(){
                Vue.delete(v_console.D_consoleList, S_uuid)
            },500)
        },
    }
})

var v_console =  new Vue({
    el: '#v-console-window',
    data: {
        D_consoleList : {},
        test: 'wsedt',
    },
    methods:{
        addConsole(D_content, F_time=3.){
            Vue.set(
                this.D_consoleList,
                D_content.uuid,
                D_content
            )
            setTimeout(function(){
                v_console.deleteConsole(D_content.uuid)
            },F_time*1000)
        },

        deleteConsole(S_uuid){
            if (this.D_consoleList[S_uuid] == undefined){
                return null
            }
            this.D_consoleList[S_uuid].style_set="animate__bounceOutRight"
            setTimeout(function(){
                Vue.delete(v_console.D_consoleList, S_uuid)
            },500)
        },
        log(S_content, F_time=3.){
            D_content = {
                'uuid': uuidv4(),
                'type': 'log',
                'content': S_content,
                'style_set': 'animate__swing',
                'color': 'var(--info)',
            }
            this.addConsole(D_content, F_time)
        },
        warning(S_content, F_time=3.){
            D_content = {
                'uuid': uuidv4(),
                'type': 'warning',
                'content': S_content,
                'style_set': 'animate__swing',
                'color': 'var(--warning)',
            }
            this.addConsole(D_content, F_time)
        },
        error(S_content, F_time=3.){
            D_content = {
                'uuid': uuidv4(),
                'type': 'error',
                'content': S_content,
                'style_set': 'animate__shakeX',
                'color': 'var(--danger)',
            }
            this.addConsole(D_content, F_time)
        },
        debug(S_content, F_time=3.){
            D_content = {
                'uuid': uuidv4(),
                'type': 'debug',
                'content': S_content,
                'style_set': 'animate__swing',
                'color': 'var(--dark)',
            }
            this.addConsole(D_content, F_time)
        },
        success(S_content, F_time=3.){
            D_content = {
                'uuid': uuidv4(),
                'type': 'success',
                'content': S_content,
                'style_set': 'animate__swing',
                'color': 'var(--success)',
            }
            this.addConsole(D_content, F_time)
        },
    },
})