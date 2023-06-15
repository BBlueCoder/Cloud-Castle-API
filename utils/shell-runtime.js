const { exec } = require('child_process');

module.exports = function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                reject(new Error(error.message));
                return;
            }

            const output = stdout + stderr;
            resolve(output);
        });
    });
};
