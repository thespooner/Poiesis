import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";
import {TasksContext} from "../store/tasks-context";
import TaskInput from "../components/Tasks/TaskInput";

function ManageTask({route, navigation}) {
  const tasksCtx = useContext(TasksContext);
  const { taskId } = route.params;

  useEffect(() => {
    if(!taskId) {
      navigation.setOptions({title: "Add Task"})
    }else {
      navigation.setOptions({title: "Edit Task"})
    }
  }, [taskId, navigation]);

  const cancelHandler = () => {
    navigation.goBack();
  }

  const submitHandler = (taskData) => {

    if(!taskId) {
      tasksCtx.addTask(taskData);
    }else {
      console.log(taskId);
      tasksCtx.updateTask(taskId, taskData);
    }
    navigation.goBack();
  }

  const task = tasksCtx.tasks.find(task => task.id === taskId) ?? null;
  return (
      <View style={styles.container}>
        <TaskInput defaultValues={task} onCancel={cancelHandler} onSubmit={submitHandler}/>
      </View>
  );
}

export default ManageTask;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    flex: 1,
  },
});