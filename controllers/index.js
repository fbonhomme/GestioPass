
exports.get_index =  (req,res)=>{
        res.render('index',{username:"franck"});
};

exports.get_dashboard = (req, res) => {
        res.render('dashboard',{
            etat:true,
            user: req.user
        });
    };