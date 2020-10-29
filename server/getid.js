function getid(){
    //生成用户id    
        let uid = '';
        let str = ['w','a','d','s','c','g','b','i','t','l','u','p'];
        let num = [1,2,3,5,6,4,7,8,9,0]; 
        num.map((item,index)=>{
                    let i = parseInt(Math.random()*10)
                    if(i%2==0){
                        let n = parseInt(Math.random()*12)   
                        uid+=str[n];
                    }else{
                        let z = parseInt(Math.random()*9)   
                        uid+=num[z];
                    }
        })
        return uid;
    }
module.exports = getid;   