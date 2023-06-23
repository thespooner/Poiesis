import {View, Text, StyleSheet, Pressable, Animated} from "react-native";
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {useNavigation} from "@react-navigation/native";

import {GlobalStyles} from "../../constants/styles";
import IconButton from "../UI/IconButton";
import {getDayName, getDuration, getFormattedDate, getFormattedTime} from "../../utils/date";
import {useContext, useRef, useState} from "react";
import {TasksContext} from "../../store/tasks-context";

function TaskItem({id, name, description, completed, startTime, endTime, daily}) {
    const tasksCtx = useContext(TasksContext);
    const navigation = useNavigation();
    const [isExpanded, setIsExpanded] = useState(false);
    const swipeableRef = useRef(null);

    function taskEditHandler() {
        navigation.navigate("ManageTask", {
            taskId: id,
        });
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    const completeTaskHandler = () => {
        swipeableRef.current.close();
        tasksCtx.updateTask(id, {completed: !completed});

    }

    const deleteTaskHandler = () => {
        tasksCtx.deleteTask(id);
    }

    const renderRightActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });
        return (
            <RectButton onPress={deleteTaskHandler}>
                <Animated.View
                    style={[
                        styles.rightAction,
                        {
                            transform: [{translateX: trans}],
                        },
                    ]}
                >
                    <IconButton icon={"close-circle-sharp"} size={33}
                                color={GlobalStyles.colors.error}/>
                </Animated.View>
            </RectButton>
        );
    };

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [0, 0, 0, 1],
        });
        return (
            <RectButton onPress={completeTaskHandler}>
                <Animated.View
                    style={[
                        styles.leftAction,
                        {
                            transform: [{translateX: trans}],
                        },
                    ]}
                >
                    {completed ? <IconButton icon={"arrow-undo-sharp"} size={33} color={"white"}/> :
                        <IconButton icon={"checkmark-circle"} size={33} color={"lime"}/>}
                </Animated.View>
            </RectButton>
        );
    };

    return (
        <View style={[styles.taskItem, completed ? styles.taskItemCompleted : '']}>
            <Swipeable renderRightActions={renderRightActions}
                       renderLeftActions={renderLeftActions}
                       friction={2}
                       ref={swipeableRef}
            >
                <Pressable style={styles.headerContainer} onPress={toggleExpand}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}> {name} </Text>
                        {completed && <IconButton icon={"checkmark"} size={20} color={"lime"}/>}
                        {!isExpanded && <Text style={styles.title}> {getFormattedTime(startTime)} * {getFormattedTime(endTime)} </Text>}
                    </View>
                    <IconButton icon={isExpanded ? "arrow-up" : "arrow-down"} onPress={toggleExpand} color={"white"}
                                size={20}/>
                </Pressable>

                {isExpanded && (
                    <View style={styles.expandContainer}>
                        <View style={styles.detailsContainer}>
                            <Text style={styles.description}>{description}</Text>
                        </View>
                        <View style={styles.timeContainer}>
                            <Text style={styles.time}>Date: {getFormattedDate(startTime)} </Text>
                            <Text style={styles.time}>Day: {getDayName(startTime)} </Text>
                        </View>
                        <View style={styles.timeContainer}>
                            <Text style={styles.time}>Start: {getFormattedTime(startTime)} </Text>
                            <Text style={styles.time}>End: {getFormattedTime(endTime)} </Text>
                        </View>
                        <View style={styles.timeContainer}>
                            <Text style={styles.time}>Duration: {getDuration(startTime, endTime)} </Text>
                            <Text style={styles.time}>Daily?: {daily ? "Yes" : "No"} </Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <IconButton color={"white"} size={30} icon={"create-outline"}
                                        onPress={taskEditHandler}></IconButton>
                        </View>
                    </View>)}

            </Swipeable>
        </View>
    );
}

export default TaskItem;

const styles = StyleSheet.create({
    taskItem: {
        backgroundColor: GlobalStyles.colors.background,
        padding: 12,
        marginVertical: 8,
        borderRadius: 6,
        elevation: 3,
        shadowColor: "white",
        shadowRadius: 3,
        shadowOffset: {width: 1, height: 1},
        shadowOpacity: 0.2,

    },
    taskItemCompleted: {
        borderColor: GlobalStyles.colors.success,
        borderWidth: 2,

    },
    headerContainer: {
        flexDirection: "row",
        backgroundColor: GlobalStyles.colors.background,
        padding: 2,
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        marginBottom: 10,
    },
    expandContainer: {
        backgroundColor: GlobalStyles.colors.background,
    },
    titleContainer: {
        flexDirection: "row",
    },
    detailsContainer: {
        backgroundColor: "white",
        borderRadius: 6,
        padding: 5,
        marginVertical: 10,
        marginHorizontal: 10,
    },

    title: {
        fontSize: 16,
        padding: 8,
        color: "white",
        fontWeight: "bold",
    },
    description: {
        backgroundColor: "white",
        color: "black",
        marginVertical: 8,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iconContainer: {
        alignItems: 'flex-end',
    },
    time: {
        color: "white",
        fontWeight: "bold",
        padding: 5,
        marginHorizontal: 10

    },
    leftAction: {
        flex: 1,
        justifyContent: 'center',
    },
    rightAction: {
        flex: 1,
        justifyContent: 'center',
    },
});
