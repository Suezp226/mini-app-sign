var https = require("https");
var qs = require("querystring");

const superagent = require('superagent');


// https.get(
//   {
//     hostname: "aip.baidubce.com",
//     path: "/oauth/2.0/token?" + param,
//     agent: false,
//   },
//   function (res) {
//     // 在标准输出中查看运行结果
//     res.pipe(process.stdout);
//   }
// );

// 获取 access_token

const param = qs.stringify({
    grant_type: "client_credentials",
    client_id: "nHWKB70UCG2vewliEKwx8EME",
    client_secret: "QDCKaLg3PTgeydva7dvqz6pZBmxjhAdM",
  })


superagent
   .post('https://aip.baidubce.com/oauth/2.0/token?'+param)
   .set('Accept','application/json')
   .send({})
   .end((err,res)=>{
       console.log('superagent',res.body.access_token)
    superagent
        .post('https://aip.baidubce.com/rpc/2.0/brain/solution/faceprint/verifyToken/generate?access_token='+res.body.access_token)
        .set('Accept','application/json')
        .send({"plan_id":12669})
        .end((err,res2)=>{
            console.log('在这',res2.body)
            
            

        })
   })

//  verify_token: 'myYSvFgFJLmlOyz5if2xUYj2'



// 获取verify_token 

// const param1 = {
//     access_token: '25.657019eed76eaec1c78700294b97ed3b.315360000.1947221780.282335-24865354',
//     plan_id : 12582
// }




// let obj = {
//   refresh_token:
//     "25.657019eed76eaec1c78700294b97ed3b.315360000.1947221780.282335-24865354",
//   expires_in: 2592000,
//   session_key:
//     "9mzdAqcCtkZtwIA3Ds11TOgUvcPKdzdNuRxtCjQJnh6aRxpa4GfUhfyuBVVAD3NoDZT7piEvYdqJ77WJdMU71enwj4fN8w==",
//   access_token:
//     "24.9e92cc644fbc7fbc2ded01634e8110c7.2592000.1634453780.282335-24865354",
//   scope:
//     "brain_solution_faceprint public vis-ocr_ocr brain_all_scope brain_ocr_idcard vis-faceverify_faceverify_h5-face-liveness vis-faceverify_FACE_V3 vis-faceverify_FACE_Police vis-faceverify_idl_face_merge vis-faceverify_FACE_EFFECT vis-faceverify_face_beauty vis-faceverify_face_feature_sdk brain_phone_verify brain_\u5728\u7ebf\u56fe\u7247\u6d3b\u4f53\u68c0\u6d4b wise_adapt lebo_resource_base lightservice_public hetu_basic lightcms_map_poi kaidian_kaidian ApsMisTest_Test\u6743\u9650 vis-classify_flower lpq_\u5f00\u653e cop_helloScope ApsMis_fangdi_permission smartapp_snsapi_base smartapp_mapp_dev_manage iop_autocar oauth_tp_app smartapp_smart_game_openapi oauth_sessionkey smartapp_swanid_verify smartapp_opensource_openapi smartapp_opensource_recapi fake_face_detect_\u5f00\u653eScope vis-ocr_\u865a\u62df\u4eba\u7269\u52a9\u7406 idl-video_\u865a\u62df\u4eba\u7269\u52a9\u7406 smartapp_component smartapp_search_plugin avatar_video_test",
//   session_secret: "a44f171780744532eba261f15d251754",
// };

