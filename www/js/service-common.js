/**
 * Created by wyh on 2016/11/14.
 */
angular.module('starter.services.common',[])
  .factory('commonSer',["$http", "$q",'CONSTANT','$state','$ionicLoading','$ionicPopup','$timeout','$rootScope','$location','digestSer'
    ,function($http,$q,CONSTANT,$state,$ionicLoading,$ionicPopup,$timeout,$rootScope,$location,digest){

      //生成加密header
      function makeHeader(boId,methodName){
        var _header = {'Content-Type':'application/x-www-form-urlencoded','account':'','securityId':''};
        var account = JSON.parse(window.localStorage["account"]) || null;
        var bjUrl = boId+"#"+methodName;
        _header.account = account;
        _header.securityId = digest.hex_hmac_sha256(bjUrl,account);
        return _header;
      }

      return {
        getUrl:function(boId,methodName,parameters,url){
          var reqParams = {"url":'',"header":''};
          if(url){
              reqParams.url = url + "&boId="+ boId + "&methodName="+ methodName + "&returnType=json&parameters=[{String:" + parameters + "}]";
          }else{
              reqParams.url = CONSTANT.https_base_url + "&boId="+ boId + "&methodName="+ methodName + "&returnType=json&parameters=[{String:" + parameters + "}]";
          }
          reqParams.header = makeHeader(boId,methodName);
          /*reqParams.header = {'Content-Type':'application/x-www-form-urlencoded'};*/
          console.log(reqParams);
          return reqParams
        },

        //微信校验
        wxCheck:function(wxCode,id){
          var i = $q.defer();
          //var url = CONSTANT.https_base_url + 'callback=JSON_CALLBACK&boId=app_checkLoginAppBO_bo&methodName=doCheckLogin&returnType=json&parameters=[{String:{code:"'+wxCode+'"}}]';
          var url = CONSTANT.https_base_url + 'boId=app_checkLoginAppBO_bo&methodName=doCheckLogin&returnType=json&parameters=[{String:{code:"'+wxCode+'"}}]';
          if(!CONSTANT.debug){
            $http({
              method: 'POST',
              timeout: 20 * 1000,
              url:url,
              headers:"{'Content-Type':'application/x-www-form-urlencoded'}"
            }).success(function(result){
              i.resolve(result);
            }).error(function (error) {
              i.resolve(false)
            });
          }else{
            console.log("debug.....");
            $http.get("data/test-data.json").success(function(o){
              i.resolve(o[id]);
            }).error(function(){
              i.resolve(false);
            });
          }
          return i.promise;
        },
        //微信绑定
        wxBinding:function(wxCode,account,password,id){
          password = BASE64.encoder(password);
          console.log(password);
          var i = $q.defer();
          var url = CONSTANT.https_base_url + 'boId=app_checkLoginAppBO_bo&methodName=doBindAccountByUserCode&returnType=json&parameters=[{String:{account:"'+account+'",password:"'+password+'",code:"'+wxCode+'"}}]';
          if(!CONSTANT.debug){
            $http({
              method: 'POST',
              timeout: 20 * 1000,
              url: url,
              headers:"{'Content-Type':'application/x-www-form-urlencoded'}"
            }).success(function(result){
              i.resolve(result);
            }).error(function (error) {
              i.resolve(false)
            });
          }else{
            console.log("debug.....");
            $http.get("data/test-data.json").success(function(o){
              console.log(o);
              i.resolve(o[id]);
            }).error(function(){
              i.resolve(false);
            });
          }
          return i.promise;
        },

        httpRequest : function (m,req,id) {
          var i = $q.defer();
          if(!CONSTANT.debug){
            $http({
             cache:false,
             method: m,
             timeout: 20 * 1000,
             url:req.url,
             headers:req.header,
             transformRequest: function(obj) {
               var str = [];
               for(var p in obj){
                 str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
               }
               return str.join("&");
             }
            }).success(function(result){
              i.resolve(result);
            }).error(function (error) {
              i.resolve(false)
            });
            return i.promise;
          }else{
            console.log("debug.....");
            $http.get("data/test-data.json").success(function(o){
              i.resolve(o[id]);
            }).error(function(){
              i.resolve(false);
            });
            return i.promise;
          }
        },

        /*存储session信息*/
        setLocal: function (e) {
          e.data && (e.data = JSON.stringify(e.data)),
            window.localStorage[e.key] = e.data
        },

        /*获取session信息*/
        getLocal: function (e) {
          var o = window.localStorage[e];
          return o ? JSON.parse(o) : null
        },

        /*清除session信息*/
        removeLocal: function (e) {
          window.localStorage.removeItem(e);
        },
        /*提示*/
        reminder: function(mes){
          $ionicLoading.show({
            template:mes,
            noBackdrop:true,
            duration: 1500
          })
        },

        reminderLong: function(mes){
          $ionicLoading.show({
            template:mes,
            noBackdrop:true,
            duration: 2500
          })
        },

        //加载等待20秒后自动隐藏
        showLoad: function () {
          $ionicLoading.show({
            animation:'android',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
          $timeout(function () {
            $ionicLoading.hide()
          },20000)
        },
          //加载等待20秒后自动隐藏
          showSLoad: function () {
              $ionicLoading.show({
                  showBackdrop: false,
                  maxWidth: 0,
                  showDelay: 0
              });
              $timeout(function () {
                  $ionicLoading.hide()
              },500)
          },
        //隐藏加载等待
        hideLoad: function () {
          $ionicLoading.hide()
        },

        //验证链接合法性
        checkLink:function () {
          var lWys = window.sessionStorage.getItem('wys');
          var nWys = this.getLocal('wys');
          if(nWys == lWys){
            return true;
          }else{
            $state.go('error');
          }
        },
        //获取地址栏参数
        GetQueryString: function (name){
          var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          var res;
          r!=null ? res = unescape(r[2]) : res = null;
          return res;

        },
        getQueryString:function () {
          var url = window.location.hash.split("?");
            url = url.length>1 ? '?'+url[1] : "adc";
            console.log(url);

          //正常截取
         /* var url = location.search; //获取url中"?"符后的字串
            console.log(url);*/
          var theRequest = new Object();
          if (url.indexOf("?") != -1) {
              var str = url.substr(1);
              strs = str.split("&");
              for(var i = 0; i < strs.length; i ++) {
                  theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
              }
          }
          return theRequest;
        }

      }
    }]);

