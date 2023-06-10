import React, {useContext} from "react";
import {View, StyleSheet, Text} from "react-native";
import { GlobalStyles } from "../constants/styles";
import {TasksContext} from "../store/tasks-context";
import TasksList from "../components/Tasks/TaskList";

function AllTasks() {
  const tasksCtx = useContext(TasksContext);
    if (tasksCtx.tasks.length > 0) {
        return (
            <View style={styles.container}>
                <TasksList tasks={tasksCtx.tasks}/>
            </View>);
    } else {
        return (<View style={styles.textContainer}>
            <Text style={styles.infoText}>No tasks</Text>
        </View>);
    }
}

export default AllTasks;

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
