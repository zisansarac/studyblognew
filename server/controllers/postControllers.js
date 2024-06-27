const StudyPlan = require('../models/postModel')
const User = require("../models/userModel")
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require("uuid")
const HttpError = require('../models/errorModel')



// CREATE A STUDY PLAN : api/posts
//PROTECTED
const createStudyPlan = async (req, res, next) => {
    try {
        let {title, category, description} = req.body;
        if (!title || !category || !description || !req.files ) {
            return next(new HttpError("Fill in all fields.",422));
        }
        // Check if req.files exists and if thumbnail is present
        
       const {thumbnail} = req.files;
       
        if(thumbnail.size > 2000000){
             return next(new HttpError("Thumbnail is too big. The file should be less than 2MB."))
        }
        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFileName = splittedFilename[0] + uuid() +"."+ splittedFilename[splittedFilename.length -1]
        thumbnail.mv(path.join(__dirname,'..','/uploads', newFileName), async(err) =>{
          if (err) {
            return next(new HttpError(err))
          } else{
            const newStudyPlan = await StudyPlan.create({title, category, description, thumbnail: newFileName, creator: req.user.id})
            if(!newStudyPlan){
                return next(new HttpError("Study plan couldn't be created.",422))
            }
            //find user and increase post count by 1
             const currentUser = await User.findById(req.user.id);
             const userPlanCount = currentUser.posts +1;
            await User.findByIdAndUpdate(req.user.id, {posts: userPlanCount});
            res.status(201).json(newStudyPlan);
          }
        })
    } catch (error) {
        return next(new HttpError(err))
    }
}


// GET ALL STUDY PLAN:
// GET : api/posts
//UNPROTECTED
const getStudyPlans = async (req, res, next) => {
    try {
        const studyplans = await StudyPlan.find().sort({updatedAt: -1})
        res.status(200).json(studyplans);
    } catch (error) {
        return next(new HttpError(error))
    }
}


// GET A STUDY PLAN : api/posts/:id
//UNPROTECTED
const getStudyPlan = async (req, res, next) => {
    try {
        const studyplanID = req.params.id;
        const studyplan = await StudyPlan.findById(studyplanID);
        if(!studyplan) {
            return next(new HttpError("Study plan is not found.", 404));
        }
        res.status(200).json(studyplan);
    } catch (error) {
        
    }
}

// GET STUDY PLANS BY CATEGORY : api/posts/categories/:category
//UNPROTECTED
const getCatPlans = async (req, res, next) => {
    try {
       const {category} = req.params;
       const catPlans = await StudyPlan.find({category}).sort({createdAt: -1});
       res.status(200).json(catPlans);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// GET USER PLANS : api/posts/users/:id
//UNPROTECTED
const getUserPlans = async (req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await StudyPlan.find({creator:id}).sort({createdAt: -1})
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
}





// CREATE A STUDY PLAN
// PATCH : api/posts/:id
//PROTECTED
const editStudyPlan = async (req, res, next) => {
   try {
     let fileName;
     let newFilename;
     let updatedStudyPlan;
     const studyplanID= req.params.id;
     let {title, category, description} =req.body;
     
     if (!title || description.length < 10) {
        return next(new HttpError("Fill in the all fields.", 422))
     }
     if(!req.files) {
        updatedStudyPlan = await StudyPlan.findByIdAndUpdate(studyplanID, {title,category, description},{new: true})
     } else{
        //get old study plan from database
        const oldStudyPlan = await StudyPlan.findById(studyplanID);
        //delete old thumbnail from upload
        fs.unlink(path.join(__dirname, '..','uploads',oldStudyPlan.thumbnail), async(err) =>{
            if(err){
                return next(new HttpError(err))
            }
              })
              // upload new thumbnail
            const {thumbnail} = req.files;
            // check file size
            if(thumbnail.size > 2000000){
                return next(new HttpError("Thumbnail is too big. It should be less than 2MB."))
            }
            fileName=thumbnail.name;
            let splittedFilename= fileName.split('.')
            newFilename = splittedFilename[0] + uuid() +"."+ splittedFilename[splittedFilename.length - 1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename), async(err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })

            updatedStudyPlan = await StudyPlan.findByIdAndUpdate(studyplanID,{title, category, description, thumbnail:newFilename}, {new: true});
      
     }
      if(!updatedStudyPlan){
        return next(new HttpError("Couldn't update post.", 400));
      }
      res.status(200).json(updatedStudyPlan);

   } catch (error) {
    return next(new HttpError(error))
   }
}


// DELETE A STUDY PLAN
// DELETE : api/posts/:id
//PROTECTED
const deleteStudyPlan = async (req, res, next) => {
 try {
    const studyplanID = req.params.id;
    if(!studyplanID) {
        return next(new HttpError("Study Plan is unavailable.", 400))
    }
    const studyplan = await StudyPlan.findById(studyplanID);
    const fileName = studyplan?.thumbnail;
    // delete thumbnail from uploads folder
    fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async(err) => {
        if (err) {
            return next(new HttpError(err))
        } else {
            await StudyPlan.findByIdAndDelete(studyplanID);
            const currentUser = await User.findById(req.user.id);
             const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
           
        }
    })
    res.json(`post ${studyplanID} deleted successfully`);
    
    
 } catch (error) {
    return next (new HttpError(error));
 }   
}



module.exports = {createStudyPlan, getStudyPlan, getCatPlans, getUserPlans, getStudyPlans, editStudyPlan, deleteStudyPlan}


