import React, {useContext, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import TasksList from "../components/Tasks/TaskList";
import {GlobalStyles} from "../constants/styles";
import {TasksContext} from "../store/tasks-context";
import {getDateMinusDays, getMondayOfWeek, getNextDaySameTime, onSameDay} from "../utils/date";
import * as Notifications from 'expo-notifications';
import * as db from "../utils/db";
import uuid from "../utils/uuid";
import {isDevice} from "expo-device";
import {registerForPushNotificationsAsync} from "../utils/permission";

function DailyTasks() {
    const tasksCtx = useContext(TasksContext);

    const createNewDailyTask = (oldTask) => {
        const newStartTime = getNextDaySameTime(oldTask.startTime);
        const newEndTime = getNextDaySameTime(oldTask.endTime);
        const newId = uuid();

        return {
            id: newId,
            name: oldTask.name,
            description: oldTask.description,
            completed: false,
            startTime: newStartTime,
            endTime: newEndTime,
            daily: true,
        };
    };

    const scheduleNotification = (task) => {
        Notifications.scheduleNotificationAsync({
            identifier: task.id,
            content: {
                title: "You have a new task: " + task.name,
            },
            trigger: {
                date: task.startTime,
                timeZone: 'local',
            }
        }).then(r => console.log(r)).catch(e => console.log(e));
    };

    useEffect(() => {
        const register = async () => {
            if (isDevice) {
                await registerForPushNotificationsAsync();
            }
        }

        register();
    }, []);

    useEffect(() => {
        const fetchAndHandleTasks = () => {
            const initialTasks = [];
            const newTasks = [];
            const toDelete = [];

            db.fetchTasks().then(result => {
                if (result.rows._array) {
                    for (let row = 0; result.rows._array.length > row; row++) {
                        const taskRow = result.rows._array[row];
                        const id = taskRow.id;
                        const startTime = new Date(taskRow.startTime);
                        const endTime = new Date(taskRow.endTime);
                        const completed = taskRow.completed > 0;
                        const daily = taskRow.daily > 0;

                        const task = {
                            id: id,
                            name: taskRow.name,
                            description: taskRow.description,
                            completed: completed,
                            startTime: startTime,
                            endTime: endTime,
                            daily: daily,
                        };

                        if (daily && new Date() > endTime && 24 >= Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))) {
                            let newTask = task;
                            while (new Date() > newTask.endTime) {
                                newTask = createNewDailyTask(newTask);
                                if(!newTasks.some(t =>
                                    t.name === newTask.name
                                    && t.description === newTask.description
                                    && t.startTime.toISOString() === newTask.startTime.toISOString()
                                    && t.endTime.toISOString() === newTask.endTime.toISOString())){
                                    newTasks.push(newTask);
                                }

                            }
                        }

                        if (getDateMinusDays(new Date(), 2) > endTime && daily) {
                            toDelete.push(id);
                        } else {
                            initialTasks.push(task);
                        }
                    }


                    const filteredTasks = newTasks.filter(n =>
                        !initialTasks.some(i =>
                            i.name === n.name &&
                            i.description === n.description &&
                            i.startTime.toISOString() === n.startTime.toISOString() &&
                            i.endTime.toISOString() === n.endTime.toISOString()
                        ));


                    filteredTasks.forEach((task) => {
                        if (isDevice && task.startTime > new Date()) {
                            scheduleNotification(task);
                        }
                    });
                    filteredTasks.forEach((t) => {
                        db.insertTask(t.id, t.name, t.description, t.completed, t.startTime, t.endTime, t.daily).then(r => console.log(r));
                    });
                    tasksCtx.setTasks([...initialTasks, ...filteredTasks]);
                    toDelete.forEach((id) => tasksCtx.deleteTask(id));

                }
            });
        }
        const runAtMidnight = () => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            const timeToMidnight = tomorrow - now;
            setTimeout(fetchAndHandleTasks, timeToMidnight);
        }

        // Run immediately on component mount
        fetchAndHandleTasks();

        // Then schedule to run at next midnight
        runAtMidnight();

        // Set the interval to run every day at midnight
        const intervalId = setInterval(runAtMidnight, 24 * 60 * 60 * 1000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);

    }, []);


    const tasks = tasksCtx.tasks.filter(t => onSameDay(t.startTime, new Date()));

    if (tasks.length > 0) {
        return (
            <View style={styles.container}>
                <TasksList tasks={tasks}/>
            </View>);
    } else {
        return (<View style={styles.textContainer}>
            <Text style={styles.infoText}>No tasks for today</Text>
        </View>);
    }

}

export default DailyTasks;

const styles = StyleSheet.create({
    container: {
        backgroundColor: GlobalStyles.colors.background,
        flex: 1,
    },
    textContainer: {
        backgroundColor: GlobalStyles.colors.background,
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    infoText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
});
