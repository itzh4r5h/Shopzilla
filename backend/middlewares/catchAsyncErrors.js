module.exports = onResolve => (req,res,next)=>{
    Promise.resolve(onResolve(req,res,next)).catch(next)
}