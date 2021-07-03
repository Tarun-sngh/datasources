const Test=require('../models/createdtest');

module.exports.addQuestions=(req,res)=>{
    //render
    // let codes=req.params.code.split("$");
    // console.log(codes[0],codes[1]);
    // return res.render('admin/add-question');
    let code=req.params.code;
    Test.find({_id:code},(err,result)=>{
        if(err){
            return res.render("home/error", {message:"something went wrong in get questionCreate"});
        }else{
            return res.render('admin/add-question',{test_id: code, data:result[0].questions});
        }
    })
}

module.exports.createQuestions=async (req,res)=>{
    //add question to database

    // return res.send(req.params.s_code);
//    var condition={
//        email:req.user.email,
//        s_code:req.params.s_code,
//        t_code:req.params.t_code
//    }

    var condition={
        _id:req.params.t_code
    }
   var obj={
        question:req.body.question,
        options:[req.body.option1,
                 req.body.option2,
                 req.body.option3,
                 req.body.option4],
        answer:req.body.answer,
        explation:req.body.explation
   }
   
    Test.updateOne(condition,{$push:{questions:obj}},(err,result)=>{
        if(err){
            // return res.send(err);
            return res.render('home/error',{message:"Error from question creation"});
        }
        else{
            // return res.redirect(`/questions/addQuestions/${req.params.s_code}$${req.params.t_code}`);
                return res.redirect('back');
        }
    });
    // return res.send('currently Question cannot be added!');
}

//delete question by index
module.exports.deleteQuestions=(req,res)=>{
    let codes=req.params.code.split("$");
    // let code=req.params.code;
    Test.find({_id:codes[0]},(err,result)=>{
        if(err){
            return res.render("home/error", {message:"something went wrong in get questionCreate"});
        }else{

            result[0].questions.splice(codes[1],1);

            // const index = array.indexOf(code);
            //     if (index > -1) {
            //     array.splice(index, 1);
            //     }

            // result[0].questions.forEach((Element)=>{
            //     if(Element._id==codes[1]){
            //         delete Element;
            //     }
            // })

            result[0].save((err)=>{
                if(err){
                    console.log("Error in deleting Question");
                    return res.send(err);
                }else{
                    return res.redirect(`/questions/addQuestions/${codes[0]}`);
                }
            });
        }
    })
}