const puppeteer = require('puppeteer');
var fs = require('fs');

(async (keyword) => {
    let start = new Date().getTime();
    // proxy authentication credentials (should move to file on machine) 
    // const proxyUrl = configFile.params.proxyUrl;
    // const username = configFile.params.username;
    // const password = configFile.params.password;
    const browser = await puppeteer.launch({
        args: [
        //   `--proxy-server=${proxyUrl}`,
          `--disable-infobars`, 
          '--disable-dev-shm-usage',
          '--disable-plugins-discovery',
          '--profile-directory=Default',],
        headless: true,
    });
  
const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36')
//   await page.authenticate({ username, password });
  await page.goto('https://www.basicbilliards.com');
  
  checkPath(keyword);
  fullPath = getFullPath(keyword);
  process.chdir("C:/Users/bares/puppeteer");
  await page.screenshot({ path: fullPath, fullPage: true });
  
  await browser.close();
  let end = new Date().getTime();
  let time = (end - start) / 1000;
  console.log("This function took " + time + " seconds to complete.")
})("test");



function getFilename(keyword){
    fileName = keyword + '.jpeg'
    return fileName;    
}

function getDate(){
    let datetime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    datetime = datetime.split(' ');
    let date = datetime[0];
    let dateArr =  date.split("-")
    let smallDate = dateArr.slice(1,3).join("-")
    return smallDate
}

function checkPath(keyword){
    month = getDate().split("-").slice(0,1);
    fullPath = "./" + keyword + "/" + month;
    keywordPath = "./" + keyword
    datePath = "./" + month
    
    // see if fullpath exists
    try{
      process.chdir(fullPath);
    }
    // if not check if keyword path exists and create a new date folder
    catch{
      try{
        process.chdir(keywordPath);
        console.log("Making directory for " + month);
        fs.mkdir(datePath, err => { 
          if (err && err.code != 'EEXIST') throw 'up'});
    }
    
      // if the keyword path doesn't exist, create a new keyword folder, change directory to that folder, then make a new date folder
      catch{
        fs.mkdir(keywordPath, err => { 
        if (err && err.code != 'EEXIST') throw 'up'});
        
        console.log("Making directory for " + keyword + " " + month);
        process.chdir(keywordPath);
        
        fs.mkdir(datePath, err => { 
        if (err && err.code != 'EEXIST') throw 'up'});

      }
    }
    
    return fullPath
  }

function getFullPath(keyword){
    fileName = getFilename(keyword)
    month = getDate().split("-").slice(0,1);
    fullPath = "./" + keyword + "/" + month + "/" + fileName;
    return fullPath
  }