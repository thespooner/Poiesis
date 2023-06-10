import TasksContextProvider from "./store/tasks-context";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {StatusBar} from "expo-status-bar";
import {AntDesign} from "@expo/vector-icons";
import {NavigationContainer} from "@react-navigation/native";
import {GestureHandlerRootView} from "react-native-gesture-handler";

import IconButton from "./components/UI/IconButton";
import {GlobalStyles} from "./constants/styles";
import AllTasks from "./screens/AllTasks";
import ManageTask from "./screens/ManageTask";
import DailyTasks from "./screens/DailyTasks";
import StatisticsTasks from "./screens/StatisticsTasks";
import SplashScreen from "./screens/SplashScreen";

import {init} from "./utils/db";
import {useState} from "react";
import {Image} from "react-native";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function TaskOverview() {
    return (
        <BottomTabs.Navigator
            screenOptions={({navigation}) => ({
                headerStyle: {backgroundColor: GlobalStyles.colors.background},
                headerTintColor: "white",
                tabBarStyle: {backgroundColor: GlobalStyles.colors.background},
                tabBarActiveTintColor: "lime",
                headerRight: ({tintColor}) => {
                    return (
                        <IconButton
                            stylesExtra={{marginRight: 16}}
                            icon="add"
                            size={26}
                            color={tintColor}
                            onPress={() => {
                                navigation.navigate("ManageTask");
                            }}
                        />
                    );
                },
                headerLeft: () => {
                    return (
                        <Image style={{width: 30, height: 30, marginLeft: 16}}
                               source={require('./assets/Poiesis_Logo_bg.png')}/>
                    );
                }
            })}
        >
            <BottomTabs.Screen
                name="DailyTasks"
                component={DailyTasks}
                options={{
                    title: "Tasks of the Day",
                    tabBarLabel: "Today",
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="checkcircleo" size={size} color={color}/>
                    ),
                }}
            />
            <BottomTabs.Screen
                name="AllTasks"
                component={AllTasks}
                options={{
                    title: "All Tasks",
                    tabBarLabel: "All",
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="bars" size={size} color={color}/>
                    ),
                }}
            />

            <BottomTabs.Screen
                name="StatisticsTasks"
                component={StatisticsTasks}
                options={{
                    title: "Statistics",
                    tabBarLabel: "Statistics",
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="areachart" size={size} color={color}/>
                    ),
                }}
            />
        </BottomTabs.Navigator>
    );
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    init()
        .then(() => {
            console.log('Initialized database');
            setIsLoading(false);
        })
        .catch((err) => {
            console.log('Initializing db failed');
            console.log(err);
        });
    if (isLoading) {
        return <SplashScreen/>;
    }
    return (
        <>
            <GestureHandlerRootView style={{flex: 1}}>
                <TasksContextProvider>
                    <StatusBar style="light"/>
                    <NavigationContainer>
                        <Stack.Navigator
                            screenOptions={{
                                headerStyle: {backgroundColor: GlobalStyles.colors.background},
                                headerTintColor: "white",
                            }}
                        >
                            <Stack.Screen
                                name="TaskOverview"
                                component={TaskOverview}
                                options={{headerShown: false}}
                            />
                            <Stack.Screen
                                name="ManageTask"
                                component={ManageTask}
                                initialParams={{taskId: null}}
                                options={{
                                    presentation: "modal",
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </TasksContextProvider>
            </GestureHandlerRootView>
        </>
    );
}
