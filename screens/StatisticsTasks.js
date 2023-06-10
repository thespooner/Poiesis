import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../constants/styles";
import TaskStatistics from "../components/Statistics/TaskStatistics";

function StatisticsTasks() {
  return (
    <View style={styles.container}>
      <TaskStatistics/>
    </View>
  );
}

export default StatisticsTasks;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.background,
    flex: 1,
  },
});
