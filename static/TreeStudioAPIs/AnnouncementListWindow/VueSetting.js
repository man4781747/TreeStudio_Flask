var Vue_announcementListManager =  new Vue({
    el: '#hap-announcement-list-window',
    data: {
        window_chose: 'list_window',
        summernote_id : '#summernote-announcement-manager',
        createAnnouncement: {},
        tableInfoList: [],
        announcementListUpdating: false,
        announcementInfoUpdating: false,
        infoWindowInfo: {},

        pageChose : 0,
        pageListChose : 0,
        pageMaxNum: 100,

        filterStr: '',
        sortBy: 'created',
        sortValue: -1,
        title_filter: {
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

        editable(){
			if (Vue_mainToolBox.urlParas['user'] == 'admin'){
                return true
			}
            return false
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
                Vue_announcementListManager.tableInfoList = myJson['data']
                Vue_announcementListManager.announcementListUpdating = false
			});
        },

        openInfoWindow(S_idChose){
            this.announcementInfoUpdating = true
			fetch('/TreeStudioAPIs/Announcement_Manager/'+S_idChose+'/', {
                method: 'GET'
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
                // console.log(myJson['data'])
                Vue_announcementListManager.announcementInfoUpdating = false
                myJson['data'].created = (new Date(myJson['data'].created)).format('Y-MM-dd hh:mm:ss')
                myJson['data'].last_modify_date = (new Date(myJson['data'].last_modify_date)).format('Y-MM-dd hh:mm:ss')
                Vue_announcementListManager.infoWindowInfo = myJson['data']
                $("#summernote-announcement-shower").summernote('code',Vue_announcementListManager.infoWindowInfo.content);
			});
            this.window_chose="info_window"
        },

        openEditWindow(S_idChose){
            Vue_mainToolBox.changePage(Vue_mainToolBox.D_labelList["System"], "System.公告管理系統")
            Vue_announcementManager.openEditWindow(S_idChose)
        },
    },

    created: function () {
    },

    mounted(){
        this.updateAnnouncementList()
        $(document).ready(function() {
            $("#summernote-announcement-shower").summernote({
                placeholder: '請輸入公告內容',
                height: 500,
                lang: 'zh-TW',
                toolbar: [],
            });
            $("#summernote-announcement-shower").summernote('disable');
            // $("#summernote-announcement-manager-editer").summernote('code',editWindowInfo.content)
        });

    },

    updated: function () {
    },
})
