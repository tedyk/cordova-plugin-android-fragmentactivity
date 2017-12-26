#!/usr/bin/env node

'use strict';

const fs = require('fs');
const _ = require('lodash');
const xml2js = require('xml2js');

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = function(context) {
  const parseString = xml2js.parseString;
  const builder = new xml2js.Builder();
  const manifestPath = context.opts.projectRoot + '/platforms/android/AndroidManifest.xml';
  const androidManifest = fs.readFileSync(manifestPath).toString();

  const activityPath = context.opts.projectRoot + '/plugins/cordova-plugin-android-fragmentactivity/src/android/MainActivity.java';
  const activity = fs.readFileSync(activityPath).toString();

  let manifestRoot, packageName, newActivity, newActivityPath;

  if (androidManifest) {
    parseString(androidManifest, (err, manifest) => {
      if (err) return console.error(err);

      manifestRoot = manifest['manifest'];
      packageName = manifestRoot['$']['package'];

      newActivity = activity.replace('${mypackage}', packageName);
      newActivityPath = 'platforms/android/src/' + packageName.replaceAll("\\.", "/") + '/MainActivity.java';

      console.log(newActivityPath);

      fs.writeFile(newActivityPath, newActivity, function(err) {
        if (err) {
          return console.log(err);
        }

        console.log("New MainActvity generated.");
      });
    });
  }
};
