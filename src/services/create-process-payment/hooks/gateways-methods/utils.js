const longPollingData = async (fetch, stop) => {
    let response = await fetch()

    if (stop(response)) return response

    await new Promise(resolve => setTimeout(resolve, 1000))
    return await longPollingData(fetch, stop) 
}

module.exports = {
    longPollingData
}