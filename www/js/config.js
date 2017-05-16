/**
 * Created by wyh on 2016/11/25.
 * 定义常量，错误信息提示等
 */
angular.module('starter.config',[])
  .constant('CONSTANT',{
    "debug":false,
    "isWX":false,
    "https_base_url":"http://10.19.32.171:7001/rs/appRestServlet?",//服务地址
     "specific_base_url":"http://10.19.32.171:7001/hmp/appRestServlet?",//权限菜单调用地址
    //"https_base_url":"http://192.168.1.105:8080/framework/appRestServlet?",
    "wx_appId":"wx540fa2a00cd48529",
    "wx_redirect_uri":"http%3A%2F%2F192.168.0.109:6334%2Fwww%2Findex.html%23/login",//微信回调地址 登录
    "wx_author_step1":"https://open.weixin.qq.com/connect/oauth2/authorize?",//微信获取code服务接口地址
    "info_service_error":"服务连接异常！",
    "info_loadData_error":"网络异常！",
    "info_login_error":"登录失败，请联系管理员！",
    "login_failed_remind":"用户名或密码错误！",
    "login_failed_no_permissions":"该用户无登录权限！",
    "sys_error_common":"系统数据异常，请联系管理员！编号：",
    "feiyong_operation_limit":"当前单据状态不能做通过操作！",
    "connect_timeout_mes":"连接服务器超时！",
    "illegal_link_worning":"非法请求！请重新验证或联系管理员！",
      "user_no_permissions":"当前用户无菜单权限"
  });

