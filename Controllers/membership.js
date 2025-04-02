const Membership =require('../Models/membership');



exports.addMembership = async(req,res)=>{
    try{
        const {months, price} = req.body;
        const memberShip = await Membership.findOne({gym:req.gym._id,months});
        if(memberShip){
            memberShip.price = price;
            await memberShip.save();
            res.status(200).json({
                message:"Updated Sucessfully"
            })
        }else{
            const newMembership = new Membership({price,months,gym:req.gym._id});
            await newMembership.save();
            res.status(200).json({
                message:"Added Successfully",
                data:newMembership
            })
        }

    }catch(err){
        console.log(err);
        res.status(500).json({
            error:"Server Error"
        })
    }
}

exports.getmembership = async(req,res)=>{

    try{
        const loggedInId = req.gym._id;
        const memberShip = await Membership.find({gym:loggedInId});
        res.status(200).json({
            message:"Membership Fetched Successfully",
            membership : memberShip
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            error:"Server Error"
        })
    }

}