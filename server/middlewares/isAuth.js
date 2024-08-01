const isAuth = (req,res,next)=>{
  if(!req.session.user){
    console.log("Unauthorized - not login")
    res.redirect("/login")
    return
  }
  next()
}

const isAuthLogin = (req,res,next)=>{
  if(req.session.user){
    console.log("Unauthorized - was login")
    if(req.session.user.role == "admin"){
      res.redirect("/admin")
    } else {
      res.redirect("/")
    }
    return
  }
  next()
}

const isAdmin = (req, res, next) => {
  if(req.session.user.role != "admin"){
    console.log(("Unauthorized - not Admin"))
    res.status(401).render("pages/clients/errors/401.njk");
    return
  }
  next()
}

  
  module.exports = {isAuth, isAuthLogin, isAdmin}