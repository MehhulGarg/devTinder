const adminAuth = (req,res,next)=>{
    // auth logic for all calls on admin
    const token = 'xyz';
    const isAuthorized = token === 'xyz';
    if(!isAuthorized){
        res.status(401).send('Unauthorized Request');
    } else{
        next();
    }
};

module.exports = {adminAuth};