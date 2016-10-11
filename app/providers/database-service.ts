import {Injectable} from '@angular/core';
import {Storage, SqlStorage, Events} from 'ionic-angular';
import * as _ from 'lodash';

@Injectable()
export class DatabaseService {
  
  public db:any;

  constructor(private events:Events) {
    try{
      this.db = window.openDatabase("expressway", '1.0', 'expressway', 5 * 1024 * 1024);
    }catch(e){
      alert("opendatabase:"+e.message)
    }
  }

  db2json(results) {
    var rows = results.rows;
    var rs = _.reduce(rows, function (items, n, i) {
      items[i] = rows.item(i);
      return items;
    }, []);
    return rs;
  }
  execute(sql, params, type):Promise<any> {
    let _this = this;
    if (params === void 0) { params = []; }
    return new Promise(function (resolve, reject) {
      try {
        _this.db.transaction(function (tx) {
          tx.executeSql(sql, params,
            function (tx, res) {
              //var items = $util.db2json(res);
              //return resolve({ tx: tx, res: items });
              var result;
              switch (type) {
                case "find":
                  result = _this.db2json(res)[0];
                  break;
                case "query":
                  result = _this.db2json(res);
                  break;
                case "run":
                  result = { tx: tx, res: res }
                  break;
              }
              resolve(result);
            },
            function (tx, err) {
              reject({ tx: tx, err: err });
            });
        }, function (err) {
          reject({ err: err });
        });
      } catch (err) {
        reject({ err: err });
      }
    });
  }
  find(sql:string , params?:any[]) {
    return this.execute(sql, params, "find");
  }
  query(sql:string, params?:any[]) {
    return this.execute(sql, params, "query");
  }
  run(sqls) {
    if (_.isString(sqls)) sqls = [sqls];
    return new Promise((resolve, reject) => {
      this.db.transaction(function (tx) {
        _.each(sqls, function (sql, i) {
          tx.executeSql(sql, [], function () {
            if (i == (sqls.length - 1).toString()) resolve();
          }, function (tx, error) {
            reject(error.message);
            //console.log(error)
          });
        });
      });
    });
  }
}
