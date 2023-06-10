class Task{
    constructor(id, name, description, startTime, endTime, daily){
        this.id = id;
        this.name = name;
        this.description = description;
        this.completed = false;
        this.startTime = startTime;
        this.endTime = endTime;
        this.daily = daily;
    }
}
export default Task;