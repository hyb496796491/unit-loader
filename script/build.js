/**
 * @file build
 */
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const targetFolder = path.resolve(__dirname,'../src');
const distFolder = path.resolve(__dirname,'../dist');

try{
    console.log('npm package is buliding...');
    // remove and create dist
    child_process.execSync('rm -rf dist && mkdir dist');
    const files = fs.readdirSync(targetFolder,{withFileTypes: true});
    // copy file
    files.forEach((file)=>{
        fs.copyFileSync(path.resolve(targetFolder,file),path.resolve(distFolder,file));
    });
    // generate new package.json
    const newPackageJson = {};
    for(let key in packageJson){
        if(['devDependencies','husky','scripts'].indexOf(key) !== -1) continue;
        newPackageJson[key] = packageJson[key];
    }
    fs.writeFileSync(path.resolve(distFolder,'./package.json'),JSON.stringify(newPackageJson));
    console.log('bulid successful!');
}catch(error){
    console.error(error);
}

