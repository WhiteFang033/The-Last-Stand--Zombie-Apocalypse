async function sleep(time){
    return new Promise((resolve, reject)=>{
        setTimeout(
            resolve(`${time}ms successfully wasted.`),
            time
        )
    })
}