const Gym = require('../Models/gym');
const Member = require('../Models/member');
const Membership = require('../Models/membership');


exports.getAllMember = async(req,res)=>{
    try{

        const {skip,limit} = req.query;
        const members = await Member.find({gym:req.gym._id});
        const totalMember = members.length;

        const limitedMembers = await Member.find({gym:req.gym._id}).sort({ createdAt: -1 }).skip(skip).limit(limit);
        res.status(200).json({
            message:members.length?"Fetched Members Successfully":"No any Member Registered yet",
            members:limitedMembers,
            totalMembers:totalMember
        })

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }

}

function addMonthsToDate(months,joiningDate){
    // Get current year, month, and day
    let today = joiningDate;
    const currentYear = today. getFullYear();
    const currentMonth = today.getMonth(); // Months are 0-indexed
    const currentDay = today.getDate();
    // Calculate the new month and year
    const futureMonth = currentMonth + months;
    const futureYear = currentYear + Math. floor(futureMonth / 12);
    // Calculate the correct future month (modulus for month)
    const adjustedMonth = futureMonth % 12;

    // Set the date to the first of the future month
    const futureDate = new Date(futureYear, adjustedMonth, 1);

    // Get the last day of the future month
    const lastDayOfFutureMonth = new Date(futureYear, adjustedMonth + 1, 0) .getDate();

    // Adjust the day if current day exceeds the number of days in the new month
    const adjustedDay = Math.min(currentDay, lastDayOfFutureMonth);

    // Set the final adjusted day
    futureDate.setDate(adjustedDay);
    return futureDate;
}

exports.registerMember = async(req,res)=>{
    try{
        const {name,mobileNo,address,membership,profilePic,joiningDate} = req.body;
        const member = await Member.findOne({gym:req.gym._id,mobileNo});
        if(member){
            return res.status(409).json({ error: 'Already registered with this Mobile No' });
        }

        const memberShip = await Membership.findOne({_id:membership,gym:req.gym._id});
        const membershipMonth = memberShip.months;
        if(memberShip){
            let jngDate = new Date(joiningDate);
            const nextBillDate = addMonthsToDate(membershipMonth,jngDate);
            let newmember = new Member({name,mobileNo,address,membership,gym:req.gym._id,profilePic,nextBillDate});
            await newmember.save();
            res.status(200).json({message:"Member Registered Successfully",newmember})

        }else{
            return res.status(409).json({error:"No such Membership are there"})
        }


    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.searchMember = async(req,res)=>{
    try{
        const {searchTerm} = req.query;
        const member = await Member.find({gym:req.gym._id,
            $or:[{name:{$regex : '^' + searchTerm, $options:'i'}},
                {mobileNo:{$regex : '^' + searchTerm, $options:'i'}}
            ]

        });
        res.status(200).json({
            message:member.length?"Fetched Members Successfully":"No Such Registered yet",
            members:member,
            totalMembers:member.length
        })

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }

}



exports.monthlyMember = async(req,res)=>{
    try{
        const now = new Date();

        // Get the first day of the current month (e.g., 2024-11-30 00:00:00)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get the last day of the current month (eg., 2024-09-30 23:59:59)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 999);

        const member = await Member.find({gym:req.gym._id,
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).sort({ createdAt: -1});

        res.status(200).json({
            message:member.length?"Fetched Members Successfully":"No Such Registered yet",
            members:member,
            totalMembers:member.length
        })

        

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.expiringWithin3Days = async(req,res)=>{
    try{
        const today = new Date();
        const nextThreeDays = new Date();
        nextThreeDays.setDate(today.getDate() +3);

        const member = await Member.find({ gym:req.gym._id,
            nextBillDate: {
                $gte: today,        // Greater than or equal to today
                $lte: nextThreeDays  // Less than or equal to 3 days from today
                }
            });
            res.status(200).json({
                message:member.length?"Fetched Members Successfully":"No Such Member is expiring within 3 days",
                members:member,
                totalMembers:member.length
            })

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.expiringWithIn4To7Days = async(req,res)=>{
    try{
        const today = new Date();
        const next4Days = new Date();
        next4Days.setDate(today.getDate()+4);
        
        const next7Days = new Date();
        next7Days.setDate(today.getDate()+7);
        
        const member = await Member.find({ gym:req.gym._id,
            nextBillDate: {
                $gte: next4Days,    // Greater than or equal to 4 days later from today

                $lte: next7Days     // Less than or equal to 7 days from today
            }
          });
        res.status(200).json({
            message:member.length?"Fetched Members SuccessFully":"No Such Member is Expiring within 4-7 Days",
            members:member,
            totalMembers:member.length
        });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }

}

exports.expiredMember = async(req,res)=>{
    try{
        const today = new Date();
        
        const member = await Member.find({gym:req.gym._id,status:"Active",
            nextBillDate:{
                $lt: today
            }
        })

        res.status(200).json({
            message:member.length?"Fetched Members SuccessFully":"No Such Member is has been Expired.",
            members:member,
            totalMembers:member.length
        });

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }

}


exports.inActiveMember = async(req,res)=>{
    try{
        const member = await Member.find({gym:req.gym._id, status:"Pending"});
        res.status(200).json({
            message:member. length?"Fetched Members SuccessFully":"No Such Member is Pending",
            members : member,
            totalMembers:member.length
        })

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.getMemberDetails = async(req,res)=>{
    try{
        const {id} = req.params;
        const member = await Member.findOne({_id:id,gym:req.gym._id});
        if(!member){
            return res.status(400).json({
                error:"No Such Member"
            })
        }
        res.status(200). json({
            message:"Member Data fetched",
            member:member
        })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.changeStatus = async(req,res)=>{
    try{
        const {id} = req.params;
        const {status} = req.body;
        const member = await Member.findOne({_id:id,gym:req.gym._id});
        if(!member){
            return res.status(400).json({
                error:"No Such Member"
            })
        }
        member.status = status;
        await member.save();
        res.status(200).json({
            message:"Status Changed Successfully"
        });


    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }
}

exports.UpdateMemberPlan = async(req,res)=>{
    try{
        const {membership} = req.body;
        const {id} = req.params;
        const memberShip = await Membership.findOne({gym:req.gym._id,_id:membership});
        if(memberShip){
            let getMonth = memberShip.months;
            let today = new Date();
            let nextBillDate = addMonthsToDate(getMonth,today);
            const member = await Member.findOne({gym:req.gym._id,_id:id});
            if(!member){
                return res.status(409).json({error:"No such Member are there"})
            }
            member.nextBillDate = nextBillDate;
            member.lastPayment = today;

            await member.save();
            res.status(200).json({message:"Member Renewed Successfully",member});

        }else{
            return res.status(409).json({error:"No such Membership are there"})
        }

    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Server error' });
    }

}