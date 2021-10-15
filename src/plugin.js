/**
 * The current plugin state
 */
const state = {
    history: [],
    autoRunEnabled: true
}

/**
 *  Create a hyperbolic paraboloid
 */
const createHyperbolicParaboloid = async () => {

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
            const pointX = x * inputs.width
            const pointY = y * inputs.length
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
 *  Undo the last history item
 */
const undoLastHistory = async () => {
    // If there is history
    if(state.history.length > 0) {
        // Get the last history ID from the plugin state object
        const lastHistoryID = _.last(state.history)
    
        // Delete all the geometry created in the last history operation
        WSM.APIDeleteHistory(lastHistoryID)
    
        // Remove the latest history ID from the plugin state object
        state.history.pop()
    }
}

/**
 *  Update the auto run state
 */
const setAutoRun = async (event) => {
    state.autoRunEnabled = event.target.checked
}

/**
 *  Auto run createHyperbolicParaboloid if auto run is enabled
 */
const autoRunCreateHyperbolicParaboloid = async () => {
    // If auto run is enabled
    if(state.autoRunEnabled) {
        // Undo the last history item
        undoLastHistory()

        // Create a hyperbolic paraboloid
        createHyperbolicParaboloid()
    }
}

// Trigger createHyperbolicParaboloid when the create button is clicked
document.getElementById("CreateButton").addEventListener("click", createHyperbolicParaboloid)

// Trigger undoLastHistory when the undo button is clicked
document.getElementById("UndoButton").addEventListener("click", undoLastHistory)

// Trigger undoLastHistory when the undo button is clicked
document.getElementById("AutoRun").addEventListener("change", setAutoRun)

// Trigger autoRunCreateHyperbolicParaboloid when a range slider is changed
document.querySelectorAll("input[type='range']").forEach((x) => x.addEventListener("change", autoRunCreateHyperbolicParaboloid))
