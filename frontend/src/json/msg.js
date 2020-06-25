import store from '../store'
import eng from '../json/msg_en.json'
import kor from '../json/msg_ko.js'
 

 let ko = kor
 let en = eng

export function getGlobalMsg(key,params) {
    // console.log(eval(store.state.lang + "." + key)) 
    // console.log(params)
    // console.log(typeof params)
    // console.log(Array.isArray(params))

    let values = {}
    let msg = eval(store.state.lang + "." + key)

    if(typeof params == 'string') {
        values[0] = params
        msg = msg.replace('{txt1}',values[0])
    }
    else if(Array.isArray(params)) {
        values = params
        let arrToStr = ''
        for(let i =0; i<values.length;i++){
            if(msg.includes('{arr}')){
                arrToStr += values[i]+'님 '
                if(i==values.length-1){
                    msg = msg.replace('{arr}',arrToStr)    
                }
            }else{
                msg = msg.replace('{txt'+(i+1)+'}',values[i])
            }
        }
    }

    console.log(msg)
    return msg
}