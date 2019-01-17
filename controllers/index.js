
exports.get_index =  (req,res)=>{
        res.render('index',{username:"franck",
                            etat:true});
};

exports.get_dashboard = (req, res) => {
        res.render('dashboard',{
            etat:false,
            user: req.user
        });
    };