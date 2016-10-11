import {Injectable} from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';

import {Http, RequestOptionsArgs, Headers} from '@angular/http';

import {AppConfig} from '../providers/app-config';

@Injectable()
export class Resource {

  constructor(private http: Http, private events: Events, private platform: Platform) {
  }

  /** 将xml字符串转换为xmlNode */
  parseXml(xml, rootNodeName) {
    var dom = (new DOMParser()).parseFromString(xml, "text/xml");
    var resultNode = dom.querySelector(rootNodeName);
    return resultNode || null;
  }
  /** xml转换为json */
  xml2json(res, rootNodeName) {
    var text = res.text();
    text = text.replace(/<a:/ig, "<").replace(/<\/a:/ig, "<\/").replace(/<s:/ig, "<").replace(/<\/s:/ig, "<\/");
    var xmlDom = this.parseXml(text, rootNodeName);
    if (!xmlDom) return null;
    var jsonString = Xml2Json(xmlDom, "");
    var json = JSON.parse(jsonString)[rootNodeName] || null;
    var result;
    if (_.isString(json)) {
      result = json;
    } else if (_.isArray(json)) {
      var key = _.findKey(json[0], function (o) { return !!o });
      result = _.map(json, key);
    } else if (_.isObject(json)) {
      var keys = _.keys(json);
      if (keys.length == 1) {
        result = [json[keys[0]]];
      } else {
        result = json;
      }
      //var key = _.findKey(json, function (o) { return !!o });
      //result = [json[key]];
    } else {
      result = "";
    }
    return result;
  }

  /** 发送送wcf请求 */
  request(method: string, body?: string, params?: RequestOptionsArgs): Promise<any> {
    let url = this.platform.is("mobile") ? AppConfig.apiUrl : AppConfig.devApiUrl;
    let headers = new Headers({
      'Content-Type': "text/xml;charset=UTF-8",
      "SOAPAction": "http://tempuri.org/IPDAService/" + method
    });
    params = params || {};
    params.method = method;
    return new Promise((resolve, reject) => {
      this.http.post(url, body, { headers: headers })
        //.map(res => this.xml2json(res , method+"Result"))
        .subscribe(
        res => {
          var rs = this.xml2json(res, method + "Result");
          //resolve(rs , res);
          resolve(rs);
        },
        err => {
          var body = err._body;
          let rs;
          switch (err.status){
            case 503:
              rs = body;
              break;
            default:
              if (_.isString(body)) {
                var errString = err.text() || body;
                if (errString && errString.indexOf("<") > -1) {
                  rs = this.xml2json(err, "Fault");
                } else {
                  rs = errString;
                }
                console.log(rs)
              } else {
                rs = "网络错误:返回无效的object";
              }
              break;
          }

          this.events.publish('httperror', rs, err);          
          //reject(rs , err);
          reject(rs);
        }
        );
    });
  }
  /** 登录验证 */
  checkLogin(loginInfo) {
    let method = "getLoginUserInfo",
      body = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ns="http://schemas.datacontract.org/2004/07/">
            <soapenv:Header/>
            <soapenv:Body>
                <tem:getLoginUserInfo>
                  <tem:p_userName>${loginInfo.username}</tem:p_userName>
                  <tem:p_passWord>${loginInfo.password}</tem:p_passWord>
                </tem:getLoginUserInfo>
            </soapenv:Body>
          </soapenv:Envelope>` ,
      params = loginInfo;
    return this.request(method, body, params);
  }

  /** GET方法 无参数*/
  get(method) {
    let body = `
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
        <s:Body/>
      </s:Envelope>`;
    return this.request(method, body);
  }
  /** 获取道路列表 */
  road() {
    return this.get("getAssociateRoadInfo");
  }
  /** 获取病害分类信息 */
  catalog() {
    return this.get("getCatalogInfo");
  }
  /** 获取负责人信息 */
  manager(){
    return this.get("getWeixiuFuzeRen");
  }
  /**整改分类信息 */
  correctioncatalog(){
    return this.get("getCheckCatalogs");
  }

  /** 获取病害图片 */
  getDiseaseImage(condition: { caseId: string, status: number }) {
    let method = "getCaseImage",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:getCaseImage>
                <tem:p_caseID>${condition.caseId}</tem:p_caseID>
                <tem:p_status>${condition.status || "1"}</tem:p_status>
              </tem:getCaseImage>
          </soapenv:Body>
        </soapenv:Envelope>   
        ` ,
      params = condition;
    return this.request(method, body, params);
  }



  /** 保存病害上报信息 */
  saveDisease(record: any, detail: any[]) {
    let method = "reportBasicInfos",
      detailBody = _.map(detail, item => {
        return `
          <ns:catalogInfo>
            <ns:catalog>${item.catalog}</ns:catalog>
            <ns:dealWith>${item.dealWith}</ns:dealWith>
            <ns:gongchengL>${item.gongchengL}</ns:gongchengL>
            <ns:jiliangDesc>${item.jiliangDesc}</ns:jiliangDesc>
            <ns:jiliangDescSave>${item.jiliangDescSave}</ns:jiliangDescSave>
            <ns:jiliangUnit>${item.jiliangUnit}</ns:jiliangUnit>
            <ns:parentCatalog>${item.parentCatalog}</ns:parentCatalog>
            <ns:stakeNum>${item.stakeNum}</ns:stakeNum>
            <ns:subName>${item.subName}</ns:subName>
            <ns:sunhuaiqingkuang>${item.sunhuaiqingkuang}</ns:sunhuaiqingkuang>
            <ns:timelist>${item.timelist}</ns:timelist>
            <ns:weixiuFangAn>${item.weixiuFangAn}</ns:weixiuFangAn>
          </ns:catalogInfo>
        `
      }).join(""),
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ns="http://schemas.datacontract.org/2004/07/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:reportBasicInfos>
                <tem:p_BasicInfo>
                  <ns:binghaiweizhi>${record.binghaiweizhi}</ns:binghaiweizhi>
                  <ns:caseID>${record.caseID}</ns:caseID>
                  <ns:catalog>${record.catalog}</ns:catalog>
                  <ns:chedao>${record.chedao}</ns:chedao>
                  <ns:companyID>${record.companyID}</ns:companyID>
                  <ns:dealwith>${record.dealwith}</ns:dealwith>
                  <ns:deptName>${record.deptName}</ns:deptName>            
                  <ns:fangxiang>${record.fangxiang}</ns:fangxiang>
                  <ns:memo>${record.memo}</ns:memo>
                  <ns:others>${record.others}</ns:others>
                  <ns:parentClg>${record.parentClg}</ns:parentClg>
                  <ns:reportTime>${record.reportTime}</ns:reportTime>
                  <ns:reporter>${record.reporter}</ns:reporter>
                  <ns:routeName>${record.routeName}</ns:routeName>
                  <ns:routeNum>${record.routeNum}</ns:routeNum>
                  <ns:stakeNum>${record.stakeNum}</ns:stakeNum>
                  <ns:subClg>${record.subClg}</ns:subClg>
                  <ns:truename>${record.truename}</ns:truename>
                  <ns:userID>${record.userID}</ns:userID>
                  <ns:x>${record.x}</ns:x>
                  <ns:y>${record.y}</ns:y>
                </tem:p_BasicInfo>
                <tem:p_Catalogs>
                  ${detailBody}
                </tem:p_Catalogs>
              </tem:reportBasicInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = record;
    //console.log(body)
    return this.request(method, body, params);
  }

  /** 查询维修任务 */
  getMaintainTask(condition: { companyId: string; startDate: string; endDate: string }) {
    let method = "getWeixiuTaskInfos",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:getWeixiuTaskInfos>
                <tem:p_companyID>${condition.companyId}</tem:p_companyID>
              </tem:getWeixiuTaskInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = condition;
    return this.request(method, body, params);
  }

  /** 保存维修任务反馈信息 */
  saveMaintainTask(record, detail:any[]) {
    let method = "feedbackWeixiuInfos",
      detailBody = _.map(detail, item => {
        return `
          <ns:yuguGongchengliang>
            <ns:caseID>${item.caseID}</ns:caseID>
            <ns:catalog>${item.catalog}</ns:catalog>
            <ns:gongchengLiang>${item.gongchengL}</ns:gongchengLiang>
            <ns:jlDesc>${item.jiliangDesc}</ns:jlDesc>
            <ns:jlDescNew>${item.jiliangDescSave}</ns:jlDescNew>
            <ns:jlUnit>${item.jiliangUnit}</ns:jlUnit>
            <ns:stakeNum>${item.stakeNum}</ns:stakeNum>
            <ns:weixiuFangAn>${item.weixiuFangAn}</ns:weixiuFangAn>
          </ns:yuguGongchengliang>
        `
      }).join(""),
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ns="http://schemas.datacontract.org/2004/07/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:feedbackWeixiuInfos>
                <tem:p_WeixiuInfos>
                  <ns:AskFinsihedTime>${record.AskFinsihedTime}</ns:AskFinsihedTime>
                  <ns:FeedbackDesc>${record.FeedbackDesc}</ns:FeedbackDesc>
                  <ns:FeedbackTime>${record.FeedbackTime}</ns:FeedbackTime>
                  <ns:SendsingleUserName>${record.SendsingleUserName}</ns:SendsingleUserName>
                  <ns:caseID>${record.caseID}</ns:caseID>
                  <ns:feedbackUser>${record.feedbackUser}</ns:feedbackUser>
                  <ns:fuzeUser>${record.fuzeUser}</ns:fuzeUser>
                  <ns:gongchengWeizhi>${record.gongchengWeizhi}</ns:gongchengWeizhi>
                  <ns:guanliDanwei>${record.guanliDanwei}</ns:guanliDanwei>
                  <ns:reportUserID>${record.reportUserID}</ns:reportUserID>
                  <ns:reportUsername>${record.reportUsername}</ns:reportUsername>
                  <ns:routeName>${record.routeName}</ns:routeName>
                  <ns:weixiuDanwei>${record.weixiuDanwei}</ns:weixiuDanwei>
                  <ns:weixiuItem>${record.weixiuItem}</ns:weixiuItem>
                  <ns:xuhao>${record.xuhao}</ns:xuhao>
                  <ns:yuguGongchengliang>
                    ${detailBody}
                  </ns:yuguGongchengliang>
                </tem:p_WeixiuInfos>
              </tem:feedbackWeixiuInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = record;
    return this.request(method, body, params);

  }



  /** 查询验收任务 */
  getAcceptanceTask(condition: { companyId: string;}) {
    let method = "getYanshouTaskInfos",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:getYanshouTaskInfos>
                <tem:p_companyID>${condition.companyId}</tem:p_companyID>
              </tem:getYanshouTaskInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = condition;
    return this.request(method, body, params);
  }

  /** 保存验收任务反馈信息 */
  saveAcceptanceTask(record , detail:any[]) {

    let method = "feedbackYanshouInfos",
      detailBody = _.map(detail, item => {
        return `
          <ns:yuguGongchengliang>
            <ns:caseID>${item.caseID}</ns:caseID>
            <ns:catalog>${item.catalog}</ns:catalog>
            <ns:gongchengLiang>${item.gongchengL}</ns:gongchengLiang>
            <ns:jlDesc>${item.jiliangDesc}</ns:jlDesc>
            <ns:jlDescNew>${item.jiliangDescSave}</ns:jlDescNew>
            <ns:jlUnit>${item.jiliangUnit}</ns:jlUnit>
            <ns:stakeNum>${item.stakeNum}</ns:stakeNum>
            <ns:weixiuFangAn>${item.weixiuFangAn}</ns:weixiuFangAn>
          </ns:yuguGongchengliang>
        `
      }).join(""),
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ns="http://schemas.datacontract.org/2004/07/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:feedbackYanshouInfos>
                <tem:p_yanshouInfos>
                    <ns:AskFinsihedTime>${record.AskFinsihedTime}</ns:AskFinsihedTime>
                    <ns:AskPDAFinishedTime>${record.AskPDAFinishedTime}</ns:AskPDAFinishedTime>
                    <ns:CheckReporter>${record.CheckReporter}</ns:CheckReporter>
                    <ns:FeedbackTime>${record.CheckReporter}</ns:FeedbackTime>
                    <ns:IsAgreeAudit>${record.IsAgreeAudit}</ns:IsAgreeAudit>
                    <ns:IsView>${record.IsView}</ns:IsView>
                    <ns:ManageDeptChecker>${record.ManageDeptChecker}</ns:ManageDeptChecker>
                    <ns:MantanceManager>${record.MantanceManager}</ns:MantanceManager>
                    <ns:PDAFeedbackTime>${record.PDAFeedbackTime}</ns:PDAFeedbackTime>
                    <ns:PDAUsername>${record.PDAUsername}</ns:PDAUsername>
                    <ns:ReceivedUnitName>${record.ReceivedUnitName}</ns:ReceivedUnitName>
                    <ns:Remark>${record.Remark}</ns:Remark>
                    <ns:RepairDeptChecker>${record.RepairDeptChecker}</ns:RepairDeptChecker>
                    <ns:SendToPDATime>${record.SendToPDATime}</ns:SendToPDATime>
                    <ns:SendsingleTime>${record.SendsingleTime}</ns:SendsingleTime>
                    <ns:YanshouPaidanRen>${record.YanshouPaidanRen}</ns:YanshouPaidanRen>
                    <ns:caseID>${record.caseID}</ns:caseID>
                    <ns:gongchengweizhi>${record.gongchengweizhi}</ns:gongchengweizhi>
                    <ns:routeName>${record.routeName}</ns:routeName>
                    <ns:sendsingManager>${record.sendsingManager}</ns:sendsingManager>
                    <ns:weixiuFangAn>${record.weixiuFangAn}</ns:weixiuFangAn>
                    <ns:xuhao>${record.xuhao}</ns:xuhao>
                    <ns:yanghuXiangmu>${record.yanghuXiangmu}</ns:yanghuXiangmu>
                    <ns:yanshouFeedbackDesc>${record.yanshouFeedbackDesc}</ns:yanshouFeedbackDesc>
                    <ns:yuguGongchengliang>
                      ${detailBody}
                    </ns:yuguGongchengliang>
                </tem:p_yanshouInfos>
              </tem:feedbackYanshouInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = record;
    return this.request(method, body, params);
  }

  /** 保存整改通知 */
  saveCorrection(record) {
    let method = "reportCheckBasicInfos",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ns="http://schemas.datacontract.org/2004/07/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:reportCheckBasicInfos>
                <tem:p_checkInfos>
                    <ns:beizhu>${record.beizhu}</ns:beizhu>
                    <ns:caseCatalog>${record.caseCatalog}</ns:caseCatalog>
                    <ns:checkDate>${record.checkDate}</ns:checkDate>
                    <ns:chedao>${record.chedao}</ns:chedao>
                    <ns:companyID>${record.companyID}</ns:companyID>
                    <ns:fangxiang>${record.fangxiang}</ns:fangxiang>
                    <ns:highwayName>${record.highwayName}</ns:highwayName>
                    <ns:jianchaUnit>${record.jianchaUnit}</ns:jianchaUnit>
                    <ns:jianchaUsername>${record.jianchaUsername}</ns:jianchaUsername>
                    <ns:koufen>${record.koufen}</ns:koufen>
                    <ns:note>${record.note}</ns:note>
                    <ns:reporterID>${record.reporterID}</ns:reporterID>
                    <ns:reporterName>${record.reporterName}</ns:reporterName>
                    <ns:stakeNum>${record.stakeNum}</ns:stakeNum>
                    <ns:subCatalog>${record.subCatalog}</ns:subCatalog>
                    <ns:yanghuUnit>${record.yanghuUnit}</ns:yanghuUnit>
                    <ns:zhengaiYuanyin>${record.zhengaiYuanyin}</ns:zhengaiYuanyin>
                    <ns:zhenggaiFangshi>${record.zhenggaiFangshi}</ns:zhenggaiFangshi>
                    <ns:zhenggaiQixian>${record.zhenggaiQixian}</ns:zhenggaiQixian>
                    <ns:zhuanghaoweizhi>${record.zhuanghaoweizhi}</ns:zhuanghaoweizhi>
                </tem:p_checkInfos>
              </tem:reportCheckBasicInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = record;
    return this.request(method, body, params);
  }


  /** 查询整改复查任务 */
  getCorrectionTask(condition: { startTime:string;endTime:string;companyId: string;}) {
    let method = "getReporCheckedInfos",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:getReporCheckedInfos>
                <tem:p_companyID>${condition.companyId}</tem:p_companyID>
                <tem:p_startTime>${condition.startTime}</tem:p_startTime>
                <tem:p_endTime>${condition.endTime}</tem:p_endTime>
              </tem:getReporCheckedInfos>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = condition;
    return this.request(method, body, params);
  }


  /** 查询整改复查任务 */
  getCorrectionReviewTask(condition: { companyId: string;}) {
    let method = "getZhenggaiFuchaList",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:getZhenggaiFuchaList>
                <tem:p_companyID>${condition.companyId}</tem:p_companyID>
              </tem:getZhenggaiFuchaList>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = condition;
    return this.request(method, body, params);
  }


  /** 保存整改复查反馈 */
  saveCorrectionReview(record) {
    let method = "feedbackZhengGaiFu",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:ns="http://schemas.datacontract.org/2004/07/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:feedbackZhengGaiFu>
                <tem:p_zhenggaiFuchaInfo>
                  <ns:askFinishedDate>${record.askFinishedDate}</ns:askFinishedDate>
                  <ns:caseCatalog>${record.caseCatalog}</ns:caseCatalog>
                  <ns:caseID>${record.caseID}</ns:caseID>
                  <ns:checkDate>${record.checkDate}</ns:checkDate>
                  <ns:chedao>${record.chedao}</ns:chedao>
                  <ns:companyID>${record.companyID}</ns:companyID>
                  <ns:fangxiang>${record.fangxiang}</ns:fangxiang>
                  <ns:feedbackTime>${record.feedbackTime}</ns:feedbackTime>
                  <ns:feedbackUser>${record.feedbackUser}</ns:feedbackUser>
                  <ns:fuchaDesc>${record.fuchaDesc}</ns:fuchaDesc>
                  <ns:fuchaKoufen>${record.fuchaKoufen}</ns:fuchaKoufen>
                  <ns:fuchaMemo>${record.fuchaMemo}</ns:fuchaMemo>
                  <ns:fuchaResult>${record.fuchaResult}</ns:fuchaResult>
                  <ns:highwayName>${record.highwayName}</ns:highwayName>
                  <ns:jianchaUnit>${record.jianchaUnit}</ns:jianchaUnit>
                  <ns:jianchaUsername>${record.jianchaUsername}</ns:jianchaUsername>
                  <ns:koufen>${record.koufen}</ns:koufen>
                  <ns:padanTimes>${record.padanTimes}</ns:padanTimes>
                  <ns:reporterID>${record.reporterID}</ns:reporterID>
                  <ns:reporterName>${record.reporterName}</ns:reporterName>
                  <ns:stakeNum>${record.stakeNum}</ns:stakeNum>
                  <ns:subCatalog>${record.subCatalog}</ns:subCatalog>
                  <ns:yanghuUnit>${record.yanghuUnit}</ns:yanghuUnit>
                  <ns:zhengaiYuanyin>${record.zhengaiYuanyin}</ns:zhengaiYuanyin>
                  <ns:zhenggaiQixian>${record.zhenggaiQixian}</ns:zhenggaiQixian>
                  <ns:zhenggaiWanchengStatus>${record.zhenggaiWanchengStatus}</ns:zhenggaiWanchengStatus>
                  <ns:zhuanghaoweizhi>${record.zhuanghaoweizhi}</ns:zhuanghaoweizhi>
                </tem:p_zhenggaiFuchaInfo>
              </tem:feedbackZhengGaiFu>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = record;
    return this.request(method, body, params);
  }



  /** 保存巡查轨迹信息 */
  saveGpsTrack(record) {
    let method = "upLoadXY",
      body = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
          <soapenv:Header/>
          <soapenv:Body>
              <tem:upLoadXY>
                <tem:p_userName>${record.userName}</tem:p_userName>
                <tem:p_userID>${record.userId}</tem:p_userID>
                <tem:p_PDANumber>${record.phoneId}</tem:p_PDANumber>
                <tem:p_x>${record.x}</tem:p_x>
                <tem:p_y>${record.y}</tem:p_y>
                <tem:p_time>${record.getAt}</tem:p_time>
              </tem:upLoadXY>
          </soapenv:Body>
        </soapenv:Envelope>
        ` ,
      params = record;
    return this.request(method, body, params);
  }


}

