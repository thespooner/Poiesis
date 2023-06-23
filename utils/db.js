import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('tasks.db');

export const init = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, completed INTEGER NOT NULL, startTime TEXT NOT NULL, endTime TEXT NOT NULL, daily INTEGER NOT NULL);',
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
};

export const insertTask = (id, name, description, completed, startTime, endTime, daily) => {
    if(!name || !description) {
        return Promise.reject(new Error("Name or description cannot be empty!"));
    }

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'INSERT INTO tasks (id, name, description, completed, startTime, endTime, daily) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, name, description, completed ? 1 : 0, startTime.toISOString(), endTime.toISOString(), daily ? 1 : 0],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
};

export const updateTask = (id, name, description, completed, startTime, endTime, daily) => {
    if(!name || !description) {
        return Promise.reject(new Error("Name or description cannot be empty!"));
    }

    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE tasks SET name = ?, description = ?, completed = ?, startTime = ?, endTime = ?, daily = ? WHERE id = ?',
                [name, description, completed ? 1 : 0, startTime.toISOString(), endTime.toISOString(), daily ? 1 : 0, id],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
}

export const fetchTasks = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM tasks',
                [],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });
};

export const deleteTask = (id) => {
    if(!id) {
        return Promise.reject(new Error("ID cannot be empty!"));
    }
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM tasks WHERE id = ?',
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    }).then(r => console.log(r)).catch(e => console.log(e));
}