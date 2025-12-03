const {Router} = require("express");


const router = Router();


router.get("/", (req, res)=>{
    res.send("All product Route")
});

router.get("/:id", (req, res)=>{
    res.send("single product Route")
});

router.post("/", (req, res)=>{
    res.send("create product Route")
});

router.put("/:id", (req, res)=>{
    res.send("update product Route")
});

router.delete("/:id", (req, res)=>{
    res.send("delete product Route")
});

module.exports= router;