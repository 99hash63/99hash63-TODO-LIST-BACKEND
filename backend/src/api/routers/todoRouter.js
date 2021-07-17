const router = require("express").Router();
const Todo = require("../models/todoModel");
const {check, validationResult} = require('express-validator');



@route    POST http://localhost:5000/todo
@desc     Save new todo to the database
@access   public
router.post("/", [
        // @validations
        check('title', 'title is empty').not().isEmpty().trim().escape(),
        check('timestamp', 'Invalid timestamp').not().isEmpty().trim().escape().matches(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
        check('color', 'Invalid Color filed').not().isEmpty().trim().escape().isHexColor(),
        check('completed', 'Invalid completed status').not().isEmpty().isBoolean(),
        check('priority', 'priority is empty').not().isEmpty().trim().escape(),
    ],
    async(req,res)=>{
        try{
            const {title, timestamp, color, completed, priority} = req.body;
            
            //handling request validations
             const error = validationResult(req);
             if(!error.isEmpty())
                 return res.status(400).json({
                     erroMessage: error
                 });

            const newTodo = new Todo({title, timestamp, color, completed, priority})
            await newTodo.save()
            res.json("Todo Added");
        }catch(err){
            console.error(err);
            res.status(500).send({status: "Error with adding todo", error: err.message});
        }
});



//@route    GET http://localhost:5000/categories/get
//@desc     Get all categories from the database
//@access   public
// router.get("/get", async(req,res)=>{
//     try{
//         const CategoryRequsets = await Category.find()
//         res.json(CategoryRequsets);
//     }catch(err){
//         console.log(err);
//         res.status(500).send({status: "Error with getting categories", error: err.message});
//     }
// })



// //@route    GET http://localhost:5000/categories/get/:id
// //@desc     Get category for a perticular ID
// //@access   public
// router.get('/get/:id', async(req, res) => {
//     try{
//         let id = req.params.id;

//         const CategoryRequset = await Category.findById(id)
//         if(!CategoryRequset)
//             return res.status(400).json({
//                 erroMessage: "invalid id"
//             });
//         res.json(CategoryRequset);
//     }catch(err){
//         console.log(err);
//         res.status(500).send({status: "Error with getting category", error: err.message});
//     }
// });
   

//@route    UPDATE http://localhost:5000/UPDATE/todo/:id
//@desc     Update todo with a perticular ID
//@access   public
// router.put("UPDATE/:id", [
//         // @validations
//         check('timestamp', 'Invalid timestamp').trim().escape().matches(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
//         check('color', 'Invalid Color filed').not().isEmpty().trim().escape().isHexColor(),
//         check('completed', 'Invalid completed status').not().isEmpty().isBoolean(),
//         check('priority', 'priority is empty').not().isEmpty().trim().escape(),
//     ],
//     auth, async(req, res) =>{        
    
//         try{
//             const {name, desc} = req.body;

//             //handling request validations
//             const error = validationResult(req);
//             if(!error.isEmpty())
//                 return res.status(400).json({
//                     erroMessage: error
//                 });

//             const updateCategory = {name, desc}
//             let id = req.params.id;
//             const updatedCategory = await Category.findByIdAndUpdate(id , updateCategory)
//             if(!updatedCategory)
//                 return res.status(400).json({
//                     erroMessage: "invalid id"
//                 });
//             res.json({status: "Category Updated"});
//         }catch(err){
//             console.log(err);
//             res.status(500).send({status: "Error with updating category", error: err.message});
//         }
// });

// //@route    DELETE http://localhost:5000/todo/:id
// //@desc     Dlete todo with a perticular ID
// //@access   public
// router.delete("/:id", async(req,res)=>{
//     try{
//         let Id = req.params.id;

//         const deletedTodo = await Todo.findByIdAndDelete(Id)
//         if(!deletedTodo)
//             return res.status(400).json({
//                 erroMessage: "Todo not found!"
//             });
//         res.status(200).send({status: "Todo deleted!"});
//     }catch(err){
//         console.log(err.message);
//         res.status(500).send({status: "Error with deleting todo", error: err.message});
//     }
// });


module.exports = router;




