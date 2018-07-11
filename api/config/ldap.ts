import * as ldap from 'ldapjs';
import assert = require('assert');
import Promise = require('bluebird');
import * as _ from "lodash";

const internalClient = ldap.createClient({
  url: process.env.LDAP_INTERNAL_URL
});

const externalClient = ldap.createClient({
  url: process.env.LDAP_EXTERNAL_URL
});





class LdapSearch {

  searchUser = function (username: string): Promise <any> {
    return Promise.all([this.internalSearch(username), this.externalSearch(username)]).spread(function(internalUserData, externalUserData){
      //console.log(internalUserData);
      //console.log(externalUserData);
      const userData= _.extend(_.omit(internalUserData, ['dn', 'controls']), _.omit(externalUserData, ['dn', 'controls']));
      return Promise.resolve(userData);
    });
  };

  internalSearch = function(username: string): Promise<any> {
    const iOpts = {
      scope: 'one',
      attributes: ['cn','employeeType'],
      filter: 'cn='+username
    };
    return new Promise((resolve, reject) => {
      internalClient.bind(process.env.GENERIC_USER+'@cisco.com', process.env.GENERIC_PASSWORD,
        function(err)
        {
          if (err) {
            return reject(err);
          }

          internalClient.search(process.env.LDAP_INTERNAL_SEARCH_BASE, iOpts, function(err, res) {
            let internalUser;
            res.on('searchEntry', function(entry) {
              //console.log('internal: ' + JSON.stringify(entry.object));
              internalUser=entry.object
              //resolve(entry.object);
            });
            res.on('searchReference', function(referral) {
              console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function(err) {
              console.log('searchFailed') ;
              console.error('error: ' + err.message);
            });
            res.on('end', function(result) {
              //console.log('status: ' + result.status);
              if(_.isObject(internalUser)){
                resolve(internalUser);
              }
              else {
                resolve()
              }
            });
          });
        });

        }
      );
  }

  externalSearch = function(username: string): Promise<any> {

    const oOpts = {
      scope: 'one',
      attributes: ['uid', 'givenName', 'sn', 'mail', 'title', 'employeeType', 'co'],
      filter: 'uid='+username
    };

    return new Promise((resolve, reject) => {
      externalClient.bind(process.env.GENERIC_USER, process.env.GENERIC_PASSWORD,
        function(err)
        {
          if (err) {
            return reject(err);
          }

          externalClient.search(process.env.LDAP_EXTERNAL_SEARCH_BASE, oOpts, function(err, res) {
            let externalUser
            res.on('searchEntry', function(entry) {
              //console.log('external: ' + JSON.stringify(entry.object));
              externalUser=entry.object;
            });
            res.on('searchReference', function(referral) {
              console.log('referral: ' + referral.uris.join());
            });
            res.on('error', function(err) {
              console.error('error: ' + err.message);
            });
            res.on('end', function(result) {
              //console.log('status: ' + result.status);
              if(_.isObject(externalUser)){
                resolve(externalUser);
              }
              else {
                resolve()
              }
            });
          });
        });

        }
      );
  }

}

export default new LdapSearch();
