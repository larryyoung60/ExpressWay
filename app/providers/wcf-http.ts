import {Injectable} from '@angular/core';
import {Http, RequestOptions, XHRBackend} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WcfHttp extends Http {
  static get parameters(){
    return [[XHRBackend] , [RequestOptions]]
  }  

  constructor(_backend , _defaultOptions) {
    _defaultOptions.headers.append('Content-Type', "text/xml;charset=UTF-8");
    super(_backend, _defaultOptions);    
    //this._backend = _backend;
    //this._defaultOptions = _defaultOptions;
  }
  
  parseXml(xml) {
    var dom = (new DOMParser()).parseFromString(xml, "text/xml");
    return dom.querySelector("CD_GetAssociateTunnelSResult");
  }
  
  post(url, body, options){
    console.log(options)
    return super.post(url, body , options);
    /*
    .catch(res => {
      console.log(res);
    });
    */
  }
}
