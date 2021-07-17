const router = require("express").Router();
const Todo = require("../models/todoModel");
const convert = require('color-convert');
const {check, validationResult} = require('express-validator');
const _ = require('lodash');


// @route    POST http://localhost:5000/todo
// @desc     Save new todo to the database
// @access   public
router.post("/todo", [
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

//@route    GET http://localhost:5000/todos
//@desc     Get all todos from the database
//@access   public
router.get("/todos", async(req,res)=>{
    try{
        const TodoRequsets = await Todo.find()
        res.json(TodoRequsets);
    }catch(err){
        console.log(err);
        res.status(500).send({status: "Error with getting todos", error: err.message});
    }
});

//@route    UPDATE http://localhost:5000/todo/60f29abc4afaa76358ec5218
//@desc     Update todo with a perticular ID
//@access   public
router.put("/todo/:id", [
        // @validations
        check('title', 'title is empty').not().isEmpty().trim().escape(),
        check('timestamp', 'Invalid timestamp').not().isEmpty().trim().escape().matches(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
        check('color', 'Invalid Color filed').not().isEmpty().trim().escape().isHexColor(),
        check('completed', 'Invalid completed status').not().isEmpty().isBoolean(),
        check('priority', 'priority is empty').not().isEmpty().trim().escape(),
    ],
    async(req, res) =>{        
    
        try{
            const {title, timestamp, color, completed, priority} = req.body;

            //handling request validations
            const error = validationResult(req);
            if(!error.isEmpty())
                return res.status(400).json({
                    erroMessage: error
                });

            const updateTodo = {title, timestamp, color, completed, priority}
            let id = req.params.id;
            const updatedTodo = await Todo.findByIdAndUpdate(id , updateTodo)
            if(!updatedTodo)
                return res.status(400).json({
                    erroMessage: "Todo not found"
                });
            res.json({status: "Todo Updated"});
        }catch(err){
            console.log(err);
            res.status(500).send({status: "Error with updating todo", error: err.message});
        }
});

//@route    DELETE http://localhost:5000/todo/60f28b4699e56f1750fa0bc7
//@desc     Delete todo with a perticular ID
//@access   public
router.delete("/todo/:id", async(req,res)=>{
    try{
        let Id = req.params.id;

        const deletedTodo = await Todo.findByIdAndDelete(Id)
        if(!deletedTodo)
            return res.status(400).json({
                erroMessage: "Todo not found!"
            });
        res.status(200).send({status: "Todo deleted!"});
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "Error with deleting todo", error: err.message});
    }
});

//@route    GET http://localhost:5000/todo?any=any&any=any&any=any
//@desc     filter todo by any query keyword (FILTER COMBINATIONS ARE ALSO WORKING)
//@access   public
router.get('/todo', async(req, res) => {
    try{
        //get filter queries passed in the url
        const filters = req.query;
        //retrieve all todo data from database
        const allTodoData = await Todo.find()

        //Method to filter todo by any query keyword set
        const filteredTodos = allTodoData.filter(todo => {
            let isValid = true;
            for (key in filters) {
                //returns todos which contains the word in serch keyword
                //URL: http://localhost:5000/todo?searchKeyword=any
                if(key == "searchKeyword"){
                    isValid = isValid &&  todo["title"].includes(filters[key]);
                }
                //returns todos which have the same priority passed in url
                //URL: http://localhost:5000/todo?filterByPriority=any
                if(key == "filterByPriority"){
                    isValid = isValid && todo["priority"] == filters[key];
                }
                //returns todos which have the color code of the color specified in url
                //URL: http://localhost:5000/todo?filterByColor=any
                if(key == "filterByColor"){
                    isValid = isValid && todo["color"] == ('#'+convert.keyword.hex(filters[key]));
                }
                //filter todos by start date or end date
                if(key == "startDate" || key == "endDate"){
                    let Year = todo["timestamp"].getFullYear();
                    let Month = todo["timestamp"].getMonth()+1;
                    if(Month<10)
                        Month = '0' + Month
                    let Day = todo["timestamp"].getDate()-1;
                    if(Day<10)
                        Day = '0' + Day
                    const retrievedFullDate = (Year+"-"+Month+"-"+Day)
                    const DatePassedInURL = (filters[key])
                    //returns todos that are created after the specifeid date if url key is startDate
                    //URL: http://localhost:5000/todo?startDate=any
                    if(key == "startDate"){
                        isValid = isValid && DatePassedInURL<=retrievedFullDate
                    }
                       
                    //returns todos that are created before the specifeid date if url key is endDate
                    //URL: http://localhost:5000/todo?endDate=any
                    if(key == "endDate"){
                        isValid = isValid && DatePassedInURL>=retrievedFullDate
                    }
                }
            }
            return isValid;
        });
        //return error status if search result is empty
        if(Object.keys(filteredTodos).length === 0)
            return res.status(400).json({
                erroMessage: "Could not find match"
            });

        //If group by is specified data are grouped by month or year
        //URL: http://localhost:5000/todo?&groupBy=month/year
        if(filters.hasOwnProperty('groupBy')){

            //creating new json array with only title,month and year properties
            var newJsonArray = []
            for(var i = 0; i < filteredTodos.length; i++) {
                var obj = filteredTodos[i];

                let Year = obj.timestamp.getFullYear();
                let Month = obj.timestamp.getMonth()+1;

                var newObj = {
                    "todo_title" : obj.title,   
                    "month" : Month,
                    "year" : Year     
                };
                newJsonArray.push(newObj)
            }
            //grouping by month 
            if(filters["groupBy"]=="month"){

                return res.send( _.groupBy(newJsonArray, "month"));
               
            }
            //grouping by year 
            else if(filters["groupBy"]=="year"){
                return res.send( _.groupBy(newJsonArray, "year"));
            }
            //if error occurs 
            else{
                return res.status(400).json({
                    erroMessage: "Could not find match"
                });
            }
        }

        //if groupBy not specified
        res.send(filteredTodos);
    }catch(err){
        console.log(err.message);
        res.status(500).send({status: "Error with getting todo", error: err.message});
    }
});


module.exports = router;




