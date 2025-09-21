import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
    try{
       const result = await Task.aggregate([
        {
            $facet: {
                tasks: [{ $sort: { createdAt: -1 }}],
                activeCount: [{ $match: { status: "active"}}, { $count: "count"}],
                completeCount: [{ $match: { status: "complete"}}, { $count: "count"}],
            },
        },
       ]);
       
       const tasks = result[0].tasks;
       const activeCount = result[0].activeCount[0]?.count || 0;
       const completeCount = result[0].completeCount[0]?.count || 0;

       res.status(200).json({tasks, activeCount, completeCount});
    }catch (error) {
        console.error("lỗi khi gọi getAllTaskes", error);
        res.status(500).json({message: "lỗi hệ thống"});
    }
}

export const createTask = async (req, res) =>{
    try{
       const {title} = req.body;
       const task = new Task({title});
       const newTask = await task.save();
       res.status(200).json(newTask);
    }catch (error) {
        console.error("lỗi khi gọi createTask", error);
        res.status(500).json({message: "lỗi hệ thống"});
    }
}

export const updateTask = async (req, res) =>{
     try{
       const {title, status, completedAt} = req.body;
       const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        {
            title,
            status,
            completedAt
        },
        {new : true}
       );
       if(!updateTask) {
        return res.status(404).json({message: "nhiệm vụ không tồn tại"})
       };

       res.status(200).json(updateTask)
    }catch (error) {
        console.error("lỗi khi gọi updateTask", error);
        res.status(500).json({message: "lỗi hệ thống"});
    }
}

export const deleteTask = async (req, res) =>{
     try{
       const deleteTask = await Task.findByIdAndDelete(req.params.id);

       if (!deleteTask) {
        return res.status(404).json({ message: "nhiệm vụ không tồn tại"});
       }
       res.status(200).json(deleteTask);
    }catch (error) {
        console.error("lỗi khi gọi deleteTask", error);
        res.status(500).json({message: "lỗi hệ thống"});
    }
}