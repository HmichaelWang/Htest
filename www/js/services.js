angular.module('starter.services', [])

  .factory('loginSer',[function () {
    return{
      checkUser: function (user) {
        var result = "";
        if (user.name==''){result = "请输入用户名"}
        else if(user.password==''){result = "请输入密码"}
        else {result = "success";}
        return result;
      }
    }


  }])

  .factory('modalService',function($ionicModal){
    var initCommonSearchModal = function ($scope,templateIndex,callback) {
      var templatesArray = [
        "templates/SettlementManage/diffSearchModal.html"
      ];
      var modal = $ionicModal.fromTemplateUrl(templatesArray[templateIndex],{
        scope:$scope,
        animation:'slide-in-up',
        backdropClickToClose:false
      }).then(function (modal) {
        $scope.modal = modal;
        return modal;
      });
      $scope.openModal = function () {
        $scope.$broadcast('search-modal');
        $scope.modal.show();
      };
      $scope.closeModal = function (result) {
        if(result){
          $scope.searchParams = result;
          callback && callback();
        }
        $scope.modal.hide();
      };
      $scope.removeModal = function () {
        $scope.modal.remove();
      };
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });
      return modal;
    };

    return {
      initCommonSearchModal : initCommonSearchModal
    }
  })

.factory('appMainSer', ['$ionicPopup','commonSer','$q','CONSTANT','$rootScope',function($ionicPopup,commonSer,$q,CONSTANT,$rootScope) {
  return {
    neuShowPopup: function (detail,btnTitle) {
      var popup = $ionicPopup.show({
        title: '<div class="popup-title-close">提示</div><div class="icon ion-close-round assertive popup-icon-close"></div>',
        template: '<div style="font-size: 16px;color: #4d4d4d;margin-left: 10px">'+detail+'</div>',
        buttons:[{
          text:"取消",
          type:'button-stable',
          onTap: function (e) {
            return false;
          }
        },
        {
          text:btnTitle,
          type:'neu-hxBtn',
          onTap: function (e) {
            return true;
          }
        }]
      });
      return popup;
    },

    /*督办消息列表*/
    queryRcDbMessageList:function(requestParams){
      var deffer = $q.defer();
      requestParams.statusFlag = requestParams.statusFlag+"";
      //requestParams.account = "12001";
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_rcDbMessageAppBO_bo","queryRcDbMessageList",requestParams);
      var reqStyle = 'post';
      var debugId = 0;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*督办消息详情*/
    getRcDbMessageDetail:function(requestParams){
      var deffer = $q.defer();
      requestParams.statusFlag = requestParams.statusFlag+"";
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_rcDbMessageAppBO_bo","getRcDbMessageDetail",requestParams);
      var reqStyle = 'post';
      var debugId = 1;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*督办消息回复*/
    doReplyRcDbMessage:function(requestParams){
      var deffer = $q.defer();
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_rcDbMessageAppBO_bo","doReplyRcDbMessage",requestParams);
      var reqStyle = 'post';
      var debugId = 2;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*费用订单列表查询*/
    queryRcCsCostList:function(requestParams){
      var deffer = $q.defer();
      requestParams.statusFlag = requestParams.statusFlag+"";
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_rcCsCostAppBO_bo","queryRcCsCostList",requestParams);
      var reqStyle = 'post';
      var debugId = 3;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*费用订单详情查询*/
    getRcCsCostDetail:function(requestParams){
      var deffer = $q.defer();
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_rcCsCostAppBO_bo","getRcCsCostDetail",requestParams);
      var reqStyle = 'post';
      var debugId = 4;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*费用订单详情驳回/确认  */
    doConfirmRcCsCostDetail:function(requestParams){
      var deffer = $q.defer();
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_rcCsCostAppBO_bo","doConfirmRcCsCostDetail",requestParams);
      var reqStyle = 'post';
      var debugId = 2;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*差异列表查询*/
    queryhdDifferDetailList:function(requestParams){
      var deffer = $q.defer();
      requestParams.statusFlag = requestParams.statusFlag+"";
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_hdDifferAppBO_bo","queryhdDifferDetailList",requestParams);
      var reqStyle = 'post';
      var debugId = 5;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*差异详情查询*/
    queryhdDifferDetailInfo:function(requestParams){
      var deffer = $q.defer();
      requestParams.statusFlag = requestParams.statusFlag+"";
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_hdDifferAppBO_bo","queryhdDifferDetailInfo",requestParams);
      var reqStyle = 'post';
      var debugId = 6;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*差异高级查询*/
    queryhdDifferAdvancedQueryInfo:function(requestParams){
      var deffer = $q.defer();
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_hdDifferAppBO_bo","queryhdDifferAdvancedQueryInfo",requestParams);
      var reqStyle = 'post';
      var debugId = 7;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*差异高级查询*/
    doConfirmHdDifferDetail:function(requestParams){
      var deffer = $q.defer();
      console.log(requestParams);
      requestParams = JSON.stringify(requestParams);
      var url = commonSer.getUrl("app_hdDifferAppBO_bo","doConfirmHdDifferDetail",requestParams);
      var reqStyle = 'post';
      var debugId = 999;
      var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
        return res;
      }, function (error) {
        return error;
      });
      result ? deffer.resolve(result) : deffer.reject(result);
      return deffer.promise;
    },
    /*代办数量*/
    queryTodoNumInfo:function(requestParams){
        var deffer = $q.defer();
        console.log(requestParams);
        requestParams = JSON.stringify(requestParams);
        var url = commonSer.getUrl("app_commonAppBO_bo","queryTodoNumInfo",requestParams);
        var reqStyle = 'post';
        var debugId = 10;
        var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
            return res;
        }, function (error) {
            return error;
        });
        result ? deffer.resolve(result) : deffer.reject(result);
        return deffer.promise;
    },
    /*权限菜单*/
      getSysMenuListByUserInfo:function(requestParams){
          var deffer = $q.defer();
          console.log(requestParams);
          requestParams = JSON.stringify(requestParams);
          var url = commonSer.getUrl("sysMenuService","getSysMenuListByUserInfo",requestParams,CONSTANT.specific_base_url);
          var reqStyle = 'post';
          var debugId = 11;
          var result = commonSer.httpRequest(reqStyle,url,debugId).then(function(res) {
              return res;
          }, function (error) {
              return error;
          });
          result ? deffer.resolve(result) : deffer.reject(result);
          return deffer.promise;
      },
    wxCheck:function () {
      console.log($rootScope.hasCheckedWx);
      var differ = $q.defer();
      if($rootScope.hasCheckedWx){//已经验证或绑定过
        differ.resolve(true);
        return differ.promise;
      }else if(CONSTANT.debug||!CONSTANT.isWX){
        console.log("debug....");
        commonSer.setLocal({'key':'account','data':'12001'});
        //验证成功
        differ.resolve(true);
        $rootScope.hasCheckedWx = true;
        return differ.promise;
        //验证失败
        //var testStateId = commonSer.GetQueryString("state");
        //differ.reject(false);
        //window.location.href = CONSTANT.wx_author_step1+'appid='+CONSTANT.wx_appId+'&redirect_uri='+CONSTANT.wx_redirect_uri+'&response_type=code&scope=snsapi_base&state='+testStateId+'#wechat_redirect';
        //return differ.promise;
      } else{
        var wx_code = commonSer.GetQueryString("code");
        var stateId = commonSer.GetQueryString("state");
        console.log(wx_code);
        console.log(stateId);
        var result = commonSer.wxCheck(wx_code,8).then(function (res) {
          console.log('test 校验');
          console.log(res);
          if(res&&res.CODE=="200"){
            console.log(res);
            //校验成功保存用户id
            commonSer.setLocal({'key':'account','data':res.DATAS.account});
            //已经验证过不需要重复验证
            $rootScope.hasCheckedWx = true;
            return true;
          }else{
            //失败  重新获取code并跳转登录界面
            window.location.href = CONSTANT.wx_author_step1+'appid='+CONSTANT.wx_appId+'&redirect_uri='+CONSTANT.wx_redirect_uri+'&response_type=code&scope=snsapi_base&state='+stateId+'#wechat_redirect';
          }
        });
        differ.resolve(result);
        return differ.promise;
      }

  }


  };
}])


;
