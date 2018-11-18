/**
 * @file build
 */
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
const targetFolder = path.resolve(__dirname,'../src');
const distFolder = path.resolve(__dirname,'../dist');

function walkAndCopyFile(dir,dist){
    const files = fs.readdirSync(dir);
    if(!files) return;
    if(!Array.isArray(files)) files = [files];
    files.forEach((file)=>{
        const filePath = path.resolve(dir,file);
        const distPath = path.resolve(dist,file);
        const fileStat = fs.statSync(filePath);
        if(fileStat.isDirectory()){
            fs.mkdirSync(distPath);
            walkAndCopyFile(filePath,distPath);
        }
        if(fileStat.isFile()) fs.copyFileSync(filePath,distPath);
    });
}

try{
    console.log('npm package is buliding...');
    // remove and create dist
    child_process.execSync('rm -rf dist && mkdir dist');
    walkAndCopyFile(targetFolder,distFolder);
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

