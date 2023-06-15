const getHostIPv4 = () => {
    const ipList = Object.values(require('os').networkInterfaces())
        .flat()
        .filter(({ family, internal }) => family === 'IPv4' && !internal)
        .map(({ address }) => address);

    if (ipList.length > 0) return ipList[0];
    return '';
};

module.exports = getHostIPv4;
