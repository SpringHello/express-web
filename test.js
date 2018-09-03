function factory() {
  return new Promise(function (resolve, reject) {
    console.log('promise')
    reject('你好')
  }).then(response=>{
    return 'hello'
  },err=>{
    return 'error'
  })
}

Promise.all([factory()]).then(response=>{
  console.log(response)
})
