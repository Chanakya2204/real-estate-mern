const Listing = require('../Models/listing.model.js');
const { errorHandler } = require('../utils/error.js');
exports.createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (e) {
        next(e)
    }
}

exports.deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }
    if (req.user.id !== listing.userRef) {
        return next(401, 'You can only delete your own listings !')
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json('Listing has been deleted !')
    } catch (error) {
        next(error);
    }

}

exports.updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) return next(errorHandler(401, 'You can only update your own listings !'))

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedListing);
    } catch (e) {
        return next(e);
    }
}

exports.getListing=async (req,res,next)=>{
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) return next(errorHandler(404,'Listing not found'));
        return res.status(200).json(listing)
    } catch (e) {
        return next(e)
    }
}

exports.getListings=async (req,res,next)=>{
        try {
            const limit = parseInt(req.query.limit) || 9;
            const startIndex =parseInt(req.query.startIndex) || 0;
            let offer=req.query.offer;

            if(offer === undefined || offer === 'false'){
                offer ={$in :[false,true]} // isska mtlb woh dono dekhna chahta in default case offer wale b no offer wale b
            }

            let furnished = req.query.furnished;

            if(furnished === undefined || furnished === 'false'){
                furnished = {$in:[false,true]};
            }
            let parking = req.query.parking;

            if(parking === undefined || parking === 'false'){
                parking = {$in:[false,true]};
            }

            let type=req.query.type;

            if(type === undefined || type ==='all'){
                type={$in :['sale','rent']}
            }

            const searchTerm=req.query.searchTerm || '';
            const sort =req.query.sort || 'createdAt';
            const order=req.query.order || 'desc';

            console.log({offer,furnished,parking,type});
            
            const listings =await Listing.find({
                name:{$regex : searchTerm,$options:'i'}, // options of i means both upper and lower
                offer,
                furnished,
                parking,
                type,
            })
            .sort({[sort]:order})
            .limit(limit).skip(startIndex);

            return res.status(200).json(listings);

        } catch (error) {
            next(error.message)
        }
}