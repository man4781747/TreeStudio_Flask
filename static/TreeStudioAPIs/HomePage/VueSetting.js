Vue.component("airjob-icon", {
    template:`
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 640">
	.stroke-color-in {opacity:1;stroke:#000;stroke-opacity:1;stroke-width:15;fill-opacity:0;}
	.stroke-color-out {opacity:1;stroke:#000;stroke-opacity:1;stroke-width:30;fill-opacity:0;}
	.fill-color {opacity:1;stroke-width:0;fill-opacity:0.3;}
	.color-set {stroke:#000;fill: #000;}
	<path d="M94.65 349.2L549.06 289.67L412.69 416.84L321.86 319.44L231.02 222.03L94.65 349.2Z" id="bFgXp3xrX" class='fill-color color-set'></path>
	<path d="M222.52 418.37L349.69 554.74L290.16 100.33L417.33 236.71L222.52 418.37Z" id="a3feXnH4le" class='fill-color color-set'></path>
	<path d="M223.59 411.83L350.76 548.21L593.5 613.23L321 321L48.5 28.77L291.24 93.79L415.62 227.18" id="b4YLxv1gSc" class='stroke-color-out color-set'></path>
	<path d="M230.17 223.59L93.79 350.76L28.77 593.5L613.23 48.5L548.21 291.24L411.83 418.41" id="c11ZHHKkMx" class='stroke-color-out color-set'></path>
	<path d="M548.21 291.24L93.79 350.76" id="cohdEDYf4" class='stroke-color-in color-set'></path>
	<path d="M291.24 93.79L350.76 548.21" id="l1X2Zp4VNT" class='stroke-color-in color-set'></path>
	</svg>
    `,
})

Vue.component("airflow-icon", {
	template:`
<svg class="brand-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
	<g class="brand-logo-pinwheel">
		<path d="M0.861099 35.3873L17.7729 18.0515C17.8788 17.9429 17.8991 17.775 17.8108 17.6516C16.782 16.2156 14.8848 15.9667 14.1814 15.002C12.0981 12.1441 11.5695 10.5266 10.6743 10.6269C10.6117 10.6339 10.556 10.6676 10.512 10.7126L4.4026 16.9752C0.887961 20.5779 0.383943 28.5103 0.291509 35.1524C0.287333 35.4525 0.651482 35.6021 0.861099 35.3873Z" fill="#017cee"></path>
		<path d="M35.4734 34.9588L18.1375 18.047C18.0289 17.941 17.861 17.9207 17.7377 18.0091C16.3017 19.0378 16.0528 20.9351 15.088 21.6384C12.2302 23.7217 10.6126 24.2504 10.7129 25.1456C10.72 25.2082 10.7536 25.2639 10.7987 25.3077L17.0613 31.4172C20.664 34.9319 28.5964 35.4359 35.2385 35.5282C35.5386 35.5326 35.6882 35.1684 35.4734 34.9588Z" fill="#00ad46"></path>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M17.0612 31.4173C15.0932 29.4975 14.1801 25.6994 17.953 17.8671C11.8213 20.6074 9.67257 24.2094 10.7296 25.2407L17.0612 31.4173Z" fill="#04d659"></path>
		<path d="M35.0445 0.346896L18.1327 17.6827C18.0268 17.7913 18.0065 17.9592 18.0948 18.0825C19.1236 19.5186 21.0209 19.7674 21.724 20.7322C23.8075 23.59 24.3362 25.2075 25.2313 25.1074C25.2938 25.1004 25.3496 25.0666 25.3936 25.0216L31.5029 18.759C35.0177 15.1562 35.5217 7.22392 35.6141 0.58175C35.6182 0.281597 35.2541 0.132024 35.0445 0.346896Z" fill="#00c7d4"></path>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M31.5031 18.759C29.5832 20.7269 25.7851 21.6401 17.9528 17.8671C20.693 23.9988 24.2951 26.1477 25.3263 25.0905L31.5031 18.759Z" fill="#11e1ee"></path>
		<path d="M0.432658 0.775339L17.7685 17.6871C17.8771 17.793 18.045 17.8134 18.1683 17.725C19.6043 16.6963 19.8532 14.799 20.8179 14.0957C23.6759 12.0123 25.2934 11.4837 25.193 10.5885C25.186 10.526 25.1523 10.4702 25.1074 10.4263L18.8447 4.31685C15.242 0.802203 7.30967 0.298184 0.667512 0.205751C0.367359 0.201573 0.217786 0.565722 0.432658 0.775339Z" fill="#e43921"></path>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M18.8446 4.31675C20.8125 6.23662 21.7257 10.0346 17.9528 17.8669C24.0844 15.1267 26.2333 11.5246 25.1761 10.4934L18.8446 4.31675Z" fill="#ff7557"></path>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M4.4028 16.9752C6.32267 15.0072 10.1207 14.0942 17.953 17.867C15.2128 11.7354 11.6107 9.58661 10.5795 10.6437L4.4028 16.9752Z" fill="#0cb6ff"></path>
		<path d="M17.9649 18.6209C18.3825 18.6157 18.7169 18.273 18.7117 17.8553C18.7065 17.4377 18.3638 17.1034 17.9462 17.1085C17.5285 17.1137 17.1942 17.4564 17.1994 17.8741C17.2045 18.2917 17.5473 18.626 17.9649 18.6209Z" fill="#4a4848"></path>
	</g>
</svg>
	`
})

Vue.component("home-page-small-item", {
	template:`
	<div class="box-small-card" id ="test-view">
		<div class="box-small-card-content">
			<slot name="icon">
				<i class="fas fa-dice-d6"></i>
			</slot>
			<div class='box-small-card-title'>
				<slot name="title">
					<p>Default title</p>
				</slot>
			</div>
		</div>
		<div class="box-small-card-word">
			<slot name="content">
				<p>Default Content</p>
			</slot>
		</div>
	</div>
	`
})

// var Vue_AirflowView =  new Vue({
// 	el: '#teradata-info-small',
// 	data: {
// 		title: 'Teradata 分析型資料庫',
// 		content: "1171 Tables",
// 	},
// })

// var Vue_AirflowView =  new Vue({
// 	el: '#feature-store-info-small',
// 	data: {
// 		title: 'Feature Store 特徵庫',
// 		content: "102 Tables",
// 	},
// })

// var Vue_AirflowView =  new Vue({
// 	el: '#airflow-view',
// 	data: {
// 		dagIDList : [],
// 		isHovering: false,
// 		airjobURL: airjobURL,
// 	},
// 	computed: {
// 		dagJobNum(){

// 			return this.dagIDList.length
// 		},
// 	},
// 	methods:{
// 		updateDAGIDtList(){
// 			fetch(this.airjobURL + 'AirFlowUploadWeb/GetAllDAGIDList/')
// 			.then(function(response) {
// 				return response.json()
// 			})
// 			.then(function(myJson) {
// 				// console.log(myJson['dag_list'])
// 				Vue_AirflowView.dagIDList = myJson['dag_list']
// 			});
// 		},
// 	},

// 	mounted: function(){
// 		this.updateDAGIDtList()
// 	},
// })

// var Vue_AirjobView =  new Vue({
// 	el: '#airjob-view',
// 	data: {
// 		massage: '030',
// 		dagIDList : [],
// 		projectList: [],
// 		airjobURL: airjobURL,
// 	},
// 	computed: {
// 		dagJobNum(){
// 			dagJobNum = 0
// 			for (S_dagId of this.dagIDList){
// 				for (projectName of this.projectList) {
// 					if (S_dagId.indexOf(projectName+'_') == 0){
// 						dagJobNum = dagJobNum + 1
// 						break
// 					}
// 				}
// 			}

// 			return dagJobNum
// 		},
// 	},
// 	methods:{
// 		updateDAGIDtList(){
// 			fetch(this.airjobURL + 'AirFlowUploadWeb/GetAllDAGIDList/')
// 			.then(function(response) {
// 				return response.json()
// 			})
// 			.then(function(myJson) {
// 				// console.log(myJson['dag_list'])
// 				Vue_AirjobView.dagIDList = myJson['dag_list']
// 			});
// 		},

// 		updateProjectList(){
// 			fetch(this.airjobURL + 'AirFlowUploadWeb/API/v1/GetAllProjectList/')
// 			.then(function(response) {
// 				return response.json()
// 			})
// 			.then(function(myJson) {
// 				// console.log(myJson)
// 				Vue_AirjobView.projectList = myJson['ProjectList']
// 			});
// 		},
// 	},

// 	mounted: function(){
// 		this.updateProjectList()
// 		this.updateDAGIDtList()
// 	},
// })

var Vue_homeAnnouncementWindow = new Vue({
	el: '#announcement-list-window',
	data: {
		item_create:false,
		announcementListUpdating : false,
		tableInfoList: [],
	},
  
	computed: {
	},
  
	methods: {
		updateTableInfoList(){
            this.announcementListUpdating = true
			fetch('/TreeStudioAPIs/Get_Last_Ten_Announcement_List/', {
                method: 'GET'
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				for (let item of myJson['data']){
					item.created = (new Date(item.created)).format('Y-MM-dd hh:mm:ss')
					item.last_modify_date = (new Date(item.last_modify_date)).format('Y-MM-dd hh:mm:ss')
				}


                Vue_homeAnnouncementWindow.tableInfoList = myJson['data']
                Vue_homeAnnouncementWindow.announcementListUpdating = false
			});
		},

		OpenAnnouncementDetailWindow(S_id){
			Vue_mainToolBox.changePage({},'AnnouncementList')
			Vue_announcementListManager.openInfoWindow(S_id)
		},

		OpenAnnouncementListWindow(){
			Vue_mainToolBox.changePage({},'AnnouncementList')
		},
	},

	mounted: function(){
		this.updateTableInfoList()
	},
})

var Vue_TodayOrderInfo = new Vue({
	el: '#home-order-info-list-window',
	data: {
		item_create:false,
		
		todayOrderList: [],
		todayOrderListDetail: [],
		nowPage: 0,
		nowWindow: '',
		nextPage: null,
		nextWindow: '',
		changeable: true,
	},
  
	computed: {
	},
  
	methods: {
		updateTodayOrderList(){
			fetch('/TreeStudioAPIs/Get_Today_OrderInfo/', {
				method: 'GET'
			}).then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				Vue_TodayOrderInfo.todayOrderList = myJson['data']
				Vue_TodayOrderInfo.updateTodayOrderListDetail()
			}); 
		},

		updateTodayOrderListDetail(){
			this.todayOrderListDetail = []
			for (let D_orderInfo of this.todayOrderList){
				let orderDetail = {}
				this.getShopInfo(D_orderInfo.shop_id)
				.then(function(shop_data) {
					orderDetail['owner_name'] = D_orderInfo['owner_name']
					orderDetail['shop_name'] = D_orderInfo['shop_name']
					orderDetail['order_id'] = D_orderInfo['order_id']
					orderDetail['shop_id'] = D_orderInfo['shop_id']
					orderDetail['shop_type'] = D_orderInfo['shop_type']
					orderDetail['alive'] = D_orderInfo['alive']
					orderDetail['shop_picture'] = shop_data['shop_picture']
					Vue_TodayOrderInfo.todayOrderListDetail.push(orderDetail)
				})
			}
		},

		OpenOrderListWindow(order_id=null){
			Vue_mainToolBox.changePage({},'OrderSystem_List.今日點餐')
			if (order_id != null){
				Vue_OrderSystem_OrderList.openOrderWindow(order_id)
			}
		},

		getShopInfo(S_shopID){
			fetch_getShopInfo = fetch('/TreeStudioAPIs/OrderSys_ShopInfo_Manager/'+S_shopID+'/', {
				method: 'GET'
			})
			.then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				myJson['data']["shop_menu"] = JSON.parse(myJson['data']["shop_menu"])
				return myJson['data']
			});
			return fetch_getShopInfo
		},

		nextOrder(){
			if (this.changeable == false){
				return null
			}
			if (this.nowPage+1 >= this.todayOrderListDetail.length){
				this.nextPage = 0
			} else {
				this.nextPage = this.nowPage+1
			}
			this.nowWindow = "animate__fadeOutLeft"
			this.nextWindow = "animate__fadeInRight"
			this.changeable = false
			setTimeout(() => {
				Vue_TodayOrderInfo.nowWindow = ""
				Vue_TodayOrderInfo.nextWindow = ""
				this.nowPage = this.nextPage
				this.nextPage = null
				this.changeable = true

			}, 1000)
		},
		previousOrder(){
			if (this.changeable == false){
				return null
			}
			if (this.nowPage == 0){
				this.nextPage = this.todayOrderListDetail.length -1
			} else {
				this.nextPage = this.nowPage - 1
			}
			this.nowWindow = "animate__fadeOutRight"
			this.nextWindow = "animate__fadeInLeft"
			this.changeable = false
			setTimeout(() => {
				Vue_TodayOrderInfo.nowWindow = ""
				Vue_TodayOrderInfo.nextWindow = ""
				this.nowPage = this.nextPage
				this.nextPage = null
				this.changeable = true
			}, 1000)
		},
	},

	mounted: function(){
		this.updateTodayOrderList()
	},
})
