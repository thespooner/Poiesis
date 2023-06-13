import {createContext, useEffect, useReducer, useState} from "react";
import uuid from "../utils/uuid";
import * as db from "../utils/db";
import * as Notifications from 'expo-notifications';
import { isDevice } from "expo-device";

export const TasksContext = createContext({
    tasks: [],
    addTask: ({name, description, startTime, endTime, daily, completed}) => {
    },
    setTasks: (tasks) => {
    },
    deleteTask: (id) => {
    },
    updateTask: (id, {name, description, completed, startTime, endTime, daily}) => {
    },
});

function tasksReducer(state, action) {
    switch (action.type) {
        case "ADD":
            const id = uuid();
            db.insertTask(
                id, action.payload.name,
                action.payload.description, action.payload.completed,
                action.payload.startTime, action.payload.endTime,
                action.payload.daily).then(r => console.log(r)).catch(e => console.log(e));
            if (isDevice) {
                Notifications.scheduleNotificationAsync({
                    identifier: id,
                    content: {
                        title: "You have a new task: " + action.payload.name,
                    },
                    trigger: {
                        date: action.payload.startTime,
                    },
                }).then(r => console.log(r)).catch(e => console.log(e));
            }
            return [{id: id, ...action.payload, completed: false}, ...state].sort((a, b) => a.startTime - b.startTime);
        case "SET":
            return action.payload.sort((a, b) => a.startTime - b.startTime);
        case "UPDATE":
            const updatableTaskIndex = state.findIndex(
                (task) => task.id === action.payload.id
            );
            const updatableTask = state[updatableTaskIndex];
            const updatedTask = {
                ...updatableTask,
                ...action.payload.taskData,
            };

            if(isDevice && updatedTask.startTime !== updatableTask.startTime) {
                // Update notification
                Notifications.cancelScheduledNotificationAsync(updatedTask.id).then(r => console.log(r)).catch(e => console.log(e));
                Notifications.scheduleNotificationAsync({
                    identifier: updatedTask.id,
                    content: {
                        title: "You have a new task: " + updatedTask.name,
                    },
                    trigger: {
                        date: updatedTask.startTime,
                    },
                }).then(r => console.log(r)).catch(e => console.log(e));
            }

            // Update database
            db.updateTask(updatedTask.id, updatedTask.name,
                updatedTask.description, updatedTask.completed,
                updatedTask.startTime, updatedTask.endTime,
                updatedTask.daily).then(r => console.log(r)).catch(e => console.log(e));

            // Update state
            const updatedTasks = [...state];
            updatedTasks[updatableTaskIndex] = updatedTask;
            return updatedTasks.sort((a, b) => a.startTime - b.startTime);
        case "DELETE":
            if (isDevice) {
                Notifications.cancelScheduledNotificationAsync(action.payload).then(r => console.log(r)).catch(e => console.log(e));
            }
            db.deleteTask(action.payload).then(r => console.log(r)).catch(e => console.log(e));
            return state.filter(({id}) => id !== action.payload);
        default:
            return state;
    }
}

function TasksContextProvider({children}) {
    const [tasksState, dispatch] = useReducer(tasksReducer, []);
    function addTask(taskData) {
        dispatch({type: "ADD", payload: taskData});
    }
    function setTasks(tasks) {
        dispatch({type: "SET", payload: tasks});
    }
    function deleteTask(id) {

        dispatch({type: "DELETE", payload: id});
    }
    function updateTask(id, taskData) {

        dispatch({type: "UPDATE", payload: {id, taskData}});
    }

    const value = {
        tasks: tasksState,
        setTasks: setTasks,
        addTask: addTask,
        deleteTask: deleteTask,
        updateTask: updateTask,
    };

    return (
        <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
    );
}

export default TasksContextProvider;
