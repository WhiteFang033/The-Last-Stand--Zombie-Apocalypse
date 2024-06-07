async function sleep(time){
    return new Promise((reject, resolve)=>{
        setTimeout(
            resolve(`${time}ms successfully wasted.`),
            time
        )
    })
}