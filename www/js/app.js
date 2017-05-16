angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.services.common','starter.config','starter.encryption','starter.directive.common'])

.run(function($ionicPlatform,$ionicGesture,$rootScope,commonSer,CONSTANT) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    //点击空白处关闭弹窗
    var $htmlEl= angular.element(document.querySelector('html'));
    $ionicGesture.on("touch", function(event) {
      if (event.target.nodeName === "HTML" || event.target.className === 'icon ion-close-round assertive popup-icon-close') {
          if($rootScope.myPopup){
              $rootScope.myPopup.close();
          }
      }
    },$htmlEl);


  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider ){

  $ionicConfigProvider.platform.ios.tabs.style("standard");
  $ionicConfigProvider.platform.ios.tabs.position("bottom");
  $ionicConfigProvider.platform.android.tabs.style("standard");
  $ionicConfigProvider.platform.android.tabs.position("bottom");
  $ionicConfigProvider.platform.ios.navBar.alignTitle("center");
  $ionicConfigProvider.platform.android.navBar.alignTitle("center");
  /*$ionicConfigProvider.views.transition('none');//禁止动画效果*/
  $ionicConfigProvider.views.swipeBackEnabled(false);//禁止ionic右滑返回
  $ionicConfigProvider.platform.ios.views.transition('none');
  $ionicConfigProvider.platform.android.views.transition("android");
  $ionicConfigProvider.backButton.text("").icon("ion-ios-arrow-left");


  $stateProvider

  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller:'mainController'
  })
  .state('wxIndex', {
    url: '/wxIndex',
    templateUrl: 'templates/wxIndex.html',
    controller:'wxIndexController'
  })
  .state('login', {
    url: '/login?:state',
    templateUrl: 'templates/login.html',
    controller:'loginController'
  })
  /*政策核对单申诉*/
  .state('checkComplaint', {
    url: '/checkComplaint',
    templateUrl: 'templates/customerComplaint/checkComplaint.html',
    controller: 'checkClaController'
  })
    .state('checkComplaintDetail', {
      url: '/checkComplaintDetail?:id',
      templateUrl: 'templates/customerComplaint/checkComplaintDetail.html',
      controller: 'checkClaDelController'
    })
  .state('checkSelect', {
    url: '/checkSelect',
    templateUrl: 'templates/customerComplaint/checkSelect.html',
    controller: 'checkSelController'
  })
  .state('checkConfirm', {
    url: '/checkConfirm',
    templateUrl: 'templates/customerComplaint/checkConfirm.html',
    controller: 'checkCfmController'
  })
  .state('rebateComplaint', {
    url: '/rebateComplaint',
    templateUrl: 'templates/customerComplaint/rebateComplaint.html',
    controller: 'rebateClaController'
  })
  .state('rebateSelect', {
    url: '/rebateSelect',
    templateUrl: 'templates/customerComplaint/rebateSelect.html',
    controller: 'rebateSelectController'
  })
  .state('differentConfirm', {
    cache:false,
    url: '/differentConfirm?:auditId',
    templateUrl: 'templates/SettlementManage/differentConfirm.html',
    controller: 'differentCfmController'
  })
  .state('differentSelect',{
      cache:false,
      url: '/differentSelect',
      templateUrl: 'templates/SettlementManage/differentSelect.html',
      controller: 'differentSelController'
  })
    .state('differentConfirmDetailFh', {//发货 auditId：tab状态（1已确认 0未确认）diffDetailId：详情rowid
      cache:false,
      url: '/differentConfirmDetailFh?:auditId:diffDetailId',
      templateUrl: 'templates/SettlementManage/differentConfirmDetail-fh.html',
      controller: 'differentCfmDetailFhController'
    })
    .state('differentConfirmDetailFy', {//费用 auditId：tab状态（1已确认 0未确认）diffDetailId：详情rowid
      cache:false,
      url: '/differentConfirmDetailFy?:auditId:diffDetailId',
      templateUrl: 'templates/SettlementManage/differentConfirmDetail-fy.html',
      controller: 'differentCfmDetailFyController'
    })
    .state('differentConfirmDetailRk', {//入库 auditId：tab状态（1已确认 0未确认）diffDetailId：详情rowid
      cache:false,
      url: '/differentConfirmDetailRk?:auditId:diffDetailId',
      templateUrl: 'templates/SettlementManage/differentConfirmDetail-rk.html',
      controller: 'differentCfmDetailRkController'
    })
    .state('differentConfirmDetailTh', {//退货 auditId：tab状态（1已确认 0未确认）diffDetailId：详情rowid
      cache:false,
      url: '/differentConfirmDetailTh?:auditId:diffDetailId',
      templateUrl: 'templates/SettlementManage/differentConfirmDetail-th.html',
      controller: 'differentCfmDetailThController'
    })
  .state('overseeMessage', {//auditId tab状态
    cache:false,
    url: '/overseeMessage?auditId',
    templateUrl: 'templates/SettlementManage/overseeMessage.html',
    controller: 'overseeMsgController'
  })
  .state('overseeMessageSel', {
      cache:false,
      url: '/overseeMessageSel',
      templateUrl: 'templates/SettlementManage/overseeMessageSel.html',
      controller: 'overseeMsgSelController'
  })
    .state('overseeMessageDetail',{//auditId：tab状态（1已确认 0未确认）messageId：详情rowid
      cache:false,
      url:'/overseeMessageDetail?:auditId:messageId',
      templateUrl: 'templates/SettlementManage/overseeMessageDetail.html',
      controller: 'overseeMessageDelController'
    })
  .state('costConfirm', {
    cache:false,
    url: '/costConfirm?auditId',
    templateUrl: 'templates/SettlementManage/costConfirm.html',
    controller: 'costConfirmController'
  })
  .state('costSelect',{
      cache:false,
      url: '/costSelect',
      templateUrl: 'templates/SettlementManage/costSelect.html',
      controller: 'costSelController'
  })
    .state('costConfirmDetail', {//auditId：tab状态（1已确认 0未确认）costDetailId：详情rowid
      cache:false,
      url: '/costConfirmDetail?:auditId:costDetailId',
      templateUrl: 'templates/SettlementManage/costConfirmDetail.html',
      controller: 'costConfirmDelController'
    })
      .state('error',{
          url: '/error',
          templateUrl: 'templates/error.html'
      })

  ;

  $urlRouterProvider.otherwise('/main');

});
