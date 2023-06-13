import {useState} from "react";
import {View, StyleSheet, Text, Keyboard, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {GlobalStyles} from "../../constants/styles";
import Button from "../UI/Button";
import Input from "./Input";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";


function TaskInput({defaultValues, onCancel, onSubmit}) {
    const [inputs, setInputs] = useState({
        name: {
            value: defaultValues ? defaultValues.name : "",
            isValid: true,
        },
        description: {
            value: defaultValues ? defaultValues.description : "",
            isValid: true,
        },
        startTime: {
            value: defaultValues ? defaultValues.startTime : new Date(),
            isValid: true,
        },
        endTime: {
            value: defaultValues ? defaultValues.endTime : new Date(),
            isValid: true,
        },
        daily: {
            value: defaultValues ? defaultValues.daily : false,
            isValid: true,
        }
    });

    function submitHandler() {
        const taskData = {
            name: inputs.name.value,
            description: inputs.description.value,
            completed: false,
            startTime: inputs.startTime.value,
            endTime: inputs.endTime.value,
            daily: inputs.daily.value,
        };

        const nameIsValid = taskData.name.trim().length > 0;
        const descriptionIsValid = taskData.description.trim().length > 0;
        const endTimeIsValid = taskData.startTime <= taskData.endTime;

        if (!nameIsValid || !descriptionIsValid || !endTimeIsValid) {
            setInputs((currentInput) => {
                return {
                    name: {value: currentInput.name.value, isValid: nameIsValid},
                    description: {value: currentInput.description.value, isValid: descriptionIsValid},
                    startTime: {value: currentInput.startTime.value, isValid: true},
                    endTime: {value: currentInput.endTime.value, isValid: endTimeIsValid},
                    daily: {value: currentInput.daily.value, isValid: true},
                };
            });
            return;
        }
        onSubmit(taskData);
    }

    function inputChangedValue(inputIdentifier, enteredValue) {
        setInputs((currentInput) => {
            return {
                ...currentInput,
                [inputIdentifier]: {value: enteredValue, isValid: true},
            };
        });
    }

    function dateChangedValue(inputIdentifier, selectedDate) {
        setInputs((currentInput) => {
            return {
                ...currentInput,
                [inputIdentifier]: {value: selectedDate || currentInput[inputIdentifier].value, isValid: true},
            };
        });
    }


    const formIsInvalid =
        !inputs.name.isValid ||
        !inputs.description.isValid;

    return (
        <View style={styles.form}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Input
                    label="Name"
                    invalid={!inputs.name.isValid}
                    textInputConfig={{
                        autoCorrect: false,
                        onChangeText: inputChangedValue.bind(this, "name"),
                        value: inputs.name.value,
                    }}
                />
                <Input
                    label="Description"
                    invalid={!inputs.description.isValid}
                    textInputConfig={{
                        multiline: true,
                        autoCorrect: false,
                        onChangeText: inputChangedValue.bind(this, "description"),
                        value: inputs.description.value,
                    }}
                />
                <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerText}>Start Time</Text>
                    <View style={styles.datePicker}>
                        <DateTimePicker
                            themeVariant="light"
                            testID="dateTimePicker"
                            value={inputs.startTime.value}
                            mode={'datetime'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => dateChangedValue("startTime", selectedDate)}
                        />
                    </View>
                    <Text style={[styles.datePickerText, !inputs.endTime.isValid ? styles.invalidDateText : '']}>End
                        Time</Text>

                    <View style={[styles.datePicker, !inputs.endTime.isValid ? styles.invalidDate : '']}>
                        <DateTimePicker
                            themeVariant="light"
                            testID="dateTimePicker"
                            value={inputs.endTime.value}
                            mode={'datetime'}
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedDate) => dateChangedValue("endTime", selectedDate)}
                        />
                    </View>
                    <View style={styles.dailyCheckbox}>
                        <Text style={styles.datePickerText}>Daily?</Text>
                        <Switch
                            trackColor={{false: "white", true: "lime"}}
                            thumbColor={inputs.daily.value ? GlobalStyles.colors.background : "white"}
                            onValueChange={inputChangedValue.bind(this, "daily")}
                            value={inputs.daily.value}
                            ios_backgroundColor={GlobalStyles.colors.background}
                            style={{marginLeft: 8}}
                        />
                    </View>

                </View>
            </TouchableWithoutFeedback>
            {formIsInvalid && <Text style={styles.errorText}>Please Check Data</Text>}
            <View style={styles.buttons}>
                <Button style={styles.button} onPress={onCancel}>
                    Cancel
                </Button>
                <Button style={styles.button} onPress={submitHandler}>
                    Save
                </Button>
            </View>
        </View>
    );
}

export default TaskInput;

const styles = StyleSheet.create({
    form: {
        marginTop: 40,
        marginHorizontal: 24,
    },
    errorText: {
        textAlign: "center",
        color: GlobalStyles.colors.error,
        margin: 8,
    },
    datePickerText: {
        color: "white",
        marginVertical: 8,
    },
    dailyCheckbox: {
        marginTop:12,
        flexDirection: "row",
    },
    datePickerContainer: {
        marginTop: 40,
    },
    datePicker: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 3,
        fontSize: 18,
        color: "black",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        minWidth: 120,
        marginTop: 40,
        marginHorizontal: 8,
        textColor: "white",
    },
    invalidDate: {
        borderRadius: 3,
        borderWidth: 2,
        borderColor: GlobalStyles.colors.error,
    },
    invalidDateText: {
        color: GlobalStyles.colors.error,
    }
});
