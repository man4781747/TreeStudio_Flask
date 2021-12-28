var Vue_mainToolBox =  new Vue({
    el: '#main-toolbox',
    data: {
        chosedPage: 'Home',
        smallToolBox: false,
        urlParas: {},
        D_labelList: {
            'Home': {
                'Name': 'Home',
                'Type': 'Home',
                'icon': 'fas fa-home',
            },
            'AnnouncementList': {
                'Name': '公告列表',
                'Type': 'Page',
                'icon': 'fas fa-bullhorn',
            },            
            // 'OrderSystem': {
            //     'Name': '訂餐系統',
            //     'Type': 'Page',
            //     'icon': 'fas fa-utensils',
            // },        
            'OrderSystem_List': {
                'Name': '訂餐系統',
                'Type': 'List', 
                'opened': false,
                'icon': 'fas fa-utensils',
                'height' : 0,
                'id' : 'order_system_list',
                'List': [
                    {
                        'Name': '今日點餐',
                        'Type': 'Page',
                        'icon': 'far fa-circle',
                    },
                    {
                        'Name': '訂餐設定',
                        'Type': 'Page',
                        'icon': 'far fa-circle',
                    },
                ]
            },         
            
            'Wiki_Link': {
                'Name': 'WIKI 知識庫',
                'Type': 'URL',
                'URL': 'http://10.95.43.73:8001',
                'icon': 'fab fa-wikipedia-w',
                'title': 'Wiki 知識庫',
                'content': '數據部專用知識庫，打上關鍵字找到你想要的資訊，限定公司內網使用唷!!',
            },
            'Gitlab_Link': {
                'Name': 'GitLab',
                'Type': 'URL',
                'URL': 'http://10.95.43.73:8001',
                'icon': 'fab fa-gitlab',
                'title': 'GitLab',
                'content': '數據部專用程式庫，打上關鍵字找到你想要的專案程式，限定公司內網使用唷!!',
            },
            'Jira_Link': {
                'Name': 'Jira',
                'Type': 'URL',
                'URL': 'https://pm.cathaylife.com.tw',
                'icon': 'fab fa-jira',
                'title': 'Jira 專案管理工具',
                'content': '公司的專案管理工具，內外網都可以使用。',
            },
            'Tools': {
                'Name': '常用連結及工具',
                'Type': 'List', 
                'opened': false,
                'icon': 'fas fa-link',
                'height' : 0,
                'id' : 'main-toolbox-list-tools',
                'List': [
                    {
                        'Name': 'Gather 虛擬辦公室',
                        'Type': 'URL',
                        'URL': 'https://gather.town/app/Kfcmm6p8EEN5MwDm/cathaylife',
                        'icon': 'far fa-circle',
                        'title': 'Gather 虛擬辦公室',
                        'content': '數據部虛擬辦公室，密碼為 cathaylife，建議使用電腦版登入使用。',
                    },
                    {
                        'Name': 'Data Flow Chart',
                        'Type': 'URL',
                        'URL': 'http://10.95.42.31:8000/',
                        'icon': 'far fa-circle',
                        'title': 'AIRJOB: 客戶智能科',
                        'content': 'AIRJOB為以Airflow為底層延伸設計的自主排程系統。',
                    },
                    {
                        'Name': 'PixlrX 線上繪圖',
                        'Type': 'URL',
                        'URL': 'https://pixlr.com/tw/x/',
                        'icon': 'far fa-circle',
                        'title': 'AIRJOB: 商業智能科',
                        'content': 'AIRJOB為以Airflow為底層延伸設計的自主排程系統。',
                    },
                ]
            },
        },
    },

    methods:{
        changePage(labelItem,S_page){
            Vue.set(
                this.urlParas,
                'page',
                S_page
            )
            this.updateUrlParas()
            CloseIframe()
            this.chosedPage = S_page
            if (S_page == 'Home'){
                Vue_homeAnnouncementWindow.item_create = true
                Vue_TodayOrderInfo.item_create = true

                let element = document.getElementById("home-grid");
                element.style.display = '';
                try {
                    Vue_homeAnnouncementWindow.updateTableInfoList()
                    Vue_TodayOrderInfo.updateTodayOrderList()
                }
                catch {
                    v_console.debug('最新消息更新失敗')
                }
            } else {
                let element = document.getElementById("home-grid");
                element.style.display = 'none';
                Vue_homeAnnouncementWindow.item_create = false
                Vue_TodayOrderInfo.item_create = false
            } 
            if (S_page == 'System.公告管理系統'){
                let element = document.getElementById("hap-announcement-manage-window");
                element.style.display = '';
            } else {
                let element = document.getElementById("hap-announcement-manage-window");
                element.style.display = 'none';
            } 


            if (S_page == 'OrderSystem_List.今日點餐'){
                Vue_OrderSystem_OrderList.item_create = true
                Vue_OrderSystem_OrderList.openTodayListWindow()
            } else {
                Vue_OrderSystem_OrderList.item_create = false
            } 

            if (S_page == 'OrderSystem_List.訂餐設定'){
                Vue_OrderSystem_OrderSetting.item_create = true
                Vue_OrderSystem_OrderSetting.updateShopList()
            } else {
                Vue_OrderSystem_OrderSetting.item_create = false
            } 

            
            if (S_page == 'AnnouncementList'){
                let element = document.getElementById("hap-announcement-list-window");
                element.style.display = '';
                Vue_announcementListManager.updateAnnouncementList()
            } else {
                let element = document.getElementById("hap-announcement-list-window");
                element.style.display = 'none';
            } 

            // if (S_page == 'OrderSystem'){
            //     let element = document.getElementById("order-system-window");
            //     element.style.display = '';
            //     Vue_OrderSystem.openOrderListWindow()
            // } else {
            //     let element = document.getElementById("order-system-window");
            //     element.style.display = 'none';
            // } 

            if (labelItem.Type == 'URL'){
                let element = document.getElementById("url-description-window");
                element.style.display = '';
                Vue_URLDescriptionWindow.title = labelItem.title
                Vue_URLDescriptionWindow.content = labelItem.content

            } else {
                let element = document.getElementById("url-description-window");
                element.style.display = 'none';
            } 

        },

		updateUrlParas(){
			S_urlParastring = new URLSearchParams(this.urlParas).toString();
			S_fullUrlPath = "?" + S_urlParastring
			history.pushState(null,null,S_fullUrlPath)
		},

		loadUrlParas(){
			var D_paras = {}
			let params = new URL(location.href).searchParams
			for (let pair of params.entries()) {
				D_paras[pair[0]] = pair[1]
			}
			this.urlParas = D_paras
			//console.log(this.urlParas)
			this.actionByUrlParas()
		},

		actionByUrlParas(){
			if (this.urlParas['user'] == 'admin'){
                Vue.set(
                    this.D_labelList,
                    'System',
                    {
                        'Name': '系統相關',
                        'Type': 'List',
                        'icon': 'fas fa-sliders-h',
                        'opened': false,
                        'height' : 0,
                        'id' : 'main-toolbox-list-System',
                        'List': [
                            {
                                'Name': '公告管理系統',
                                'Type': 'Page',
                                'icon': 'far fa-circle',
                            },
                        ],
                    }
                )

			}
			if (this.urlParas['page'] != undefined){
                let L_pageName = this.urlParas['page'].split('.')
                if (L_pageName.length == 1){
                    let S_pageName = L_pageName[0]
                    if (this.D_labelList[S_pageName] == undefined) {
                        this.changePage({}, "Home")
                    }
                    else {
                        ////console.log(this.D_labelList[S_pageName])
                        this.changePage(this.D_labelList[S_pageName], S_pageName)
                    }

                }
                else if (L_pageName.length == 2){
                    let S_pageName = L_pageName[0]
                    let S_listName = L_pageName[1]
                    if (this.D_labelList[S_pageName] == undefined) {
                        this.changePage({}, "Home")
                    }
                    else {
                        if (this.D_labelList[S_pageName].List == undefined) {
                            this.changePage({}, "Home")
                        }
                        else {
                            ////console.log(S_pageName,'->',S_listName)
                            this.D_labelList[S_pageName].opened = true
                            for (listItem of this.D_labelList[S_pageName].List){
                                if (listItem.Name == S_listName){
                                    this.changePage(listItem, S_pageName+'.'+S_listName)
                                }
                            }
                        }
                    }


                }
                else {
                    this.changePage({}, "Home")
                }
			}
            else {
                this.changePage({}, "Home")
            }

		},

        calcListItemHeight(){
            for (itemKey of Object.keys(this.D_labelList)){
                if (this.D_labelList[itemKey].Type == "List"){
                    this.D_labelList[itemKey].height = document.getElementById(this.D_labelList[itemKey].id).offsetHeight
                }
            }
        },

    },

    created: function () {
        // this.changePage({},'Home')
        // this.loadUrlParas()
    },

    updated: function () {
        this.calcListItemHeight()
    },
})
