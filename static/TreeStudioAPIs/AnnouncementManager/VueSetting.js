var Vue_announcementManager =  new Vue({
    el: '#hap-announcement-manage-window',
    data: {
        TreeLoginInof : TreeLoginInof,

        window_chose: 'create_window',
        summernote_id : '#summernote-announcement-manager',
        createAnnouncement: {},
        tableInfoList: [],
        announcementListUpdating: false,
        announcementEditUpdating: false,

        popwindowBtnKey_editer: '',
        popwindowInfoItem_editer: {},
        popwindowOpen_editer: false,
        popwindowPositionX_editer: '0px',
        popwindowPositionY_editer: '0px',
        popwindowClass_editer: '',

        editWindowInfo: {},

        pageChose : 0,
        pageListChose : 0,
        pageMaxNum: 100,

        filterStr: '',
        sortBy: 'created',
        sortValue: -1,
        title_filter: {
            id : {
                'filter_str': '',
                'open': false,
                'show_name': '#',
            },
            created : {
                'filter_str': '',
                'open': false,
                'show_name': '時間',
            },
            who : {
                'filter_str': '',
                'open': false,
                'show_name': '公告者',
            },
            title : {
                'filter_str': '',
                'open': false,
                'show_name': '標題',
            },
        },
    },

    computed: {
        checkCreateAnnouncementInfo(){
            let wraningList = []
            // if (this.createAnnouncement.who == ''){
            //     wraningList.push('公告人不得為空')
            // }
            if (this.TreeLoginInof.login_info.user_name == ''){
                wraningList.push('請登入')
            }
            if (this.createAnnouncement.title == ''){
                wraningList.push('公告標題不得為空')
            }

            return wraningList
        },

        checkEditerAnnouncementInfo(){
            let wraningList = []
            // if (this.editWindowInfo.who == ''){
            //     wraningList.push('公告人不得為空')
            // }            
            // if (this.TreeLoginInof.login_info.user_name == ''){
            //     wraningList.push('請登入')
            // }
            if (this.editWindowInfo.title == ''){
                wraningList.push('公告標題不得為空')
            }

            return wraningList
        },

		tableData(){
            if (this.sortBy != ""){
                afterSortList = []
                var sortByList = []
                for (let itemInfo of this.tableInfoList){
                    sortByList.push([itemInfo[this.sortBy],itemInfo])
                }
                
                if (this.sortBy == 'id'){
                    sortByList.sort(function(a, b) {
                        return a - b;
                      });
                } else {
                    sortByList.sort()
                }

                if (this.sortValue == -1){
                    sortByList.reverse()
                }
                for (let itemInfo_after of sortByList){
                    afterSortList.push(itemInfo_after[1])
                }
            } else {
                afterSortList = this.tableInfoList
            }

            var afterTitleFilterList = afterSortList
            for (let S_titleChose of Object.keys(this.title_filter)){
                if (this.title_filter[S_titleChose].filter_str.trim()==""){
                    continue
                }
                else {
                    afterTitleFilterList_chose = []
                    for (let itemInfo of afterTitleFilterList){
                        if (itemInfo[S_titleChose].indexOf(this.title_filter[S_titleChose].filter_str.trim())!= -1){
                            afterTitleFilterList_chose.push(itemInfo)
                        }
                    }
                    afterTitleFilterList = afterTitleFilterList_chose
                }
            }

            var afterFilterList = []
            if (this.filterStr.trim()==""){
                afterFilterList = afterTitleFilterList
            } else {
                for (let itemInfo of afterTitleFilterList){
                    for (key of Object.keys(this.title_filter)){
                        if ((''+itemInfo[key]).indexOf(this.filterStr.trim())!= -1){
                            afterFilterList.push(itemInfo)
                            break
                        }
                    }
                }
            }
            var tableData = [[]]
            for (let itemIndex in afterFilterList){
                let I_page = Math.floor(itemIndex/this.pageMaxNum)
                if (tableData[I_page] == undefined){
                    tableData[I_page] = []
                }
                tableData[I_page].push(afterFilterList[itemIndex])
            }
            if (this.pageChose >=  tableData.length){
                this.pageChose = tableData.length - 1
            }
            return tableData
        },

        pageList(){
            var pageListList = [[]]
            for (let pageIndex in this.tableData){
                let I_listInex = Math.floor(pageIndex/5)
                if (pageListList[I_listInex] == undefined){
                    pageListList[I_listInex] = []
                }
                pageListList[I_listInex].push(pageIndex)
            }

            if (this.pageListChose >=  pageListList.length){
                this.pageListChose = pageListList.length - 1
            }

            return pageListList
        },

        tableRawNum(){
            let totalCount = 0
            for (L_pageList of this.tableData){
                totalCount = totalCount + L_pageList.length
            }
            return totalCount
        },

        tablePageNum(){
            let totalCount = 0
            for (L_pageList of this.pageList){
                totalCount = totalCount + L_pageList.length
            }
            return totalCount
        },

    },

    methods:{
        sortByBtmChose(sortByStr){
            if (this.sortBy == sortByStr){
                this.sortValue = this.sortValue * -1
            } else {
                this.sortValue = 1
            }
            this.sortBy = sortByStr
        },

        initAnnouncementInfo(){
            this.createAnnouncement = {
                'who' : TreeLoginInof['login_info']['user_name'],
                'title': '',
            }
            $(this.summernote_id).summernote('code', '')
        },

        createNewAnnouncement(){
			var form = new FormData();
			form.append("who", this.TreeLoginInof['login_info']['user_name'])
            form.append("title", this.createAnnouncement['title'])
            form.append("content", GetEditerContent(this.summernote_id))

			fetch('/TreeStudioAPIs/Announcement_Manager/', {
                // method: 'GET'
				method: 'POST',
				body: form,
                mode: 'same-origin',
                // headers: {'X-CSRFToken': csrftoken}
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				console.log(myJson);
                v_console.success("公告新增完成")
                Vue_announcementManager.initAnnouncementInfo()
                Vue_announcementManager.updateAnnouncementList()
			});
        },

        updateAnnouncementList(){
            this.announcementListUpdating = true
			fetch('/TreeStudioAPIs/Announcement_Manager/', {
                method: 'GET'
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
                I_index = 1
                for (let item of myJson['data']){
                    item.created = (new Date(item.created)).format('Y-MM-dd hh:mm:ss')
                    item.last_modify_date = (new Date(item.last_modify_date)).format('Y-MM-dd hh:mm:ss')
                }
                Vue_announcementManager.tableInfoList = myJson['data']
                Vue_announcementManager.announcementListUpdating = false
			});
        },

        openEditWindow(S_id){
            this.announcementEditUpdating = true
			fetch('/TreeStudioAPIs/Announcement_Manager/'+S_id+'/', {
                method: 'GET'
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
                Vue_announcementManager.announcementEditUpdating = false
                myJson['data'].created = (new Date(myJson['data'].created)).format('Y-MM-dd hh:mm:ss')
                myJson['data'].last_modify_date = (new Date(myJson['data'].last_modify_date)).format('Y-MM-dd hh:mm:ss')

                Vue_announcementManager.editWindowInfo = myJson['data']
                Vue_announcementManager.window_chose="edit_window"
                $(document).ready(function() {
                    $("#summernote-announcement-manager-editer").summernote({
                        placeholder: '請輸入公告內容',
                        height: 500,
                        lang: 'zh-TW',
                        toolbar: [
                            ['style', ['style']],
                            ['font', ['bold', 'underline', 'clear']],
                            ['fontname', ['fontname']],
                            ['color', ['color']],
                            ['para', ['ul', 'ol', 'paragraph']],
                            ['table', ['table']],
                            ['insert', ['link', 'picture', 'video']],
                            ['height', ['height']],
                            ['view', ['codeview', 'help']],
                        ],
                    });
    
    
                    $("#summernote-announcement-manager-editer").summernote('code',Vue_announcementManager.editWindowInfo.content)
                });
			});
        },

        closePopWindow(){
            this.popwindowOpen_editer = false
        },

        openPopWindow(event, popwindowInfoItem, S_btn_key){
            this.popwindowBtnKey_editer = S_btn_key
            this.popwindowInfoItem_editer = popwindowInfoItem
            D_positionInfo = getPosition(document.getElementById(this.popwindowBtnKey_editer))
            this.popwindowPositionX_editer = D_positionInfo.x + 'px'
            this.popwindowPositionY_editer =  (D_positionInfo.y - document.documentElement.scrollTop)  + 'px'
            this.popwindowClass_editer = 'pop-window-info-box-close'

            this.popwindowOpen_editer = true
            setTimeout(function(){
                Vue_announcementManager.popwindowPositionX_editer = '0px'
                Vue_announcementManager.popwindowPositionY_editer = '0px'
                Vue_announcementManager.popwindowClass_editer = 'pop-window-info-box-open'
            },10);

            $(document).ready(function() {
                $("#summernote-announcement-manager-"+popwindowInfoItem.id).summernote({
                    placeholder: '請輸入公告內容',
                    height: 100,
                    lang: 'zh-TW',
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'underline', 'clear']],
                        ['fontname', ['fontname']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['height', ['height']],
                        ['view', ['codeview', 'help']],
                    ],
                });


                $("#summernote-announcement-manager-"+popwindowInfoItem.id).summernote('code',popwindowInfoItem.content)
            });
        },

        updateAnnouncement(){
			var form = new FormData();
            form.append("id", this.editWindowInfo['id'])
			form.append("who", this.editWindowInfo['who'])
            form.append("title", this.editWindowInfo['title'])
            form.append("content", GetEditerContent("#summernote-announcement-manager-editer"))

			fetch('/TreeStudioAPIs/Update_Announcement/', {
                // method: 'GET'
				method: 'POST',
				body: form,
                mode: 'same-origin',
                // headers: {'X-CSRFToken': csrftoken}
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				// console.log(myJson);
                v_console.success("公告編輯成功")
                Vue_announcementManager.window_chose = 'list_window'
                Vue_announcementManager.updateAnnouncementList()
			});
        },

        deleteAnnouncement(D_chose){
			fetch('/TreeStudioAPIs/Announcement_Manager/'+D_chose['id']+'/', {
				method: 'DELETE',
                mode: 'same-origin',
                // headers: {'X-CSRFToken': csrftoken}
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				v_console.success("公告刪除成功")
                Vue_announcementManager.window_chose = 'list_window'
                Vue_announcementManager.updateAnnouncementList()
			});
        },
    },

    created: function () {
    },

    mounted(){
        $(document).ready(function() {
            $(Vue_announcementManager.summernote_id).summernote({
                placeholder: '請輸入公告內容',
                height: 500,
                lang: 'zh-TW',
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['fontname', ['fontname']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['height', ['height']],
                    ['view', ['codeview', 'help']],
                ],
            });
            Vue_announcementManager.initAnnouncementInfo()
            Vue_announcementManager.updateAnnouncementList()
        });
    },

    updated: function () {
    },
})

function GetEditerContent(S_summernote_id){
    return $(S_summernote_id).summernote('code');
}