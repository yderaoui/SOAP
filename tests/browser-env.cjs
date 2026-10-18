const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
let playwright;
for(const location of [process.env.SOAP_PLAYWRIGHT_PATH,'playwright',path.join(os.homedir(),'Desktop','$offline','node_modules','playwright')].filter(Boolean)){
 try{playwright=require(location);break;}catch{}
}
if(!playwright)throw new Error('Browser QA needs Playwright. Install it separately or set SOAP_PLAYWRIGHT_PATH to its module directory.');
const edge='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const executablePath=process.env.SOAP_BROWSER_PATH||(process.platform==='win32'&&fs.existsSync(edge)?edge:undefined);
const artifactDir=path.resolve(__dirname,'../qa-artifacts');fs.mkdirSync(artifactDir,{recursive:true});
module.exports={...playwright,launchOptions:{headless:true,...(executablePath?{executablePath}:{})},baseURL:process.env.SOAP_BASE_URL||'http://localhost:3000',artifact:name=>path.join(artifactDir,name)};
