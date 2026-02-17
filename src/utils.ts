export function random(len:number){
let ans="";
let options="abcdefghijklmnopqrstuvwxyz12345678910";
for(let i=0;i<len;i++){
ans+=options.charAt(Math.floor(Math.random()*options.length))
}    
return ans;
}