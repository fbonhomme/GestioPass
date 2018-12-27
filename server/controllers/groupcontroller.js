const Group = require('../models/groupmodel');

exports.tous = (req, res) => {
    Group.find((err, groups) => {
        if(err) return next(err);
        res.json(groups);
    })
};
exports.group_create = (req, res) => {
    let group = new Group(
        {
            name: req.body.name,
            description: req.body.description
        }
    )
    group.save((err) => {
        if(err) {
            return next(err);
        }
        res.send('Group created succefully')
    })
};

exports.group_details = (req, res) => {
    Group.findById(req.params.id, (err, group) => {
        if (err) return next(err);
        res.send(group);
    })
};
exports.group_update = (req, res) => {
    Group.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, group) => {
        if (err) return next(err);
        res.send('Group updated.')
    })
};
exports.group_delete = (req, res) => {
    Group.findByIdAndRemove(req.params.id, (err) => {
        if(err) return next(err);
        res.send('Deleted succefully!')
    })
}

