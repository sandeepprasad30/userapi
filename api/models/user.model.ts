import * as mongoose from "mongoose";
import LdapSearch  from "../config/ldap";
import * as _ from "lodash";
import assert = require('assert');
import Promise = require('bluebird');

export interface IUser extends mongoose.Document {
    UserName: string;
    FirstName: string;
    LastName: string;
    FullName: string;
    EmailAddress: string;
    Title: string;
    EmployeeType: string;
    Country: string;
    Status: string;
    Organization: string;
    findUser(username: string): string;
}

export const schema = new mongoose.Schema({
  'UserName':
    {
      'type': String,
      'required': true,
      'index': true,
      'unique': true
    },
  'FirstName':
    {
      'type': String,
      'required': true
    },
  'LastName':
    {
      'type': String,
      'required': true
    },
  'FullName':
    {
      'type': String,
      'required': true
    },
  'EmailAddress':
    {
      'type': String,
      'required': true
    },
  'Title':
    {
      'type': String,
      'required': false
    },
  'EmployeeType':
    {
      'type': String,
      'required': false
    },
  'Country':
    {
      'type': String,
      'required': false
    },
  'Status':
    {
      'type': String,
      'default': 'ACTIVE'
    },
  'Organization':
    {
      'type': String,
      'default': ''
    },
  'Permissions':
    {
      'type': Array,
      'default': []
    }
}, { timestamps: { AccountCreated: "created_at", LastLogin: "updated_at" } });

schema.pre("save", function (next) {
    next();
});

schema.pre("update", function (next) {
    next();
});

schema.methods.findUser = function(username: string) : any {
  return Promise.join(model.findOne({ UserName: username }).exec(), LdapSearch.searchUser(username),
  function(userData, ldapDetails){
    if(!_.isObject(userData) && !_.isString(ldapDetails.uid)){
      return Promise.resolve();
    }
    if(!userData){
      var user =new model({
          'FirstName': ldapDetails.givenName,
          'LastName': ldapDetails.sn,
          'FullName': ldapDetails.givenName +' '+ldapDetails.sn,
          'UserName': ldapDetails.uid,
          'EmailAddress': ldapDetails.mail,
          'JobTitle': ldapDetails.title,
          'Country': ldapDetails.co,
          'EmployeeType': ldapDetails.employeeType || '',
          'status':'ACTIVE'
        });

      return user.save().then(data => {return data});
    }
    else{
      var updateUser ={
          'FirstName': ldapDetails.givenName,
          'LastName': ldapDetails.sn,
          'FullName': ldapDetails.givenName +' '+ldapDetails.sn,
          'UserName': ldapDetails.uid,
          'EmailAddress': ldapDetails.mail,
          'JobTitle': ldapDetails.title,
          'Country': ldapDetails.co,
          'EmployeeType': ldapDetails.employeeType || '',
          'status':'ACTIVE',
          'updatedAt':Date.now()
        };
      return model.findOneAndUpdate({ UserName:username }, { $set:updateUser }, { new:true }).then(data => {return data});
    }
  });
}



export const model = mongoose.model<IUser>("User", schema);

export const cleanCollection = () => model.remove({}).exec();



export default model;
