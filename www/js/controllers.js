angular.module('starter.controllers', [])

  //登录
  .controller('loginController',['$scope','$state','$stateParams','commonSer','loginSer','$ionicViewSwitcher','CONSTANT','$rootScope'
    ,function($scope,$state,$stateParams,commonSer,loginSer,$ionicViewSwitcher,CONSTANT,$rootScope) {
      $scope.user = {name:'',password:''};
      var wx_code = commonSer.GetQueryString("code");
      var stateId = commonSer.GetQueryString("state");

      //绑定
      function wxBinding (){
        commonSer.wxBinding(wx_code,$scope.user.name,$scope.user.password,9).then(function (res) {
          console.log(res);
          if(res&&res.CODE=="200"){
            //绑定存储用户信息并成功跳转
            commonSer.setLocal({"key":"account","data":res.DATAS.account});
            $rootScope.hasCheckedWx = true;
            $scope.toState(stateId);
          }else{
            $scope.user.password = ""; //清除上一次用户信息
          }
        });
      }

      $scope.login = function () {
        var checkRes = loginSer.checkUser($scope.user);
        if(checkRes == "success"){
          wxBinding();
        }else{
          commonSer.reminder(checkRes);
        }
      };

      //校验
      /*function wxCheck () {
        commonSer.wxCheck(wx_code,8).then(function (res) {
          console.log('test 校验');
          console.log(res);
          if(res&&res.CODE=="200"){
            //校验成功  跳转
            $scope.toState(stateId);
          }else{
            //失败  留在当前页面
          }
        });
      }

      //初始化
      function init (stateParam) {
        console.log(stateParam);
        if(stateParam){//需验证登录
          $scope.authorUrl = CONSTANT.wx_author_step1+'appid='+CONSTANT.wx_appId+'&redirect_uri='+CONSTANT.wx_redirect_uri+'&response_type=code&scope=snsapi_base&state='+stateParam+'#wechat_redirect';
          console.log($scope.authorUrl);
          window.location.href = $scope.authorUrl;
        }else {//不登录
          //获取code地址
          $scope.authorUrl = CONSTANT.wx_author_step1+'appid='+CONSTANT.wx_appId+'&redirect_uri='+CONSTANT.wx_redirect_uri+'&response_type=code&scope=snsapi_base&state='+stateId+'#wechat_redirect';
          console.log($scope.authorUrl);
          if(wx_code==null){
            window.location.href = $scope.authorUrl;
          }else{
            wxCheck();
          }
        }

      }

      var stateArr = stateId==null ? false : stateId.split("$$");
      if(stateArr.length==3){//二次进入绑定
        wxBinding(stateArr);
      }else {
        init(false);
      }

      //登录 绑定
      $scope.login = function () {
        var checkRes = loginSer.checkUser($scope.user);
        if(checkRes == "success"){
          stateId += "$$" + $scope.user.name + "$$" + $scope.user.password;
          init(stateId);
        }else{
          commonSer.reminder(checkRes);
        }
      };*/

      //跳转
      $scope.toState = function (id) {
        console.log("路由地址：--"+id);
        var stateUrl;
        switch (id) {
          case "main" :stateUrl = "main";break;//主页
          case "checkComplaint" :stateUrl = "checkComplaint";break;//政策核对单申诉
          case "checkSelect" :stateUrl = "checkSelect";break;//政策核对申诉查询
          case "checkConfirm" :stateUrl = "checkConfirm";break;//资金对账申诉确认
          case "rebateComplaint" :stateUrl = "rebateComplaint";break;//返利对账差异申诉
          case "rebateSelect" :stateUrl = "rebateSelect";break;//对账差异申诉查询
          case "differentConfirm" :stateUrl = "differentConfirm";break;//日常差异确认
          case "overseeMessage" :stateUrl = "overseeMessage";break;//督办消息
          case "costConfirm" :stateUrl = "costConfirm";break;//费用确认
          case "finalDiffConfirm" :stateUrl = "finalDiffConfirm";break;//期末对账差异确认
          case "finalDiffSelect" :stateUrl = "finalDiffSelect";break;//期末差异查询
        }
        $state.go(stateUrl);
        $ionicViewSwitcher.nextDirection('forward');
      };


  }])

  //微信统一入口（暂不使用）
  .controller('wxIndexController',['$scope','$state','CONSTANT','commonSer'
    ,function($scope,$state,CONSTANT,commonSer) {
      var stateId = commonSer.GetQueryString("stateId");//获取目标路径id


      $scope.authorUrl = CONSTANT.wx_author_step1+'appid='+CONSTANT.wx_appId+'&redirect_uri='+CONSTANT.wx_redirect_uri+'&response_type=code&scope=snsapi_base&state='+stateId+'#wechat_redirect';

      console.log($scope.authorUrl);
      window.location.href = $scope.authorUrl;


    }])

  //主页
  .controller('mainController', ['$scope','$state','appMainSer','commonSer','$ionicViewSwitcher','CONSTANT','$rootScope'
    ,function($scope,$state,appMainSer,commonSer,$ionicViewSwitcher,CONSTANT,$rootScope) {
      var urlParam = commonSer.getQueryString();//urlParam:{'account':'账号',applyTime:'时间戳'random:'随机数'token:'令牌'}
      console.log(urlParam);
      var reqParams = {
          'account':''
      };
      $scope.isChecked = true;
      try{
          //首次进入视图验证有效性
          $scope.$on('$ionicView.loaded',function () {
              //验证 菜单加载
              commonSer.showLoad();
              var sToken = md5(urlParam.account+urlParam.applyTime+urlParam.random);
              console.log(sToken);
              if(sToken===urlParam.token){//验证成功
                  $rootScope.wys = urlParam.applyTime;
                  window.sessionStorage.setItem('wys',urlParam.applyTime);
                  commonSer.setLocal({'key':'wys','data':urlParam.applyTime});
                  commonSer.setLocal({'key':'account','data':urlParam.account});
                  reqParams.account = urlParam.account;
                  //获取权限菜单
                  appMainSer.getSysMenuListByUserInfo(reqParams).then(function (res) {
                      console.log(res);
                      commonSer.hideLoad();
                      if(res&&res.CODE=="200"){
                          if(res.DATAS.length>0){
                              $scope.isChecked = true;
                              $scope.autoQuanx(res.DATAS,3);
                          }else{
                              commonSer.reminder(CONSTANT.user_no_permissions);
                          }
                      }else{
                          commonSer.reminder(CONSTANT.sys_error_common+res.CODE||0);
                      }
                  });
              }else{
                  commonSer.hideLoad();
                  $scope.isChecked = false;
                  commonSer.reminder(CONSTANT.illegal_link_worning);
                  commonSer.removeLocal('account');
                  commonSer.removeLocal('wys');
              }

          });
          //进入视图并是当前活动页
          $scope.$on('$ionicView.afterEnter',function () {
              $scope.isChecked && $scope.addDbnum();
          })
      }catch (e){
          console.log(e);
      }

      //为菜单加上代办数量
      $scope.addDbnum = function () {
          var cdList = document.getElementById('parentDv').getElementsByTagName('span');
          //查询代办数量
          appMainSer.queryTodoNumInfo(reqParams).then(function (res) {
              console.log(res);
              if(res&&res.CODE=='200'){
                  var numList = res.DATAS;
                  for(var z = 0;z<cdList.length;z++){
                      for (var numItem in numList) {
                          if(cdList[z].id==numItem && numList[numItem]!=0){
                              document.getElementById(cdList[z].id).innerHTML=numList[numItem];
                              break;
                          }
                      }
                  }
              }else{
                  commonSer.reminder('代办项加载失败');
              }
          });

      };

      //动态权限
      $scope.autoQuanx = function (datas,nus) {
          //nus每行显示按钮数量，3或者4
          var parentDv = document.getElementById('parentDv');

          //btn = btnTitle+titleName+btns+btn1+id+btn2+style+btn3+imgUrl+btn4+spanId+btn5+btnName+btn6;
          var pdL = nus==3? 33.3 : 25;//根据每行显示数量规定偏移量
          var btn = '';
          var btnTitle = '<div class="neu-pd-title padding wx-black neu-font-6" style="top: ';
          var btns = '</div>';
          var btn1 = '<div onclick="btnClick(';
          var btn2 = ')" class="neu-main-dv neu-main-dv3" style="';
          var btn3 = '"> <img class="neu-img-h-w neu-img-mt" src="';
          var btn4 = '"> <span class="neu-badge neu-badge-pos" id="';
          var btn5 = '"></span> <p class="neu-fontBlack pd-top10">';
          var btn6 = '</p> </div>';
          var bigTop = [{'top':0,'len':0}];

          // 数据分大类
          var map = {}, dest = [];
          for(var i = 0; i < datas.length; i++){
              var ai = datas[i];
              if(!map[ai.parentMenuCode]){
                  dest.push({
                      parentMenuCode: ai.parentMenuCode,
                      parentMenuName: ai.parentMenuName,
                      data: [ai]
                  });
                  map[ai.parentMenuCode] = ai;
              }else{
                  for(var j = 0; j < dest.length; j++){
                      var dj = dest[j];
                      if(dj.parentMenuCode == ai.parentMenuCode){
                          dj.data.push(ai);
                          break;
                      }
                  }
              }
          }

          //动态拼接
          for(var m=0;m<dest.length;m++){
              //大类循环
              if(m!=0){
                  var cl = dest[m].data.length;
                  var nm = cl%nus==0 ? parseInt(cl/nus) : parseInt(cl/nus)+1;
                  bigTop[m] = {
                      'top': bigTop[m-1].len,
                      'len': nm*100+bigTop[m-1].len+40
                  };
              }else{
                  var cl1 = dest[0].data.length;
                  var nm1 = cl1%nus==0 ? parseInt(cl1/nus) : parseInt(cl1/nus)+1;
                  bigTop[0].len = nm1*100+40;
              }
              console.log(bigTop);
              btn+=btnTitle+bigTop[m].top+'px">'+dest[m].parentMenuName+btns;

              //小类循环
              for(var n=1;n<dest[m].data.length+1;n++) {
                  var ys = n % nus;
                  var zs = ys == 0 ? parseInt(n / nus) - 1 : parseInt(n / nus);
                  var top = bigTop[m].top+zs * 100+40;
                  var left = (ys - 1) * pdL < 0 ? 100-pdL : (ys - 1) * pdL;
                  console.log(dest[m]);
                  btn += btn1 + dest[m].data[n - 1].menuUrl + btn2 + "top: " + top + "px;left: " + left + "%" + btn3 + dest[m].data[n - 1].iconUrl + btn4 + dest[m].data[n - 1].menuCode + btn5 + dest[m].data[n - 1].menuName + btn6;
              }
          }

          btnClick = function (id) {
              $scope.toState(id);
          };
          parentDv.style.height =  bigTop[dest.length-1].len+ 'px';
          parentDv.innerHTML = btn;
          console.log(btn);
          //菜单动态加载完成开始动态赋值
          $scope.addDbnum();

      };

      //跳转
      $scope.toState = function (id) {
        var stateUrl;
        switch (id) {
          case 1:stateUrl = "checkComplaint";break;//政策核对单申诉
          case 2:stateUrl = "checkSelect";break;//政策核对申诉查询
          case 3:stateUrl = "checkConfirm";break;//资金对账申诉确认
          case 4:stateUrl = "rebateComplaint";break;//返利对账差异申诉
          case 5:stateUrl = "rebateSelect";break;//对账差异申诉查询
          case 6:stateUrl = "differentConfirm";break;//差异确认done
          case 7:stateUrl = "costConfirm";break;//返利费用确认done
          case 8:stateUrl = "overseeMessage";break;//督办消息done
          case 9:stateUrl = "differentSelect";break;//差异查询done
          case 10:stateUrl = "costSelect";break;//费用查询done
          case 11:stateUrl = "overseeMessageSel";break;//督办消息查询done
        }
        $state.go(stateUrl);
      };


  }])

  //督办消息
  .controller('overseeMsgController', ['$scope','$state','$ionicViewSwitcher','appMainSer','$stateParams','CONSTANT','commonSer','$rootScope'
    ,function($scope,$state,$ionicViewSwitcher,appMainSer,$stateParams,CONSTANT,commonSer,$rootScope) {
      $scope.cateShow = $stateParams.auditId || 0;
      $scope.spTip = 0;//0 正在加载  1加载完成无数据  2加载完成有数据
      var reqParams = {
        'account':"",
        'statusFlag': $scope.cateShow
      };
      reqParams.account = commonSer.getLocal('account');

      function init (id) {
        reqParams.statusFlag = id;
        $scope.mesList = '';
        $scope.spTip = 0;

        appMainSer.queryRcDbMessageList(reqParams).then(function (res) {
          console.log(res);
          if(res){
            switch (res.CODE){
              case "200":
                if(res.DATAS.length>0){
                  $scope.mesList = res.DATAS;
                  $scope.spTip = 2;
                }else{$scope.spTip = 2;}
                break;
              case "600" || "601":
                commonSer.reminder(res.MSG);
                $scope.spTip = 1;
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                $scope.spTip = 1;
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
            $scope.spTip = 1;
          }

        });
      }

      //初始化
      if(commonSer.checkLink()){
          init($scope.cateShow)
      }

      //tab切换
      $scope.showCate = function (id){//1已回复 0未回复
        $scope.cateShow = id;
        init(id)
      };

      //跳转
      $scope.toDetail = function (item) {//详情
        $state.go('overseeMessageDetail',{'auditId':$scope.cateShow,messageId:item.rowId});
        $ionicViewSwitcher.nextDirection('forward');
      };

  }])

  //督办消息
  .controller('overseeMsgSelController', ['$scope','$state','$ionicViewSwitcher','appMainSer','$stateParams','CONSTANT','commonSer'
    ,function($scope,$state,$ionicViewSwitcher,appMainSer,$stateParams,CONSTANT,commonSer) {
        $scope.cateShow = 1;
        $scope.spTip = 0;//0 正在加载  1加载完成无数据  2加载完成有数据
        var account = commonSer.getLocal('account');
        var reqParams = {
              'account':"",
              'statusFlag': $scope.cateShow
          };
        reqParams.account = account;

        function init (id) {
            reqParams.statusFlag = id;
            $scope.mesList = '';
            $scope.spTip = 0;
            appMainSer.queryRcDbMessageList(reqParams).then(function (res) {
                console.log(res);
                if(res){
                    switch (res.CODE){
                        case "200":
                            if(res.DATAS.length>0){
                                $scope.mesList = res.DATAS;
                                $scope.spTip = 2;
                            }else{$scope.spTip = 2;}
                            break;
                        case "600" || "601":
                            commonSer.reminder(res.MSG);
                            $scope.spTip = 1;
                            break;
                        default :
                            commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                            $scope.spTip = 1;
                            break;
                    }
                }else{
                    commonSer.reminder(CONSTANT.info_service_error);
                    $scope.spTip = 1;
                }

            });
        }

        //初始化
      if(commonSer.checkLink()){
          init($scope.cateShow);
      }

        //跳转
        $scope.toDetail = function (item) {//详情
            $state.go('overseeMessageDetail',{'auditId':$scope.cateShow,messageId:item.rowId});
            $ionicViewSwitcher.nextDirection('forward');
        };

    }])

  //督办消息详情
  .controller('overseeMessageDelController',['$scope','$ionicPopup','appMainSer','$stateParams','commonSer','$ionicViewSwitcher','$state','$rootScope'
    ,function ($scope,$ionicPopup,appMainSer,$stateParams,commonSer,$ionicViewSwitcher,$state,$rootScope) {
      var auditId = $stateParams.auditId;
      $scope.hasDeal = parseInt($stateParams.auditId);
      $scope.messageId = $stateParams.messageId;
      $scope.replyContent = "";
      $scope.contentData = "";
      $scope.text = {};
      var account = commonSer.getLocal('account');
      var reqParams = {
        'account':account,
        'statusFlag':auditId,
        'messageId':$scope.messageId
      };

      //初始化详情页面
      function init (){
        commonSer.showLoad();
        appMainSer.getRcDbMessageDetail(reqParams).then(function (res) {
          commonSer.hideLoad();
          console.log(res);
          if(res){
            switch (res.CODE){
              case "200":
                $scope.contentData = res.DATAS;
                if($scope.contentData.replyContent != undefined ){
                  $scope.text.confirmDesc = $scope.contentData.replyContent
                }
                break;
              case "601":
                commonSer.reminder(res.MSG);
                $state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
          }

        })
      }

      if(commonSer.checkLink()){
          init();
      }

      function replySer (repa){
        commonSer.showLoad();
        appMainSer.doReplyRcDbMessage(repa).then(function (res) {
          commonSer.hideLoad();
          console.log(res);
          if(res && res.CODE=='200'){
            commonSer.reminder("操作成功!");
              window.history.back();
            //$state.go('overseeMessage',{'auditId':auditId});
            //$ionicViewSwitcher.nextDirection('back');
          }else if(res.CODE == "601"){//消息已被处理
            commonSer.reminder(res.MSG);
              window.history.back();
            //$state.go('overseeMessage',{'auditId':auditId});
            //$ionicViewSwitcher.nextDirection('back');
          }else if(res.CODE == "600"){
            commonSer.reminder(res.MSG)
          }
        })
      }

      //回复
      $scope.approvalReply = function () {
        $rootScope.myPopup = appMainSer.neuShowPopup("确认回复？","回复");
        $rootScope.myPopup.then(function(res){
          if(res){
            var replyContent = $scope.text.confirmDesc;
            if(replyContent=='' || replyContent==undefined){
              commonSer.reminder("回复内容不能为空！")
            }else{
              reqParams.replyContent = replyContent;
              console.log('回复：'+reqParams.replyContent);
              replySer(reqParams);
            }
          }else{console.log("已取消")}
        });
      };

     //跳转
      $scope.goBack = function () {
        $state.go('overseeMessage',{'auditId':auditId});
        //$ionicViewSwitcher.nextDirection('back');
      }

    }])

  //返利费用确认
  .controller('costConfirmController', ['$scope','$state','$ionicViewSwitcher','$stateParams','appMainSer','commonSer','CONSTANT','$rootScope'
    ,function($scope,$state,$ionicViewSwitcher,$stateParams,appMainSer,commonSer,CONSTANT,$rootScope) {
      $scope.cateShow = $stateParams.auditId || 0;
      $scope.spTip = 0;//0 正在加载  1加载完成无数据  2加载完成有数据
      $scope.account = commonSer.getLocal("account");
      var reqParams = {
        'account':"",
        'statusFlag': $scope.cateShow
      };
      reqParams.account = $scope.account;

      function init (id) {
        reqParams.statusFlag = id;
        $scope.costList = '';
        $scope.spTip = 0;
        appMainSer.queryRcCsCostList(reqParams).then(function (res) {
          console.log(res);
          if(res){
            switch (res.CODE){
              case "200":
                if(res.DATAS.length>0){
                  $scope.costList = res.DATAS;
                  $scope.spTip = 2;
                }else{$scope.spTip = 1;}
                break;
              case "600" || "601":
                commonSer.reminder(res.MSG);
                $scope.spTip = 1;
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                $scope.spTip = 1;
                break;
            }
          }else{
            $scope.spTip = 1;
            commonSer.reminder(CONSTANT.info_service_error);
          }

        });
      }

      //初始化
      if(commonSer.checkLink()){
          init($scope.cateShow);
      }

      //tab切换
      $scope.showCate = function (id){//1已回复 0未回复
        $scope.cateShow = id;
        init(id)
      };

      //跳转
      $scope.toDetail = function (item) {//详情
        console.log(item);
        $state.go('costConfirmDetail',{'auditId':$scope.cateShow,costDetailId:item.rowId});
        $ionicViewSwitcher.nextDirection('forward');
      };


  }])

  //返利费用查询
  .controller('costSelController', ['$scope','$state','$ionicViewSwitcher','$stateParams','appMainSer','commonSer','CONSTANT','$rootScope'
      ,function($scope,$state,$ionicViewSwitcher,$stateParams,appMainSer,commonSer,CONSTANT,$rootScope) {
          $scope.cateShow = 1;
          $scope.spTip = 0;//0 正在加载  1加载完成无数据  2加载完成有数据
          var reqParams = {
              'account':"",
              'statusFlag': $scope.cateShow
          };
          $scope.account = commonSer.getLocal("account");
          reqParams.account = $scope.account;

          function init (id) {
              reqParams.statusFlag = id;
              $scope.costList = '';
              $scope.spTip = 0;
              appMainSer.queryRcCsCostList(reqParams).then(function (res) {
                  console.log(res);
                  if(res){
                      switch (res.CODE){
                          case "200":
                              if(res.DATAS.length>0){
                                  $scope.costList = res.DATAS;
                                  $scope.spTip = 2;
                              }else{$scope.spTip = 1;}
                              break;
                          case "600" || "601":
                              commonSer.reminder(res.MSG);
                              $scope.spTip = 1;
                              break;
                          default :
                              commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                              $scope.spTip = 1;
                              break;
                      }
                  }else{
                      $scope.spTip = 1;
                      commonSer.reminder(CONSTANT.info_service_error);
                  }

              });
          }

          //初始化
          if(commonSer.checkLink()){
              init($scope.cateShow);
          }

          //跳转
          $scope.toDetail = function (item) {//详情
              console.log(item);
              $state.go('costConfirmDetail',{'auditId':$scope.cateShow,costDetailId:item.rowId});
              $ionicViewSwitcher.nextDirection('forward');
          };


      }])

  //返利费用确认详情
  .controller('costConfirmDelController',['$scope','$ionicPopup','appMainSer','$state','$stateParams','$ionicViewSwitcher','$rootScope','commonSer','CONSTANT'
    ,function ($scope,$ionicPopup,appMainSer,$state,$stateParams,$ionicViewSwitcher,$rootScope,commonSer,CONSTANT) {
      $scope.hasDeal = parseInt($stateParams.auditId);
      var auditId = $stateParams.auditId;
      $scope.costDetailId = $stateParams.costDetailId;
      $scope.contentData = "";
      var account = commonSer.getLocal("account");
      $scope.text = {};//说明确认输入

      var reqParams = {
        'account':account,
        'statusFlag':auditId,
        'costDetailId':$scope.costDetailId
      };
      var replyParams = {
        'account':account,
        'statusFlag':"",
        'costDetailId':$scope.costDetailId
      };

      //折叠列表
      $scope.isArrShow = [{'show':false},{'show':false}];
      $scope.toggleGroup = function(group) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function(group) {
        return group.show;
      };

      //初始化详情页面
      function init (){
        commonSer.showLoad();
        appMainSer.getRcCsCostDetail(reqParams).then(function (res) {
          commonSer.hideLoad();
          console.log(res);
          if(res){
            switch (res.CODE){
              case "200":
                $scope.contentData = res.DATAS.costInfo;
                $scope.hxDocTypeList = res.DATAS.hxDocTypeList;
                if($scope.contentData.hxDocType != null && $scope.contentData.hxDocType != "" && $scope.contentData.hxDocType != undefined){
                  $scope.selData = $scope.contentData.hxDocTypeName;
                  replyParams.hxDocType = $scope.contentData.hxDocType;
                }
                if($scope.contentData.remark != undefined ){
                  $scope.text.confirmDesc = $scope.contentData.remark
                }
                break;
              case "601":
                commonSer.reminder(res.MSG);
                $state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
          }

        })
      }

      if(commonSer.checkLink()){
          init();
      }

      function replySer (repa){
        commonSer.showLoad();
        appMainSer.doConfirmRcCsCostDetail(repa).then(function (res) {
          commonSer.hideLoad();
          console.log(res);
          if(res && res.CODE=='200'){
            commonSer.reminder("操作成功!");
              window.history.back();
            //$state.go('costConfirm',{'auditId':auditId});
            //$ionicViewSwitcher.nextDirection('back');
          }else if(res.CODE == "601"){//消息已被处理
            commonSer.reminder(res.MSG);
              window.history.back();
            //$state.go('costConfirm',{'auditId':auditId});
            //$ionicViewSwitcher.nextDirection('back');
          }else if(res.CODE == "600"){
            commonSer.reminder(res.MSG)
          }else{
            commonSer.reminder(CONSTANT.sys_error_common+"res.CODE")
          }
        })
      }

      //回复
      $scope.approvalReply = function () {
        $rootScope.myPopup = appMainSer.neuShowPopup("确认回复？","回复");
        $rootScope.myPopup.then(function(res){
          if(res){
            var remark = $scope.text.confirmDesc;
            if(remark!="" && remark!=undefined){
              replyParams.remark = remark;
            }else {
              delete replyParams.remark;
            }
            var hxDocNo = document.getElementById('hxDocNo').value;
            if(hxDocNo!="" && hxDocNo!=undefined){
              replyParams.hxDocNo = hxDocNo;
            }else {
              delete replyParams.hxDocNo;
            }
            replyParams.statusFlag = "3";
            console.log('回复：'+JSON.stringify(replyParams));
            replySer(replyParams);
          } else{console.log("已取消")}
        });
      };

      //驳回
      $scope.approvalInvalid = function () {
        $rootScope.myPopup = appMainSer.neuShowPopup("确认驳回？","确认");
        $rootScope.myPopup.then(function(res){
          if(res){
            var remark = $scope.text.confirmDesc;
            if(remark!="" && remark!=undefined){
              replyParams.remark = remark;
            }else {
              delete replyParams.remark;
            }
            var hxDocNo = document.getElementById('hxDocNo').value;
            if(hxDocNo!="" && hxDocNo!=undefined){
              replyParams.hxDocNo = hxDocNo;
            }else {
              delete replyParams.hxDocNo;
            }
            replyParams.statusFlag = "0";
            console.log('驳回：'+JSON.stringify(replyParams));
            replySer(replyParams);
          }else{console.log("已取消")}
        });
       };

      // 分类原因选择弹窗
      $scope.showPopup = function () {
        $rootScope.myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<div class="item" style="padding: 10px" ng-repeat="data in hxDocTypeList" ng-click="ensureSel(data)">' +
          '<ul style="display: inline-block;width: 100%;">{{data.VALUE}}</ul>'+
          '</div></div>',
          title: '选择分类原因',
          scope: $scope,
          buttons: [
            {
              text: '取消',
              type:'button-assertive'
            }
          ]
        });

      };
      //选择分类原因
      $scope.ensureSel = function(data){
        $scope.selData = data.VALUE;
        replyParams.hxDocType = data.CODE;
        console.log(replyParams);
        $rootScope.myPopup.close();
      };

      //跳转
      $scope.goBack = function () {
        $state.go('costConfirm',{'auditId':auditId});
        //$ionicViewSwitcher.nextDirection('back');
      };


    }])

  //差异确认
  .controller('differentCfmController', ['$scope','appMainSer','$state','$stateParams','$ionicViewSwitcher','modalService','commonSer','CONSTANT','$rootScope'
    ,function($scope,appMainSer,$state,$stateParams,$ionicViewSwitcher,modalService,commonSer,CONSTANT,$rootScope) {
      $scope.cateShow = $stateParams.auditId || 0;
      $scope.spTip = 0;//0 正在加载  1加载完成无数据  2加载完成有数据
      $scope.account = commonSer.getLocal('account');
      var reqParams = {
        'account':"",
        'statusFlag': $scope.cateShow
      };
      reqParams.account = $scope.account;
      reqParams.statusFlag = $scope.cateShow;

      function init (requestParam) {
        console.log(requestParam);
        $scope.diffList = '';
        $scope.spTip = 0;
        appMainSer.queryhdDifferDetailList(requestParam).then(function (res) {
          console.log(res);
          if(res){
            switch (res.CODE){
              case "200":
                if(res.DATAS.length>0){
                  $scope.diffList = res.DATAS;
                  $scope.spTip = 2;
                }else{$scope.spTip = 1;}
                break;
              case "600" || "601":
                commonSer.reminder(res.MSG);
                $scope.spTip = 1;
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                $scope.spTip = 1;
                break;
            }
          }else{
            $scope.spTip = 1;
            commonSer.reminder(CONSTANT.info_service_error);
          }

        });
      }

      //初始化
      if(commonSer.checkLink()){
          init(reqParams);
      }

      //tab切换
      $scope.showCate = function (id){//1已回复 0未回复
        $scope.cateShow = id;
        reqParams.statusFlag = id;
        init(reqParams)
      };

      modalService.initCommonSearchModal($scope,0, function () {
        console.log($scope.searchParams);//从modal中传来的查询条件
        $scope.searchParams.statusFlag = $scope.cateShow;
        $scope.searchParams.account = $scope.account;
        init($scope.searchParams);
      });

      //跳转
      $scope.clickToDetail = function (item) {//详情
        var stateUrl;

        if (item.csDocType=="80" && item.csDetailType=="801") {//发货发票
          stateUrl = "differentConfirmDetailFh";
        }
        if(item.csDocType=="60" && item.csDetailType=="601"){//退货发票
          stateUrl = "differentConfirmDetailTh";
        }
        if (item.csDocType=="70") {//费用订单
          stateUrl = "differentConfirmDetailFy";
        }
        if(item.csDocType=="80" && item.csDetailType=="804"){//入库订单
          stateUrl = "differentConfirmDetailRk";
        }

        $state.go(stateUrl,{'auditId':$scope.cateShow,diffDetailId:item.rowId});
        $ionicViewSwitcher.nextDirection('forward');
      }

  }])

  //差异查询
  .controller('differentSelController', ['$scope','appMainSer','$state','$stateParams','$ionicViewSwitcher','modalService','commonSer','CONSTANT','$rootScope'
        ,function($scope,appMainSer,$state,$stateParams,$ionicViewSwitcher,modalService,commonSer,CONSTANT,$rootScope) {
            $scope.cateShow = 1;
            $scope.spTip = 0;//0 正在加载  1加载完成无数据  2加载完成有数据
            var reqParams = {
                'account':"",
                'statusFlag': $scope.cateShow
            };
            $scope.account = commonSer.getLocal('account');
            reqParams.account = $scope.account;

            function init (requestParam) {
                  console.log(requestParam);
                  $scope.diffList = '';
                  $scope.spTip = 0;
                  appMainSer.queryhdDifferDetailList(requestParam).then(function (res) {
                      console.log(res);
                      if(res){
                          switch (res.CODE){
                              case "200":
                                  if(res.DATAS.length>0){
                                      $scope.diffList = res.DATAS;
                                      $scope.spTip = 2;
                                  }else{$scope.spTip = 1;}
                                  break;
                              case "600" || "601":
                                  commonSer.reminder(res.MSG);
                                  $scope.spTip = 1;
                                  break;
                              default :
                                  commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                                  $scope.spTip = 1;
                                  break;
                          }
                      }else{
                          $scope.spTip = 1;
                          commonSer.reminder(CONSTANT.info_service_error);
                      }

                  });
              }

            //初始化
          if(commonSer.checkLink()){
              init(reqParams);
          }

            modalService.initCommonSearchModal($scope,0, function () {
                console.log($scope.searchParams);//从modal中传来的查询条件
                $scope.searchParams.statusFlag = $scope.cateShow;
                $scope.searchParams.account = $scope.account;
                init($scope.searchParams);
            });

            //跳转
            $scope.clickToDetail = function (item) {//详情
                var stateUrl;

                if (item.csDocType=="80" && item.csDetailType=="801") {//发货发票
                    stateUrl = "differentConfirmDetailFh";
                }
                if(item.csDocType=="60" && item.csDetailType=="601"){//退货发票
                    stateUrl = "differentConfirmDetailTh";
                }
                if (item.csDocType=="70") {//费用订单
                    stateUrl = "differentConfirmDetailFy";
                }
                if(item.csDocType=="80" && item.csDetailType=="804"){//入库订单
                    stateUrl = "differentConfirmDetailRk";
                }

                $state.go(stateUrl,{'auditId':$scope.cateShow,diffDetailId:item.rowId});
                $ionicViewSwitcher.nextDirection('forward');
            }

        }])

  //差异确认详情
  /*发货*/
  .controller('differentCfmDetailFhController', ['$scope','appMainSer','$state','$stateParams','$ionicViewSwitcher','commonSer','CONSTANT','$rootScope'
    ,function($scope,appMainSer,$state,$stateParams,$ionicViewSwitcher,commonSer,CONSTANT,$rootScope) {
      $scope.hasDeal = parseInt($stateParams.auditId);
      var auditId = $stateParams.auditId;//差异类型 0待确认 1已确认
      var diffDetailId = $stateParams.diffDetailId;//差异id
      $scope.errorData = false;
      $scope.isDiff = true;//0：未达（不显示海信方切页）   1：差异（显示海信方切页）
      $scope.cateShow = 1;
      $scope.text = {};//差异确认输入
      var account = commonSer.getLocal("account");
      var reqParams = {
        'account':account,
        'statusFlag': auditId,
        'diffDetailId':diffDetailId
      };
      var replyParams = {
        'account':account
      };

      //折叠列表
      $scope.isArrShow = [{'show':false}];
      $scope.toggleGroup = function(group) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function(group) {
        return group.show;
      };

      function init (reqParams){
        commonSer.showLoad();
        appMainSer.queryhdDifferDetailInfo(reqParams).then(function (res) {
          console.log(res);
          commonSer.hideLoad();
          if(res){
            switch (res.CODE){
              case "200":
                res.DATAS.differDetailInfo.diffFlag == "1" ? $scope.isDiff=true:$scope.isDiff=false;
                if(res.DATAS.differDetailInfo==""||res.DATAS.customerInfo==""||res.DATAS.hisenseInfo==""){
                  $scope.errorData = true;
                }
                $scope.differDetailInfo = res.DATAS.differDetailInfo;
                $scope.customerInfo = res.DATAS.customerInfo;
                $scope.hisenseInfo = res.DATAS.hisenseInfo;
                if($scope.differDetailInfo.confirmDesc != undefined ){
                  $scope.text.confirmDesc = $scope.differDetailInfo.confirmDesc
                }
                break;
              case "601":
                commonSer.reminder(res.MSG);
                $state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
          }
        })
      }

      //初始化
      if(commonSer.checkLink()){
          init(reqParams);
      }

      $scope.showCates = function (id) {//1：差异单 2：差异明细 3：原单明细
        $scope.cateShow = id;
      };

      //通过或者驳回
      function doConfirmHdDifferDetail (replyParams) {
        commonSer.showLoad();
        appMainSer.doConfirmHdDifferDetail(replyParams).then(function (res) {
          console.log(res);
          commonSer.hideLoad();
          if(res){
            switch (res.CODE){
              case "200":
                commonSer.reminder("操作成功!");
                  window.history.back();
                //$state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "601"://消息被处理
                commonSer.reminder(res.MSG);
                  window.history.back();
                //$state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error)
          }
        })
      }

      //通过
      $scope.approvalPass = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认通过？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "3";//3确认 X驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc = $scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams)
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

      //驳回
      $scope.approvalReject = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认驳回？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "0";//3确认 0驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc =$scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams);
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

      //跳转
      $scope.goBack = function () {
        $state.go('differentConfirm',{'auditId':auditId});
        //$ionicViewSwitcher.nextDirection('back');
      }


    }])

  /*费用*/
  .controller('differentCfmDetailFyController', ['$scope','appMainSer','$state','$stateParams','$ionicViewSwitcher','commonSer','CONSTANT','$rootScope','$ionicPopup','$timeout'
    ,function($scope,appMainSer,$state,$stateParams,$ionicViewSwitcher,commonSer,CONSTANT,$rootScope,$ionicPopup,$timeout) {
      $scope.hasDeal = parseInt($stateParams.auditId);
      var auditId = $stateParams.auditId;//差异类型 0待确认 1已确认
      var diffDetailId = $stateParams.diffDetailId;//差异id
      $scope.errorData = false;
      $scope.isDiff = true;//0：未达（不显示海信方切页）   1：差异（显示海信方切页）
      $scope.cateShow = 1;
      $scope.text = {};//差异确认输入
      $scope.selItem = [
        {"VALUE":"调增","CODE":"1"},
        {"VALUE":"调减","CODE":"2"},
        {"VALUE":"预留","CODE":"3"},
        {"VALUE":"重新核对","CODE":"4"}
      ];
      var account = commonSer.getLocal('account');
      var reqParams = {
        'account':account,
        'statusFlag': auditId,
        'diffDetailId':diffDetailId
      };
      var replyParams = {
        'account':account
      };

      //折叠列表
      $scope.isArrShow = [{'show':false}];
      $scope.toggleGroup = function(group) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function(group) {
        return group.show;
      };

      function init (reqParams){
        commonSer.showLoad();
        appMainSer.queryhdDifferDetailInfo(reqParams).then(function (res) {
          console.log(res);
          commonSer.hideLoad();
          if(res){
            switch (res.CODE){
              case "200":
                res.DATAS.differDetailInfo.diffFlag == "1" ? $scope.isDiff=true:$scope.isDiff=false;
                if(res.DATAS.differDetailInfo==""||res.DATAS.customerInfo==""||res.DATAS.hisenseInfo==""){
                  $scope.errorData = true;
                }
                $scope.differDetailInfo = res.DATAS.differDetailInfo;
                $scope.customerInfo = res.DATAS.customerInfo;
                $scope.hisenseInfo = res.DATAS.hisenseInfo;
                if($scope.differDetailInfo.diffDealTypeName != "" && $scope.differDetailInfo.diffDealTypeName != undefined){
                    $scope.selData = $scope.differDetailInfo.diffDealTypeName;
                    replyParams.diffDealType = $scope.differDetailInfo.diffDealType;
                }
                parseInt($scope.differDetailInfo.diffHsamt)>0 ? $scope.selItem.splice(1,2) : $scope.selItem.splice(0,1);
                if($scope.differDetailInfo.confirmDesc != undefined ){
                  $scope.text.confirmDesc = $scope.differDetailInfo.confirmDesc
                }
                break;
              case "601":
                commonSer.reminder(res.MSG);
                $state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
          }
        })
      }

      //初始化
      if(commonSer.checkLink()){
          init(reqParams);
      }

      $scope.showCates = function (id) {//1：差异单 2：差异明细 3：原单明细
        $scope.cateShow = id;
      };

      //通过或者驳回
      function doConfirmHdDifferDetail (replyParams) {
        commonSer.showLoad();
        if($scope.isDiff && $scope.differDetailInfo.hxDocType=="RB_ORDER" && replyParams.diffDealType=="4" && replyParams.statusFlag=="3"){
          commonSer.reminder(CONSTANT.feiyong_operation_limit);    //只能做驳回操作
        }else{
          appMainSer.doConfirmHdDifferDetail(replyParams).then(function (res) {
            console.log(res);
            commonSer.hideLoad();
            if(res){
              switch (res.CODE){
                case "200":
                  commonSer.reminder("操作成功!");
                    window.history.back();
                  //$state.go('differentConfirm',{'auditId':auditId});
                  //$ionicViewSwitcher.nextDirection('back');
                  break;
                case "601"://消息被处理
                  commonSer.reminder(res.MSG);
                    window.history.back();
                  //$state.go('differentConfirm',{'auditId':auditId});
                  //$ionicViewSwitcher.nextDirection('back');
                  break;
                case "600":
                  commonSer.reminder(res.MSG);
                  break;
                default :
                  commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                  break
              }
              }else{
              commonSer.reminder(CONSTANT.info_service_error)
            }
          })
        }
      }

      //通过
      $scope.approvalPass = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认通过？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "3";//3确认 0驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc = $scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams)
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

      //驳回
      $scope.approvalReject = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认驳回？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "0";//3确认 0驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc =$scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams);
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };


      $scope.loseBlues = function(){
          $timeout(function () {
              $('input').blur();
          },10);
      };

      $scope.showPopup = function() {//差异属性
          $rootScope.myPopup = $ionicPopup.show({
              template: '<div class="list">' +
              '<ion-radio1 class="pop-checkbox-bg" ng-repeat="data in selItem" ng-model="selData" ng-click="ensureSel(data)" ng-value="data.VALUE">{{data.VALUE}}</ion-radio1>' +
              '</div>',
              title: '差异属性',
              scope: $scope
          });
          $scope.loseBlues();
      };

      //选择分类原因
      $scope.ensureSel = function(data){
        $scope.selData = data.VALUE;
        replyParams.diffDealType = data.CODE;//分类选择代码
        console.log(replyParams);
        $rootScope.myPopup.close();
      };


    }])

  /*入库*/
  .controller('differentCfmDetailRkController', ['$scope','appMainSer','$state','$stateParams','$ionicViewSwitcher','commonSer','CONSTANT','$rootScope'
    ,function($scope,appMainSer,$state,$stateParams,$ionicViewSwitcher,commonSer,CONSTANT,$rootScope) {
      $scope.hasDeal = parseInt($stateParams.auditId);
      var auditId = $stateParams.auditId;//差异类型 0待确认 1已确认
      var diffDetailId = $stateParams.diffDetailId;//差异id
      $scope.errorData = false;
      $scope.isDiff = true;//0：未达（不显示海信方切页）   1：差异（显示海信方切页）
      $scope.cateShow = 1;
      $scope.text = {};//差异确认输入
      var account = commonSer.getLocal('account');
      var reqParams = {
        'account':account,
        'statusFlag': auditId,
        'diffDetailId':diffDetailId
      };
      var replyParams = {
        'account':account
      };

      //折叠列表
      $scope.isArrShow = [{'show':false}];
      $scope.toggleGroup = function(group) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function(group) {
        return group.show;
      };

      function init (reqParams){
        commonSer.showLoad();
        appMainSer.queryhdDifferDetailInfo(reqParams).then(function (res) {
          console.log(res);
          commonSer.hideLoad();
          if(res){
            switch (res.CODE){
              case "200":
                res.DATAS.differDetailInfo.diffFlag == "1" ? $scope.isDiff=true:$scope.isDiff=false;
                if(res.DATAS.differDetailInfo==""||res.DATAS.customerInfo==""||res.DATAS.hisenseInfo==""){
                  $scope.errorData = true;
                }
                $scope.differDetailInfo = res.DATAS.differDetailInfo;
                $scope.customerInfo = res.DATAS.customerInfo;
                $scope.hisenseInfo = res.DATAS.hisenseInfo;
                if($scope.differDetailInfo.confirmDesc != undefined ){
                  $scope.text.confirmDesc = $scope.differDetailInfo.confirmDesc
                }
                break;
              case "601":
                commonSer.reminder(res.MSG);
                $state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
          }
        })
      }

      //初始化
      if(commonSer.checkLink()){
          init(reqParams);
      }

      $scope.showCates = function (id) {//1：差异单 2：差异明细 3：原单明细
        $scope.cateShow = id;
      };

      //通过或者驳回
      function doConfirmHdDifferDetail (replyParams) {
        commonSer.showLoad();
        if($scope.isDiff && $scope.differDetailInfo.hxDocType=="RB_ORDER" && replyParams.diffDealType=="4" && replyParams.statusFlag=="3"){
          commonSer.reminder(CONSTANT.feiyong_operation_limit);    //只能做驳回操作
        }else{
          appMainSer.doConfirmHdDifferDetail(replyParams).then(function (res) {
            console.log(res);
            commonSer.hideLoad();
            if(res){
              switch (res.CODE){
                case "200":
                  commonSer.reminder("操作成功!");
                    window.history.back();
                  //$state.go('differentConfirm',{'auditId':auditId});
                  //$ionicViewSwitcher.nextDirection('back');
                  break;
                case "601"://消息被处理
                  commonSer.reminder(res.MSG);
                    window.history.back();
                  //$state.go('differentConfirm',{'auditId':auditId});
                  //$ionicViewSwitcher.nextDirection('back');
                  break;
                case "600":
                  commonSer.reminder(res.MSG);
                  break;
                default :
                  commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                  break
              }
            }else{
              commonSer.reminder(CONSTANT.info_service_error)
            }
          })
        }
      }

      //通过
      $scope.approvalPass = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认通过？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "3";//3确认 0驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc = $scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams)
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

      //驳回
      $scope.approvalReject = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认驳回？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "0";//3确认 0驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc =$scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams);
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

    }])

  /*退货*/
  .controller('differentCfmDetailThController', ['$scope','appMainSer','$state','$stateParams','$ionicViewSwitcher','commonSer','CONSTANT','$rootScope'
    ,function($scope,appMainSer,$state,$stateParams,$ionicViewSwitcher,commonSer,CONSTANT,$rootScope) {
      $scope.hasDeal = parseInt($stateParams.auditId);
      var auditId = $stateParams.auditId;//差异类型 0待确认 1已确认
      var diffDetailId = $stateParams.diffDetailId;//差异id
      $scope.errorData = false;
      $scope.isDiff = true;//0：未达（不显示海信方切页）   1：差异（显示海信方切页）
      $scope.cateShow = 1;
      $scope.text = {};//差异确认输入
      var account = commonSer.getLocal('account');
      var reqParams = {
        'account':account,
        'statusFlag': auditId,
        'diffDetailId':diffDetailId
      };
      var replyParams = {
        'account':account
      };

      //折叠列表
      $scope.isArrShow = [{'show':false}];
      $scope.toggleGroup = function(group) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function(group) {
        return group.show;
      };

      function init (reqParams){
        commonSer.showLoad();
        appMainSer.queryhdDifferDetailInfo(reqParams).then(function (res) {
          console.log(res);
          commonSer.hideLoad();
          if(res){
            switch (res.CODE){
              case "200":
                res.DATAS.differDetailInfo.diffFlag == "1" ? $scope.isDiff=true:$scope.isDiff=false;
                if(res.DATAS.differDetailInfo==""||res.DATAS.customerInfo==""||res.DATAS.hisenseInfo==""){
                  $scope.errorData = true;
                }
                $scope.differDetailInfo = res.DATAS.differDetailInfo;
                $scope.customerInfo = res.DATAS.customerInfo;
                $scope.hisenseInfo = res.DATAS.hisenseInfo;
                if($scope.differDetailInfo.confirmDesc != undefined ){
                  $scope.text.confirmDesc = $scope.differDetailInfo.confirmDesc
                }
                break;
              case "601":
                commonSer.reminder(res.MSG);
                $state.go('differentConfirm',{'auditId':auditId});
                //$ionicViewSwitcher.nextDirection('back');
                break;
              case "600":
                commonSer.reminder(res.MSG);
                break;
              default :
                commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                break;
            }
          }else{
            commonSer.reminder(CONSTANT.info_service_error);
          }
        })
      }

      //初始化
      if(commonSer.checkLink()){
          init(reqParams);
      }

      $scope.showCates = function (id) {//1：差异单 2：差异明细 3：原单明细
        $scope.cateShow = id;
      };

      //通过或者驳回
      function doConfirmHdDifferDetail (replyParams) {
        commonSer.showLoad();
        if($scope.isDiff && $scope.differDetailInfo.hxDocType=="RB_ORDER" && replyParams.diffDealType=="4" && replyParams.statusFlag=="3"){
          commonSer.reminder(CONSTANT.feiyong_operation_limit);    //只能做驳回操作
        }else{
          appMainSer.doConfirmHdDifferDetail(replyParams).then(function (res) {
            console.log(res);
            commonSer.hideLoad();
            if(res){
              switch (res.CODE){
                case "200":
                  commonSer.reminder("操作成功!");
                    window.history.back();
                  //$state.go('differentConfirm',{'auditId':auditId});
                  //$ionicViewSwitcher.nextDirection('back');
                  break;
                case "601"://消息被处理
                  commonSer.reminder(res.MSG);
                    window.history.back();
                  //$state.go('differentConfirm',{'auditId':auditId});
                  //$ionicViewSwitcher.nextDirection('back');
                  break;
                case "600":
                  commonSer.reminder(res.MSG);
                  break;
                default :
                  commonSer.reminder(CONSTANT.sys_error_common+res.CODE);
                  break
              }
            }else{
              commonSer.reminder(CONSTANT.info_service_error)
            }
          })
        }
      }

      //通过
      $scope.approvalPass = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认通过？","确认");
          $rootScope.myPopup.then(function(res){
            if(res){
              replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
              replyParams.statusFlag = "3";//3确认 0驳回
              $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc = $scope.text.confirmDesc : false;//差异确认说明
              doConfirmHdDifferDetail(replyParams)
            }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

      //驳回
      $scope.approvalReject = function() {
        if(!$scope.errorData){
          $rootScope.myPopup = appMainSer.neuShowPopup("确认驳回？","确认");
          $rootScope.myPopup.then(function(res){
              if(res){
                  replyParams.diffDetailId = $scope.differDetailInfo.rowId+"";//差异明细ID
                  replyParams.statusFlag = "0";//3确认 0驳回
                  $scope.text.confirmDesc != "" && $scope.text.confirmDesc != undefined ? replyParams.confirmDesc =$scope.text.confirmDesc : false;//差异确认说明
                  doConfirmHdDifferDetail(replyParams);
              }else{console.log("操作取消")}
          });
        }else{
          commonSer.reminder(CONSTANT.sys_error_common+"000")
        }
      };

    }])

  //差异高级查询modal
  .controller('searchModalcontroller',['$scope','$state','$ionicPopup','CONSTANT','appMainSer','commonSer','$timeout'
    ,function($scope,$state,$ionicPopup,CONSTANT,appMainSer,commonSer,$timeout){
      var myPopup;
      $scope.searchReq = {};
      var account = commonSer.getLocal('account');

      function init(reqParams){
        appMainSer.queryhdDifferAdvancedQueryInfo(reqParams).then(function (res) {
          console.log(res);
          if(res && res.CODE=="200"){
            $scope.csTypeList = res.DATAS.csTypeList;//大连锁名称
            $scope.csDocTypeList = res.DATAS.csDocTypeList;//单据类型
            $scope.csDetailTypeList = res.DATAS.csDetailTypeList;//单据明细类型
            $scope.diffFlagList = res.DATAS.diffFlagList;//单据属性
          }else{

          }
        })
      }

      /*初始化*/
      init({'account':account});

      $scope.$on('search-modal', function() {
        $scope.searchModal = {};
      });

      $scope.loseBlues = function(){
          $timeout(function () {
              $('input').blur();
          },10);
      };

      //下拉列表集
      $scope.showDlsPopup = function() {//大连锁
        myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<ion-radio1 class="pop-checkbox-bg" ng-repeat="data in csTypeList" ng-model="searchModal.csTypeName" ng-click="selectItem(1,data)" ng-value="data.VALUE">{{data.VALUE}}</ion-radio1>' +
          '</div>',
          title: '大连锁名称',
          scope: $scope
        });
          $scope.loseBlues();
      };

      $scope.showDjlxPopup = function() {//单据类型
        myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<ion-radio1 class="pop-checkbox-bg" ng-repeat="data in csDocTypeList" ng-model="searchModal.csDocTypeName" ng-click="selectItem(2,data)" ng-value="data.VALUE">{{data.VALUE}}</ion-radio1>' +
          '</div>',
          title: '单据类型',
          scope: $scope
        });
          $scope.loseBlues();

      };
      $scope.showDjmxlxPopup = function() {//单据明细类型
        myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<ion-radio1 class="pop-checkbox-bg" ng-repeat="data in csDetailTypeList" ng-model="searchModal.csDetailTypeName" ng-click="selectItem(3,data)" ng-value="data.VALUE">{{data.VALUE}}</ion-radio1>' +
          '</div>',
          title: '单据明细类型',
          scope: $scope
        });
          $scope.loseBlues();
      };
      $scope.showCysxPopup = function() {//差异属性
        myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<ion-radio1 class="pop-checkbox-bg" ng-repeat="data in diffFlagList" ng-model="searchModal.diffFlag" ng-click="selectItem(4,data)" ng-value="data.VALUE">{{data.VALUE}}</ion-radio1>' +
          '</div>',
          title: '差异属性',
          scope: $scope
        });
          $scope.loseBlues();
      };

      $scope.selectItem = function(id,item){
        switch (id){//1:大连锁名称  2：单据类型  3：单据明细类型 4：差异属性
          case 1:
            if(item.VALUE == ""){
              $scope.searchModal.csTypeName = "";
            }
            $scope.searchReq.csType = item.CODE;
            myPopup.close();
            break;
          case 2:
            if(item.VALUE == ""){
              $scope.searchModal.csDocTypeName = "";
            }
            $scope.searchReq.csDocType = item.CODE;
            myPopup.close();
            break;
          case 3:
            if(item.VALUE == ""){
              $scope.searchModal.csDetailTypeName = "";
            }
            $scope.searchReq.csDetailType = item.CODE;
            myPopup.close();
            break;
          case 4:
            if(item.VALUE == ""){
              $scope.searchModal.diffFlag = "";
            }
            $scope.searchReq.diffFlag = item.CODE;
            myPopup.close();
            break;

        }
      };

      //日期格式化
      function dateFormat (date){
        var o = {};
        var oldDate = new Date(date);
        var newDate;
        o.y = oldDate.getFullYear();
        o.m = oldDate.getMonth()+1;
        o.d = oldDate.getDate();
        newDate = o.y+"-"+o.m+"-"+o.d;
        return newDate;
      }

      /*确认*/
      $scope.submitSearch = function(){
        $scope.searchReq.customerName = $scope.searchModal.customerName;
        $scope.searchReq.diffDate_b = $scope.searchModal.begin_date==undefined ? "" : dateFormat($scope.searchModal.begin_date);
        $scope.searchReq.diffDate_e = $scope.searchModal.end_date==undefined ? "" : dateFormat($scope.searchModal.end_date);
        console.log($scope.searchReq);
        $scope.searchModal.customerName = "";
        $scope.searchParams ={};
        $scope.closeModal($scope.searchReq);
        $scope.searchReq = {};
      };

      var htmlEl = angular.element(document.querySelector('html'));
          htmlEl.on('click', function (event) {
              if (event.target.className === 'modal-backdrop active') {
                  if (myPopup) {//myPopup即为popup
                      myPopup.close();
                  }
              }else if(event.target.className == 'modal-backdrop'){
                  console.log(333);
              }
          });


    }])

  //政策核对单申诉
  .controller('checkClaController', ["$scope","$state",function($scope,$state) {

    $scope.clickToDetail = function (id) {
      $state.go('checkComplaintDetail',{id:id})
    }

  }])

  //政策核对单申诉详情
  .controller('checkClaDelController', ['$scope','$ionicModal','$ionicPopup','$ionicGesture','appMainSer'
    ,function($scope,$ionicModal,$ionicPopup,$ionicGesture,appMainSer) {

      $scope.datas = [{
        'name':'好'
      },{
        'name':'一般好'
      },{
        'name':'差不多'
      },{
        'name':'很好'
      },{
        'name':'特别好'
      },{
        'name':'好得不得了'
      },{
        'name':'好到死'
      }];

      var myPopup;

      // 分类原因选择弹窗
      $scope.showPopup = function () {
        myPopup = $ionicPopup.show({
          template: '<div class="list">' +
          '<div class="item" style="padding: 10px" ng-repeat="data in datas" ng-click="ensureSel(data)">' +
          '<ul style="display: inline-block;width: 100%;">{{data.name}}</ul>'+
          '</div></div>',
          title: '选择分类原因',
          scope: $scope,
          buttons: [
            {
              text: '取消',
              type:'button-assertive'
            }
          ]
        });

      };

      //选择分类原因
      $scope.ensureSel = function(data){
        $scope.selData = data.name;
        myPopup.close();
      };

      $scope.approvalPass = function() {
        myPopup = appMainSer.neuShowPopup("确认通过？","确认");
        myPopup.then(function(res){
          alert(res)
        });
      };
      $scope.approvalReject = function() {
        myPopup = appMainSer.neuShowPopup("确认驳回？","确认");
        myPopup.then(function(res){
          alert(res)
        });
      };
      $scope.approvalSolve = function() {
        myPopup = appMainSer.neuShowPopup("确认待解决？","确认");
        myPopup.then(function(res){
          alert(res)
        });
      };

      //点击空白处关闭弹窗
      var  $htmlEl= angular.element(document.querySelector('html'));
      $ionicGesture.on("touch", function(event) {
        if (event.target.nodeName === "HTML" || event.target.className === 'icon ion-close-round assertive popup-icon-close') {
          myPopup.close();
        }
      },$htmlEl);


    }])

  //政策核对单申诉查询
  .controller('checkSelController', ['$scope','appMainSer','$state',function($scope,appMainSer,$state) {
    $scope.clickToDetail = function (id) {
      $state.go('',{id:id})
    }

  }])


  ;
