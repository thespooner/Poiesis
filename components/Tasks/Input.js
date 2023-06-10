import {View, Text, TextInput, StyleSheet} from "react-native";
import {GlobalStyles} from "../../constants/styles";


function Input({invalid, label, style, textInputConfig}) {
    const inputStyles = [styles.input];
    if (textInputConfig && textInputConfig.multiline) {
        inputStyles.push(styles.inputMultiline);
    }

    if (invalid) {
        inputStyles.push(styles.invalidInput);
    }

    return (

        <View style={[styles.inputContainer, style]}>
            <Text style={[styles.label, invalid && styles.invalidLabel]}>
                {label}
            </Text>
            <TextInput style={inputStyles} {...textInputConfig} />
        </View>

    );
}

export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 6,
    },
    label: {
        fontSize: 12,
        color: "white",
        marginBottom: 4,
    },
    input: {
        backgroundColor: "white",
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
        color: "black",
    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    invalidLabel: {
        color: GlobalStyles.colors.error,
    },
    invalidInput: {
        backgroundColor: GlobalStyles.colors.error,
    },
});
