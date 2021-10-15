/**
 * The current plugin state
 */
const state = {
    history: []
}

/**
 *  Create button click event handler
 */
const onCreateButtonClick = async () => {

    // Create an object of all the HTML <input> values
    const inputs = {
        width: Number(document.getElementById("Width").value),
        length: Number(document.getElementById("Length").value),
        height: Number(document.getElementById("Height").value),
        divisions: Number(document.getElementById("Divisions").value)
    }

    // Create an object with some calculated constants
    const constants = {
        radius: (inputs.width / inputs.divisions) * 0.75,
        accuracy: 5
    }

    // Create a sequence of numbers from -0.5 to 0.5
    const start = -0.5;
    const end = 0.5;
    const step = 1 / inputs.divisions;
    const xCoordinates = _.range(start, end, step).concat(end)
    const yCoordinates = _.range(start, end, step).concat(end)

    // Create a new history ID and store it in the plugin state object
    state.history.push(await FormIt.GroupEdit.GetEditingHistoryID())
    
    // Loop through each of the x and y value sequences
    for(const x of xCoordinates) {
        for(const y of yCoordinates) {
            // Determine the x, y, and z values
            const pointX = x * inputs.width;
            const pointY = y * inputs.length;
            const pointZ = (Math.pow(x, 2) - Math.pow(y, 2)) * inputs.height

            // Create a 3D point with theose values
            let point = await WSM.Geom.Point3d(pointX, pointY, pointZ)

            // Get the latest history ID from the plugin state object
            const latestHistoryID = _.last(state.history)

            // Create a hemisphere geometry in FormIt
            WSM.APICreateHemisphere(latestHistoryID, constants.radius, point, constants.accuracy)
        }
    }
}

/**
 *  Undo button click event handler
 */
const onUndoButtonClick = async () => {
    // Get the latest history ID from the plugin state object
    const latestHistoryID = _.last(state.history)

    // Delete all the geometry created in the last history operation
    WSM.APIDeleteHistory(latestHistoryID)

    // Remove the latest history ID from the plugin state object
    state.history.pop()
}

// Set the create button click event listener
document.getElementById("CreateButton").addEventListener("click", onCreateButtonClick)

// Set the undo button click event listener
document.getElementById("UndoButton").addEventListener("click", onUndoButtonClick)
