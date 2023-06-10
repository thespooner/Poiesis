import React, {useContext, useEffect, useState} from "react";
import {View, Text, StyleSheet} from "react-native";
import TasksList from "../components/Tasks/TaskList";
import {GlobalStyles} from "../constants/styles";
import {TasksContext} from "../store/tasks-context";
import {getMondayOfWeek, getTomorrowDaySameTime, onSameDay} from "../utils/date";
import * as Notifications from 'expo-notifications';
import * as db from "../utils/db";
import uuid from "../utils/uuid";
import {isDevice} from "expo-device";
import {registerForPushNotificationsAsync} from "../utils/permission";

function DailyTasks() {
    useEffect(() => {
        const register = async () => {
            if (isDevice) {
                await registerForPushNotificationsAsync();
            }
        }

        register().then(r => console.log(r)).catch(e => console.log(e));
    }, []);

    const tasksCtx = useContext(TasksContext);

    // Fetch tasks from database
    useEffect(async () => {
        const initialTasks = [];
        const newTasks = [];
        const toDelete = [];
        db.fetchTasks().then((result) => {
            for (let row = 0; result.rows._array.length > row; row++) {

                const id = result.rows._array[row].id;
                const startTime = new Date(result.rows._array[row].startTime);
                const endTime = new Date(result.rows._array[row].endTime);
                const completed = result.rows._array[row].completed > 0;
                const daily = result.rows._array[row].daily > 0;

                if (daily && new Date() > endTime) {
                    // Recreate daily task for the next day
                    const newStartTime = getTomorrowDaySameTime(startTime);
                    const newEndTime = getTomorrowDaySameTime(endTime);
                    const newId = uuid();
                    newTasks.push({
                        id: newId,
                        name: result.rows._array[row].name,
                        description: result.rows._array[row].description,
                        completed: false,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        daily: true
                    });
                    if (isDevice) {
                        // Schedule notification for the next day
                        Notifications.scheduleNotificationAsync({
                            identifier: newId,
                            content: {
                                title: "You have a new task: " + result.rows._array[row].name,
                            },
                            trigger: {
                                date: newStartTime,  // Trigger on newStartTime
                                timeZone: 'local',  // Ensure the notification is scheduled in local time
                            }
                        }).then(r => console.log(r)).catch(e => console.log(e));
                    }
                }

                // Delete tasks that are completed and recreate daily
                if (getMondayOfWeek(new Date()) > endTime) {
                    if (completed) {
                        toDelete.push(id);
                    }
                    continue;
                }

                initialTasks.push({
                    id: id,
                    name: result.rows._array[row].name,
                    description: result.rows._array[row].description,
                    completed: completed,
                    startTime: startTime,
                    endTime: endTime,
                    daily: daily,
                });
            }
            tasksCtx.setTasks([...initialTasks, ...newTasks]);


            // After setting tasks, delete tasks that need to be deleted
            toDelete.forEach((id) => {
                tasksCtx.deleteTask(id);
            });

            // After setting tasks, insert new tasks to database
            newTasks.forEach((task) => {
                db.insertTask(task).then(r => console.log(r));
            });

        });
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
