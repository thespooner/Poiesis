import {StyleSheet, Text, View} from "react-native";
import {GlobalStyles} from "../../constants/styles";
import {useContext} from "react";
import {TasksContext} from "../../store/tasks-context";
import {getMondayOfWeek, getSundayOfWeek} from "../../utils/date";


function TaskStatistics() {
    const tasksCtx = useContext(TasksContext);
    const numTasksCompleted = tasksCtx.tasks.filter(t => t.completed).length;
    const numWeeklyTasksCompleted = tasksCtx.tasks.filter(t =>
        t.completed
        && getMondayOfWeek(t.startTime) < t.startTime
        && getSundayOfWeek(t.startTime) > t.startTime).length;
    const numWeeklyTasksPending = tasksCtx.tasks.filter(t =>
        !t.completed
        && getMondayOfWeek(t.startTime) < t.startTime
        && getSundayOfWeek(t.startTime) > t.startTime ).length;
    const numTasksPending = tasksCtx.tasks.length - numTasksCompleted;
    const WeekNumber = () => {
        const now = new Date();
        const oneJan = new Date(now.getFullYear(), 0, 1);
        return Math.ceil((((now.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.textTitle}>Week Number: {WeekNumber()}</Text>
                <Text style={styles.text}>Number of tasks completed: {numWeeklyTasksCompleted}</Text>
                <Text style={styles.text}>Number of tasks pending: {numWeeklyTasksPending}</Text>
            </View>
        </View>);
}

export default TaskStatistics;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GlobalStyles.colors.background,
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        color: GlobalStyles.colors.text,
        fontSize: 20,
        fontWeight: "bold",
        padding: 5,
        textAlign: 'center',
    },
    textTitle: {
        color: GlobalStyles.colors.text,
        fontSize: 30,
        fontWeight: "bold",
        padding: 5,
        textDecorationLine: "underline",
        textAlign: 'center',
    }
});
