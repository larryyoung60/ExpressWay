  import {Injectable} from '@angular/core';
  import {UserModel} from '../model/UserModel';
  
 export    class UserInfoModel {
        success: number;
        _currentUser:UserModel;
        ValidateCode:string;
    }
